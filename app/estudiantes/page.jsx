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

const Page = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [nombre, setNombre] = useState("");
  const [numeroControl, setNumeroControl] = useState("");
  const [programaId, setProgramaId] = useState("");
  const [empresaId, setEmpresaId] = useState("");
  const [nuevaEmpresa, setNuevaEmpresa] = useState("");
  const [actividadId, setActividadId] = useState("");
  const [nuevaActividad, setNuevaActividad] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [fechaConstancia, setFechaConstancia] = useState("");
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
      } = await supabase.from("estudiantes").select(`
          *,
          servicio_social (
            empresa_id,
            actividad_id,
            fecha_inicio,
            fecha_fin,
            fecha_constancia,
            empresas ( nombre ),
            actividades ( descripcion )
          )
        `);

      const {
        data: programasData,
        error: programasError,
      } = await supabase.from("programas_estudio").select("*");

      const { data: empresasData, error: empresasError } = await supabase
        .from("empresas")
        .select("*");

      const {
        data: actividadesData,
        error: actividadesError,
      } = await supabase.from("actividades").select("*");

      if (
        estudiantesError ||
        programasError ||
        empresasError ||
        actividadesError
      ) {
        console.error(
          "Error fetching data:",
          estudiantesError ||
            programasError ||
            empresasError ||
            actividadesError
        );
        setError(
          estudiantesError?.message ||
            programasError?.message ||
            empresasError?.message ||
            actividadesError?.message
        );
      } else {
        console.log("Estudiantes:", estudiantesData);
        console.log("Programas:", programasData);
        console.log("Empresas:", empresasData);
        console.log("Actividades:", actividadesData);
        setEstudiantes(estudiantesData);
        setFilteredEstudiantes(estudiantesData);
        setProgramas(programasData);
        setEmpresas(empresasData);
        setActividades(actividadesData);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const getProgramaNombre = (programaId) => {
    const programa = programas.find((p) => p.id === programaId);
    return programa ? programa.nombre : "";
  };

  const getEmpresaNombre = (empresaId) => {
    const empresa = empresas.find((e) => e.id === empresaId);
    return empresa ? empresa.nombre : "";
  };

  const getActividadDescripcion = (actividadId) => {
    const actividad = actividades.find((a) => a.id === actividadId);
    return actividad ? actividad.descripcion : "";
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
        setFilteredEstudiantes(
          filteredEstudiantes.filter((estudiante) => estudiante.id !== id)
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

    // Verificar si el número de control ya existe
    const { data: existingStudent, error: existingError } = await supabase
      .from("estudiantes")
      .select("*")
      .eq("numero_control", numeroControl);

    if (existingStudent && existingStudent.length > 0) {
      alert("El número de control ya existe. No se puede duplicar.");
      return;
    }

    let empresaIdFinal = empresaId;
    if (empresaId === "otro" && nuevaEmpresa) {
      const { data, error } = await supabase
        .from("empresas")
        .insert([{ nombre: nuevaEmpresa }])
        .select();
      if (error) {
        alert("Error adding new empresa:", error.message);
        return;
      }
      empresaIdFinal = data[0].id;
      setEmpresas([...empresas, data[0]]);
      setNuevaEmpresa("");
    }

    let actividadIdFinal = actividadId;
    if (actividadId === "otro" && nuevaActividad) {
      const { data, error } = await supabase
        .from("actividades")
        .insert([{ descripcion: nuevaActividad }])
        .select();
      if (error) {
        alert("Error adding new actividad:", error.message);
        return;
      }
      actividadIdFinal = data[0].id;
      setActividades([...actividades, data[0]]);
      setNuevaActividad("");
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
        servicio_social: [
          {
            empresa_id: empresaIdFinal,
            actividad_id: actividadIdFinal,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            fecha_constancia: fechaConstancia,
          },
        ],
      };

      await supabase.from("servicio_social").insert([
        {
          estudiante_id: data[0].id,
          empresa_id: empresaIdFinal,
          actividad_id: actividadIdFinal,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
          fecha_constancia: fechaConstancia,
        },
      ]);

      setEstudiantes([...estudiantes, newStudent]);
      setFilteredEstudiantes([...filteredEstudiantes, newStudent]);
      setNombre("");
      setNumeroControl("");
      setProgramaId("");
      setEmpresaId("");
      setActividadId("");
      setFechaInicio("");
      setFechaFin("");
      setFechaConstancia("");
      setIsAddOpen(false); // Close the add dialog
    }
  };

  const handleEditStudent = async (event) => {
    event.preventDefault();

    let empresaIdFinal = empresaId;
    if (empresaId === "otro" && nuevaEmpresa) {
      const { data, error } = await supabase
        .from("empresas")
        .insert([{ nombre: nuevaEmpresa }])
        .select();
      if (error) {
        alert("Error adding new empresa:", error.message);
        return;
      }
      empresaIdFinal = data[0].id;
      setEmpresas([...empresas, data[0]]);
      setNuevaEmpresa("");
    }

    let actividadIdFinal = actividadId;
    if (actividadId === "otro" && nuevaActividad) {
      const { data, error } = await supabase
        .from("actividades")
        .insert([{ descripcion: nuevaActividad }])
        .select();
      if (error) {
        alert("Error adding new actividad:", error.message);
        return;
      }
      actividadIdFinal = data[0].id;
      setActividades([...actividades, data[0]]);
      setNuevaActividad("");
    }

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
      const {
        data: updatedServicioSocial,
        error: servicioSocialError,
      } = await supabase
        .from("servicio_social")
        .update({
          empresa_id: empresaIdFinal || null,
          actividad_id: actividadIdFinal || null,
          fecha_inicio: fechaInicio || null,
          fecha_fin: fechaFin || null,
          fecha_constancia: fechaConstancia || null,
        })
        .eq("estudiante_id", selectedEstudiante.id)
        .select();

      if (servicioSocialError) {
        alert("Error updating service social:", servicioSocialError.message);
      } else {
        const updatedData = {
          ...updatedEstudiante[0],
          servicio_social: [updatedServicioSocial[0]],
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
        setIsEditOpen(false); // Close the edit dialog
      }
    }
  };

  const openEditDialog = (estudiante) => {
    const servicioSocial = estudiante.servicio_social?.[0] || {};
    setSelectedEstudiante(estudiante);
    setNombre(estudiante.nombre);
    setNumeroControl(estudiante.numero_control);
    setProgramaId(estudiante.programa_id);
    setEmpresaId(servicioSocial.empresa_id || "");
    setActividadId(servicioSocial.actividad_id || "");
    setFechaInicio(servicioSocial.fecha_inicio || "");
    setFechaFin(servicioSocial.fecha_fin || "");
    setFechaConstancia(servicioSocial.fecha_constancia || "");
    setIsEditOpen(true);
  };

  const handleSearch = (term) => {
    const filtered = estudiantes.filter((estudiante) => {
      const programaNombre = getProgramaNombre(
        estudiante.programa_id
      ).toLowerCase();
      const empresaNombre =
        estudiante.servicio_social?.[0]?.empresas?.nombre?.toLowerCase() || "";
      const actividadDescripcion =
        estudiante.servicio_social?.[0]?.actividades?.descripcion?.toLowerCase() ||
        "";
      return (
        estudiante.nombre.toLowerCase().includes(term.toLowerCase()) ||
        estudiante.numero_control.includes(term) ||
        programaNombre.includes(term.toLowerCase()) ||
        empresaNombre.includes(term.toLowerCase()) ||
        actividadDescripcion.includes(term.toLowerCase())
      );
    });
    setFilteredEstudiantes(filtered);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
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
          placeholder="Buscar por Nombre, Número de Control, Programa, Empresa, Actividad, etc."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
        />
      </div>
      <Table>
        <TableCaption>Lista de Estudiantes</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Número</TableHead>
            <TableHead>Número de Control</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Programa</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Actividad</TableHead>
            <TableHead>Fecha de Inicio</TableHead>
            <TableHead>Fecha de Fin</TableHead>
            <TableHead>Fecha de Constancia</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEstudiantes.map((estudiante) => {
            const servicioSocial = estudiante.servicio_social?.[0] || {};
            return (
              <TableRow key={estudiante.id}>
                <TableCell className="font-medium">{estudiante.id}</TableCell>
                <TableCell>{estudiante.numero_control}</TableCell>
                <TableCell>{estudiante.nombre}</TableCell>
                <TableCell>
                  {getProgramaNombre(estudiante.programa_id)}
                </TableCell>
                <TableCell>
                  {getEmpresaNombre(servicioSocial.empresa_id)}
                </TableCell>
                <TableCell>
                  {getActividadDescripcion(servicioSocial.actividad_id)}
                </TableCell>
                <TableCell>{servicioSocial.fecha_inicio}</TableCell>
                <TableCell>{servicioSocial.fecha_fin}</TableCell>
                <TableCell>{servicioSocial.fecha_constancia}</TableCell>
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
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-empresaId"
                              className="text-right"
                            >
                              Empresa
                            </Label>
                            <Select
                              value={empresaId.toString()}
                              onValueChange={(value) => setEmpresaId(value)}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue>
                                  {getEmpresaNombre(empresaId) ||
                                    "Selecciona una empresa"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Empresas</SelectLabel>
                                  {empresas.map((empresa) => (
                                    <SelectItem
                                      key={empresa.id}
                                      value={empresa.id.toString()}
                                    >
                                      {empresa.nombre}
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="otro">Otro</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          {empresaId === "otro" && (
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="nueva-empresa"
                                className="text-right"
                              >
                                Nueva Empresa
                              </Label>
                              <Input
                                id="nueva-empresa"
                                value={nuevaEmpresa}
                                className="col-span-3"
                                onChange={(e) => setNuevaEmpresa(e.target.value)}
                              />
                            </div>
                          )}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-actividadId"
                              className="text-right"
                            >
                              Actividad
                            </Label>
                            <Select
                              value={actividadId.toString()}
                              onValueChange={(value) => setActividadId(value)}
                            >
                              <SelectTrigger className="col-span-3">
                                <SelectValue>
                                  {getActividadDescripcion(actividadId) ||
                                    "Selecciona una actividad"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Actividades</SelectLabel>
                                  {actividades.map((actividad) => (
                                    <SelectItem
                                      key={actividad.id}
                                      value={actividad.id.toString()}
                                    >
                                      {actividad.descripcion}
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="otro">Otro</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          {actividadId === "otro" && (
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label
                                htmlFor="nueva-actividad"
                                className="text-right"
                              >
                                Nueva Actividad
                              </Label>
                              <Input
                                id="nueva-actividad"
                                value={nuevaActividad}
                                className="col-span-3"
                                onChange={(e) =>
                                  setNuevaActividad(e.target.value)
                                }
                              />
                            </div>
                          )}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-fechaInicio"
                              className="text-right"
                            >
                              Fecha de Inicio
                            </Label>
                            <Input
                              id="edit-fechaInicio"
                              type="date"
                              value={fechaInicio}
                              className="col-span-3"
                              onChange={(e) => setFechaInicio(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-fechaFin"
                              className="text-right"
                            >
                              Fecha de Fin
                            </Label>
                            <Input
                              id="edit-fechaFin"
                              type="date"
                              value={fechaFin}
                              className="col-span-3"
                              onChange={(e) => setFechaFin(e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="edit-fechaConstancia"
                              className="text-right"
                            >
                              Fecha de Constancia
                            </Label>
                            <Input
                              id="edit-fechaConstancia"
                              type="date"
                              value={fechaConstancia}
                              className="col-span-3"
                              onChange={(e) =>
                                setFechaConstancia(e.target.value)
                              }
                            />
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
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={10}>
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="empresaId" className="text-right">
                  Empresa
                </Label>
                <Select
                  value={empresaId.toString()}
                  onValueChange={(value) => setEmpresaId(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue>
                      {getEmpresaNombre(empresaId) ||
                        "Selecciona una empresa"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Empresas</SelectLabel>
                      {empresas.map((empresa) => (
                        <SelectItem
                          key={empresa.id}
                          value={empresa.id.toString()}
                        >
                          {empresa.nombre}
                        </SelectItem>
                      ))}
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {empresaId === "otro" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="nueva-empresa"
                    className="text-right"
                  >
                    Nueva Empresa
                  </Label>
                  <Input
                    id="nueva-empresa"
                    value={nuevaEmpresa}
                    className="col-span-3"
                    onChange={(e) => setNuevaEmpresa(e.target.value)}
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="actividadId"
                  className="text-right"
                >
                  Actividad
                </Label>
                <Select
                  value={actividadId.toString()}
                  onValueChange={(value) => setActividadId(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue>
                      {getActividadDescripcion(actividadId) ||
                        "Selecciona una actividad"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Actividades</SelectLabel>
                      {actividades.map((actividad) => (
                        <SelectItem
                          key={actividad.id}
                          value={actividad.id.toString()}
                        >
                          {actividad.descripcion}
                        </SelectItem>
                      ))}
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {actividadId === "otro" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="nueva-actividad"
                    className="text-right"
                  >
                    Nueva Actividad
                  </Label>
                  <Input
                    id="nueva-actividad"
                    value={nuevaActividad}
                    className="col-span-3"
                    onChange={(e) => setNuevaActividad(e.target.value)}
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="fechaInicio"
                  className="text-right"
                >
                  Fecha de Inicio
                </Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={fechaInicio}
                  className="col-span-3"
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="fechaFin"
                  className="text-right"
                >
                  Fecha de Fin
                </Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={fechaFin}
                  className="col-span-3"
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label
                  htmlFor="fechaConstancia"
                  className="text-right"
                >
                  Fecha de Constancia
                </Label>
                <Input
                  id="fechaConstancia"
                  type="date"
                  value={fechaConstancia}
                  className="col-span-3"
                  onChange={(e) =>
                    setFechaConstancia(e.target.value)
                  }
                />
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
