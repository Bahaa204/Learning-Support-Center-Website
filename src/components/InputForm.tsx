import {
  useState,
  type Dispatch,
  type SetStateAction,
  type SubmitEvent,
} from "react";
import type { Data, Input } from "../types/types";
import { titleCase } from "title-case";

export default function InputForm({
  setData,
}: {
  setData: Dispatch<SetStateAction<Data[]>>;
}) {
  function formatDate(): string {
    const formatted_date = new Date().toLocaleString("en-LB", {
      timeZone: "Asia/Beirut",
      dateStyle: "short",
      timeStyle: "medium",
    });
    return formatted_date;
  }

  const [Input, setInput] = useState<Input>({
    studentName: "",
    studentId: NaN,
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!Input.studentName || !Input.studentId) {
      alert("Please Fill Both Fields");
      return;
    }

    const person = "bahaa";

    const newData: Data = {
      ...Input,
      id: crypto.randomUUID(),
      created_at: formatDate(),
      added_by: titleCase(person),
    };

    setData((prev) => [...prev, newData]);

    setInput({ studentName: "", studentId: NaN });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Student Name:</label>
      <input
        type="text"
        id="name"
        value={Input.studentName}
        onChange={(event) => {
          setInput((prev: Input) => ({
            ...prev,
            studentName: titleCase(event.target.value),
          }));
        }}
      />
      <label htmlFor="id">Student ID:</label>
      <input
        type="number"
        id="id"
        value={isNaN(Input.studentId) ? "" : Input.studentId}
        onChange={(event) => {
          setInput((prev: Input) => ({
            ...prev,
            studentId: parseInt(event.target.value.trim()) || NaN,
          }));
        }}
      />
      <button type="submit">Add Student</button>
    </form>
  );
}
