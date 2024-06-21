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

const Page = () => {
  const [estudiantes, setEstudiantes] = useState([]);
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
        alert("Error deleting student:", error.message);
      } else {
        setEstudiantes(
          estudiantes.filter((estudiante) => estudiante.id !== id)
        );
        setPassword("");
        setIsDeleteOpen(false); // Close the delete dialog
      }
    } else {
      alert("Incorrect password!");
    }
  };

  const handleAddStudent = async (event) => {
    event.preventDefault();
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
      setEstudiantes([...estudiantes, ...data]);
      setNombre("");
      setNumeroControl("");
      setProgramaId("");
      setIsAddOpen(false); // Close the add dialog
    }
  };

  const handleEditStudent = async (event) => {
    event.preventDefault();
    const { data, error } = await supabase
      .from("estudiantes")
      .update({
        nombre,
        numero_control: numeroControl,
        programa_id: programaId,
      })
      .eq("id", selectedEstudiante.id)
      .select();

    if (error) {
      alert("Error updating student:", error.message);
    } else {
      setEstudiantes(
        estudiantes.map((est) =>
          est.id === selectedEstudiante.id ? data[0] : est
        )
      );
      setSelectedEstudiante(null);
      setIsEditOpen(false); // Close the edit dialog
    }
  };

  const openEditDialog = (estudiante) => {
    setSelectedEstudiante(estudiante);
    setNombre(estudiante.nombre);
    setNumeroControl(estudiante.numero_control);
    setProgramaId(estudiante.programa_id);
    setIsEditOpen(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {estudiantes.map((estudiante) => (
            <TableRow key={estudiante.id}>
              <TableCell className="font-medium">{estudiante.id}</TableCell>
              <TableCell>{estudiante.numero_control}</TableCell>
              <TableCell>{estudiante.nombre}</TableCell>
              <TableCell>{getProgramaNombre(estudiante.programa_id)}</TableCell>
              <TableCell>
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => openEditDialog(estudiante)}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit student</DialogTitle>
                      <DialogDescription>
                        Make changes to the student here. Click save when you
                        are done.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditStudent}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right">
                            Name
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
                                  "Select a program"}
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
                        <Button type="submit">Save changes</Button>
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
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delete student</DialogTitle>
                      <DialogDescription>
                        Enter the password to delete this student.
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
                            Password
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
                        <Button type="submit">Delete</Button>
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
            Add Student
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new student</DialogTitle>
            <DialogDescription>
              Add a new student here. Click save when you are done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStudent}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="numeroControl" className="text-right">
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
                      {getProgramaNombre(programaId) || "Select a program"}
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
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
};

export default Page;
