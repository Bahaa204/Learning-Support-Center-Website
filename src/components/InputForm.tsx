import { useState, type SubmitEvent } from "react";
import type { Data, Input, InputFormProps } from "../types/types";
import { titleCase } from "title-case";

export default function InputForm({ setData }: InputFormProps) {
  function formatDate(): string {
    return new Date().toLocaleString("en-LB", {
      timeZone: "Asia/Beirut",
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  const [Input, setInput] = useState<Input>({
    studentName: "",
    studentId: NaN,
  });

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const person = "bahaa";

    const newData: Data = {
      ...Input,
      studentName: titleCase(Input.studentName),
      id: crypto.randomUUID(),
      added_at: formatDate(),
      added_by: titleCase(person),
      nb_visits: 1,
    };

    setData((prev) => [...prev, newData]);

    setInput({ studentName: "", studentId: NaN });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex flex-wrap gap-5 justify-content-center align-items-center"
      style={{ height: "50vh" }}
    >
      <div className="form-group">
        <label htmlFor="name">Student Name:</label>
        <input
          required
          type="text"
          className="form-control"
          id="name"
          value={Input.studentName}
          onChange={(event) => {
            setInput((prev: Input) => ({
              ...prev,
              studentName: event.target.value,
            }));
          }}
        />
      </div>
      <div className="form-group">
        <label htmlFor="id">Student ID:</label>
        <input
          required
          type="number"
          id="id"
          className="form-control"
          value={isNaN(Input.studentId) ? "" : Input.studentId}
          onChange={(event) => {
            setInput((prev: Input) => ({
              ...prev,
              studentId: parseInt(event.target.value.trim()) || NaN,
            }));
          }}
        />
      </div>
      <button type="submit" className="btn btn-dark">
        Submit
      </button>
    </form>
  );
}
