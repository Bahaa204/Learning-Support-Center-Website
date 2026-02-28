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

  const { Data, setData, setError, Session } = useDataContext();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

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

    const { error } = await supabaseClient
      .from("Students")
      .insert(newStudent)
      .single();

    if (error) {
      console.error("An Error has occurred: ", error.message);
      setError(`Failed to add student. Error message: ${error.message}`);
      return;
    }

    setData((prev) => [...prev, newStudent]);

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
