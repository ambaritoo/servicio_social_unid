"use client";

import React, { useState, useEffect } from "react";
import SiteLayout from "../layout/SiteLayout";
import { supabase } from "@/database/supabaseClient";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Page = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: estudiantesData,
        error: estudiantesError,
      } = await supabase.from("estudiantes").select("*");

      const {
        data: programasData,
        error: programasError,
      } = await supabase.from("programas_estudio").select("*");

      if (estudiantesError || programasError) {
        console.error(
          "Error fetching data:",
          estudiantesError || programasError
        );
        setError(estudiantesError?.message || programasError?.message);
      } else {
        console.log("Estudiantes:", estudiantesData);
        console.log("Programas:", programasData);
        setEstudiantes(estudiantesData);
        setProgramas(programasData);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const getProgramaNombre = (programaId) => {
    const programa = programas.find((p) => p.id === programaId);
    return programa ? programa.nombre : "Unknown";
  };

  return (
    <SiteLayout>
      <div>Estudiantes</div>
      <Table>
        <TableCaption>Lista de Estudiantes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Número de Control</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Programa</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {estudiantes.map((estudiante) => (
            <TableRow key={estudiante.id}>
              <TableCell className="font-medium">{estudiante.id}</TableCell>
              <TableCell>{estudiante.numero_control}</TableCell>
              <TableCell>{estudiante.nombre}</TableCell>
              <TableCell>{getProgramaNombre(estudiante.programa_id)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>
              Total de Estudiantes: {estudiantes.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </SiteLayout>
  );
};

export default Page;
