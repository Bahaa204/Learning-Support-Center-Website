import { useState } from "react";
import InputForm from "./InputForm";
import type { Data } from "../types/types";
import Table from "./Table";
export default function Main() {
  const [Data, setData] = useState<Data[]>([]);

  return (
    <>
      <InputForm Data={Data} setData={setData} />
      <Table Data={Data} setData={setData} />
    </>
  );
}
