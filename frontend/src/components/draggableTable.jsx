"use client";

import { columns } from "@/components/columns";
import { useState } from "react";
import { DataTable } from "./data-table";

const DraggableTable = (tableData) => {
  const [data, setData] = useState(tableData);

  return (
    <DataTable data={data} columns={columns} setData={setData}></DataTable>
  );
};

export default DraggableTable;
