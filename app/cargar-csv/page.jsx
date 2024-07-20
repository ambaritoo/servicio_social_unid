import React from "react";
import SiteLayout from "../layout/SiteLayout";
import CargarCSV from "@/components/CargarCSV";

const CargarCsvPage = () => {
  return (
    <SiteLayout>
      <h1>Cargar CSV</h1>
      <CargarCSV />
    </SiteLayout>
  );
};

export default CargarCsvPage;
