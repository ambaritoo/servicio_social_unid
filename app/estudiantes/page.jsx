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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiseLoader } from "react-spinners";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Page = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [nombre, setNombre] = useState("");
  const [numeroControl, setNumeroControl] = useState("");
  const [programaId, setProgramaId] = useState("");
  const [password, setPassword] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
        setError(
          estudiantesError?.message || programasError?.message
        );
      } else {
        console.log("Estudiantes:", estudiantesData);
        console.log("Programas:", programasData);
        setEstudiantes(estudiantesData);
        setFilteredEstudiantes(estudiantesData);
        setProgramas(programasData);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const getProgramaNombre = (programaId) => {
    const programa = programas.find((p) => p.id === programaId);
    return programa ? programa.nombre : "";
  };

  const handleDelete = async (id) => {
    if (password === "UNID") {
      const { error } = await supabase
        .from("estudiantes")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting student:", error.message);
        alert("Error deleting student: " + error.message);
      } else {
        setEstudiantes(
          estudiantes.filter((estudiante) => estudiante.id !== id)
        );
        setFilteredEstudiantes(
          filteredEstudiantes.filter((estudiante) => estudiante.id !== id)
        );
        setPassword("");
        setIsDeleteOpen(false);
      }
    } else {
      alert("Incorrect password!");
    }
  };

  const handleAddStudent = async (event) => {
    event.preventDefault();

    const { data: existingStudent, error: existingError } = await supabase
      .from("estudiantes")
      .select("*")
      .eq("numero_control", numeroControl);

    if (existingStudent && existingStudent.length > 0) {
      alert("El número de control ya existe. No se puede duplicar.");
      return;
    }

    const { data, error } = await supabase
      .from("estudiantes")
      .insert([
        {
          nombre,
          numero_control: numeroControl,
          programa_id: programaId,
        },
      ])
      .select();

    if (error) {
      alert("Error adding student:", error.message);
    } else {
      const newStudent = {
        ...data[0],
      };
      setEstudiantes([...estudiantes, newStudent]);
      setFilteredEstudiantes([...filteredEstudiantes, newStudent]);
      setNombre("");
      setNumeroControl("");
      setProgramaId("");
      setIsAddOpen(false);
    }
  };

  const handleEditStudent = async (event) => {
    event.preventDefault();

    const { data: updatedEstudiante, error: estudianteError } = await supabase
      .from("estudiantes")
      .update({
        nombre,
        numero_control: numeroControl,
        programa_id: programaId,
      })
      .eq("id", selectedEstudiante.id)
      .select();

    if (estudianteError) {
      alert("Error updating student:", estudianteError.message);
    } else {
      const updatedData = {
        ...updatedEstudiante[0],
      };
      setEstudiantes(
        estudiantes.map((est) =>
          est.id === selectedEstudiante.id ? updatedData : est
        )
      );
      setFilteredEstudiantes(
        filteredEstudiantes.map((est) =>
          est.id === selectedEstudiante.id ? updatedData : est
        )
      );
      setSelectedEstudiante(null);
      setIsEditOpen(false);
    }
  };

  const openEditDialog = (estudiante) => {
    setSelectedEstudiante(estudiante);
    setNombre(estudiante.nombre);
    setNumeroControl(estudiante.numero_control);
    setProgramaId(estudiante.programa_id);
    setIsEditOpen(true);
  };

  const handleSearch = (term) => {
    const filtered = estudiantes.filter((estudiante) => {
      const programaNombre = getProgramaNombre(
        estudiante.programa_id
      ).toLowerCase();
      return (
        estudiante.nombre.toLowerCase().includes(term.toLowerCase()) ||
        estudiante.numero_control.includes(term) ||
        programaNombre.includes(term.toLowerCase())
      );
    });
    setFilteredEstudiantes(filtered);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Número', 'Número de Control', 'Nombre', 'Programa']],
      body: filteredEstudiantes.map(estudiante => [
        estudiante.id,
        estudiante.numero_control,
        estudiante.nombre,
        getProgramaNombre(estudiante.programa_id)
      ]),
    });
    doc.save('estudiantes.pdf');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <RiseLoader color="#508fb3" loading={loading} />
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <SiteLayout>
      <div>Estudiantes</div>
      <div className="mb-4">
        <Input
          placeholder="Buscar por Nombre, Número de Control, Programa, etc."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </div>
      <Button onClick={exportToPDF}>Exportar a PDF</Button>
      <Table>
        <TableCaption>Lista de Estudiantes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Número</TableHead>
            <TableHead>Número de Control</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Programa</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEstudiantes.map((estudiante) => (
            <TableRow key={estudiante.id}>
              <TableCell className="font-medium">{estudiante.id}</TableCell>
              <TableCell>{estudiante.numero_control}</TableCell>
              <TableCell>{estudiante.nombre}</TableCell>
              <TableCell>
                {getProgramaNombre(estudiante.programa_id)}
              </TableCell>
              <TableCell>
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => openEditDialog(estudiante)}
                    >
                      Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Editar Estudiante</DialogTitle>
                      <DialogDescription>
                        Realiza cambios en la información del estudiante. Haz
                        clic en guardar cuando termines.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditStudent}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right">
                            Nombre
                          </Label>
                          <Input
                            id="edit-name"
                            value={nombre}
                            className="col-span-3"
                            onChange={(e) => setNombre(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="edit-numeroControl"
                            className="text-right"
                          >
                            Número de Control
                          </Label>
                          <Input
                            id="edit-numeroControl"
                            value={numeroControl}
                            className="col-span-3"
                            onChange={(e) => setNumeroControl(e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="edit-programaId"
                            className="text-right"
                          >
                            Programa
                          </Label>
                          <Select
                            value={programaId.toString()}
                            onValueChange={(value) =>
                              setProgramaId(parseInt(value))
                            }
                          >
                            <SelectTrigger className="col-span-3">
                              <SelectValue>
                                {getProgramaNombre(programaId) ||
                                  "Selecciona un programa"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Programas</SelectLabel>
                                {programas.map((programa) => (
                                  <SelectItem
                                    key={programa.id}
                                    value={programa.id.toString()}
                                  >
                                    {programa.nombre}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Guardar cambios</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteOpen(true)}
                    >
                      Eliminar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Eliminar Estudiante</DialogTitle>
                      <DialogDescription>
                        Ingresa la contraseña para eliminar este estudiante.
                      </DialogDescription>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleDelete(estudiante.id);
                      }}
                    >
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="delete-password"
                            className="text-right"
                          >
                            Contraseña
                          </Label>
                          <Input
                            id="delete-password"
                            type="password"
                            value={password}
                            className="col-span-3"
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Eliminar</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>
              Total de Estudiantes: {estudiantes.length}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={() => setIsAddOpen(true)}>
            Agregar Estudiante
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Agregar nuevo estudiante</DialogTitle>
            <DialogDescription>
              Agrega un nuevo estudiante aquí. Haz clic en guardar cuando
              termines.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStudent}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="numeroControl"
                  className="text-right"
                >
                  Número de Control
                </Label>
                <Input
                  id="numeroControl"
                  value={numeroControl}
                  onChange={(e) => setNumeroControl(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="programaId" className="text-right">
                  Programa
                </Label>
                <Select
                  value={programaId.toString()}
                  onValueChange={(value) => setProgramaId(parseInt(value))}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue>
                      {getProgramaNombre(programaId) || "Selecciona un programa"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Programas</SelectLabel>
                      {programas.map((programa) => (
                        <SelectItem
                          key={programa.id}
                          value={programa.id.toString()}
                        >
                          {programa.nombre}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Guardar cambios</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
};

export default Page;
