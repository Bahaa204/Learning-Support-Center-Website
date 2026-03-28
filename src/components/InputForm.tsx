import { useState, type SubmitEvent } from "react";
import type { Input, Props, Student } from "../types/types";
import { titleCase } from "title-case";
import { checkDupes, formatDate, getName } from "../helper/functions";
import { supabaseClient } from "../supabase-client";
import SpinnerButton from "./SpinnerButton";
import { useAuth } from "../hooks/useAuth";

export default function InputForm({ Students }: Props) {
  const [Input, setInput] = useState<Input>({
    studentName: "",
    studentId: NaN,
  });
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Getting the name from the current Session
  const { Session } = useAuth();
  const name = getName(Session);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isAdding) return;

    setIsAdding(true);

    if (checkDupes(Students, Input.studentId)) {
      alert("the ID already exists!!");
      setIsAdding(false);
      return;
    }

    const newStudent: Student = {
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
      alert(`An Error has occurred: ${InsertError.message}`);
      return;
    }

    setInput({ studentName: "", studentId: NaN });
    setIsAdding(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex flex-column flex-wrap gap-3 justify-content-evenly align-items-center"
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
      {isAdding ? (
        <SpinnerButton />
      ) : (
        <button type="submit" className="btn btn-dark" disabled={isAdding}>
          Submit
        </button>
      )}
    </form>
  );
}
