"use client";

import React, { useState, useEffect } from "react";
import SiteLayout from "../layout/SiteLayout";
import { supabase } from "@/database/supabaseClient";

const Page = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstudiantes = async () => {
      const { data, error } = await supabase.from("estudiantes").select("*");
      if (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } else {
        setEstudiantes(data);
      }
      setLoading(false);
    };

    fetchEstudiantes();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <SiteLayout>
      <div>Estudiantes</div>
      <ul>
        {estudiantes.map((estudiante) => (
          <li key={estudiante.id}>
            {estudiante.nombre} - {estudiante.carrera}
          </li>
        ))}
      </ul>
    </SiteLayout>
  );
};

export default Page;
