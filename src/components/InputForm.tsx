import { useState, type SubmitEvent } from "react";
import type { Data, Input } from "../types/types";
import { titleCase } from "title-case";
import { checkDupes, formatDate, getName } from "../helper/functions";
import { useDataContext } from "../context/context";
import { supabaseClient } from "../supabase-client";

export default function InputForm() {
  const [Input, setInput] = useState<Input>({
    studentName: "",
    studentId: NaN,
  });
  const [isAdding, setIsAdding] = useState(false);

  const { Data, setData, setError, Session } = useDataContext();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isAdding) return;

    setIsAdding(true);
    let name = "";
    if (Session) {
      name = getName(Session.user.email);
    }

    if (checkDupes(Data, Input.studentId)) {
      alert("the ID already exists!!");
      return;
    }

    const newStudent: Data = {
      ...Input,
      studentName: titleCase(Input.studentName),
      id: crypto.randomUUID(),
      added_at: formatDate(),
      added_by: name,
      nb_visits: 1,
    };

    const { error: InsertError } = await supabaseClient
      .from("Students")
      .insert(newStudent)
      .single();

    if (InsertError) {
      console.error("An Error has occurred: ", InsertError.message);
      setError(`Failed to add student. Error message: ${InsertError.message}`);
      return;
    }

    setData((prev) => [...prev, newStudent]);

    setInput({ studentName: "", studentId: NaN });
    setIsAdding(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex flex-column flex-wrap gap-3 justify-content-center align-items-center"
      style={{ height: "50vh" }}
    >
      <div className="form-group">
        <label htmlFor="name">Student Name:</label>
        <input
          required
          type="text"
          className="form-control border-2 border-secondary"
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
          className="form-control border-2 border-secondary"
          value={isNaN(Input.studentId) ? "" : Input.studentId}
          onChange={(event) => {
            setInput((prev: Input) => ({
              ...prev,
              studentId: parseInt(event.target.value.trim()) || NaN,
            }));
          }}
        />
      </div>
      <button type="submit" className="btn btn-dark" disabled={isAdding}>
        Submit
      </button>
    </form>
  );
}
