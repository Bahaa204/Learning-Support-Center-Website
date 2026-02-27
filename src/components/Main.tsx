import { useState } from "react";
import InputForm from "./InputForm";
import type { Data } from "../types/types";
export default function Main() {
  const [Data, setData] = useState<Data[]>([]);

  return (
    <>
      <InputForm setData={setData} />
      {Data.map((data) => (
        <div key={data.id}>
          <p>Student Name: {data.studentName}</p>
          <p>Student ID: {data.studentId}</p>
          <p>Created at: {data.created_at}</p>
          <p>Added by: {data.added_by}</p>
          <p></p>
        </div>
      ))}
    </>
  );
}
