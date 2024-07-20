"use client";

import React, { useState } from "react";
import { usePapaParse } from "react-papaparse";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { supabase } from "@/database/supabaseClient";

const CargarCSV = () => {
  const { readString } = usePapaParse();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const csvData = event.target.result;
      readString(csvData, {
        header: true,
        complete: (results) => {
          setData(results.data);
        },
      });
    };

    reader.readAsText(file);
  };

  const handleUploadToDatabase = async () => {
    setIsLoading(true);
    try {
      for (const item of data) {
        // Buscar programa de estudio
        let { data: programa, error: programaError } = await supabase
          .from("programas_estudio")
          .select("id")
          .eq("nombre", item.Programa)
          .single();

        if (programaError) {
          console.error("Error fetching programa:", programaError.message);
          throw programaError;
        }

        if (!programa) {
          let { data: newPrograma, error: newProgramaError } = await supabase
            .from("programas_estudio")
            .insert([{ nombre: item.Programa }])
            .select()
            .single();

          if (newProgramaError) {
            console.error("Error inserting programa:", newProgramaError.message);
            throw newProgramaError;
          }

          programa = newPrograma;
        }

        // Buscar empresa
        let { data: empresa, error: empresaError } = await supabase
          .from("empresas")
          .select("id")
          .eq("nombre", item.Empresa)
          .single();

        if (empresaError) {
          console.error("Error fetching empresa:", empresaError.message);
          throw empresaError;
        }

        if (!empresa) {
          let { data: newEmpresa, error: newEmpresaError } = await supabase
            .from("empresas")
            .insert([{ nombre: item.Empresa }])
            .select()
            .single();

          if (newEmpresaError) {
            console.error("Error inserting empresa:", newEmpresaError.message);
            throw newEmpresaError;
          }

          empresa = newEmpresa;
        }

        // Insertar estudiante
        let { data: estudiante, error: estudianteError } = await supabase
          .from("estudiantes")
          .insert([
            {
              numero_control: item["Número de Control"],
              nombre: item.Nombre,
              programa_id: programa.id,
            },
          ])
          .select()
          .single();

        if (estudianteError) {
          console.error("Error inserting estudiante:", estudianteError.message);
          throw estudianteError;
        }

        // Insertar servicio social
        const { error: servicioError } = await supabase.from("servicio_social").insert([
          {
            estudiante_id: estudiante.id,
            empresa_id: empresa.id,
            actividad_descripcion: item.Actividad,
            fecha_inicio: item["Fecha de Inicio"],
            fecha_fin: item["Fecha de Fin"],
            fecha_constancia: item["Fecha de Constancia"],
          },
        ]);

        if (servicioError) {
          console.error("Error inserting servicio social:", servicioError.message);
          throw servicioError;
        }
      }

      alert("Datos subidos con éxito");
    } catch (error) {
      console.error("Error subiendo datos:", error.message);
      alert("Hubo un error al subir los datos");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {data.length > 0 && (
        <>
          <Table>
            <TableCaption>Datos Cargados</TableCaption>
            <TableHeader>
              <TableRow>
                {Object.keys(data[0]).map((key) => (
                  <TableHead key={key}>{key}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, i) => (
                    <TableCell key={i}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleUploadToDatabase} disabled={isLoading}>
            {isLoading ? "Subiendo..." : "Subir Datos"}
          </Button>
        </>
      )}
    </div>
  );
};

export default CargarCSV;
