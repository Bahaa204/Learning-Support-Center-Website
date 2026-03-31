import { Navigate } from "react-router-dom";
import InputForm from "../components/InputForm";
import Table from "../components/Table";
import { checkDupes, formatDate, getName } from "../helper/functions";
import Spinner from "../components/Spinner";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useAuth } from "../hooks/useAuth";
import { useStudents } from "../hooks/useStudents";
import { useState, type SubmitEvent } from "react";
import type { Input, Student } from "../types/types";
import { titleCase } from "title-case";
import { CSVLink } from "react-csv";
import exportImage from "../assets/Images/file-export_24.png";

export default function Main() {
  useDocumentTitle("Home");

  const { Session, Loading: AuthLoading, Error: AuthError } = useAuth();

  const name = getName(Session);

  const {
    Students,
    Loading: DataLoading,
    Error: DataError,
    addStudent,
    incrementStudentVisits,
    isAdding,
    isUpdating,
  } = useStudents(name);

  const InitialValue: Input = { name: "", id: NaN };

  const [Input, setInput] = useState<Input>(InitialValue);

  const loading = AuthLoading || DataLoading;
  const error = AuthError || DataError;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isAdding) return;

    if (checkDupes(Students, Input.id)) {
      alert("the ID already exists!!");
      return;
    }

    const newStudent: Student = {
      id: crypto.randomUUID(),
      studentName: titleCase(Input.name),
      studentId: Input.id,
      added_at: formatDate(),
      added_by: name,
      nb_visits: 1,
    };

    const ok = await addStudent(newStudent);

    if (ok) setInput(InitialValue);
  }

  async function handleUpdate(studentId: number) {
    if (isUpdating) return;

    await incrementStudentVisits(studentId);
  }

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <Spinner
          text={AuthLoading ? "Checking Authentication" : "Loading Data"}
        />
      </div>
    );
  }

  if (!Session) {
    return <Navigate to="/login" replace />;
  }

  if (error) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        {error}
      </div>
    );
  }

  const headers = [
    { label: "Student ID", key: "studentId" },
    { label: "Student Name", key: "studentName" },
    { label: "Added AT", key: "added_at" },
    { label: "Added By", key: "added_by" },
    { label: "Visits", key: "nb_visits" },
  ];

  return (
    <>
      <InputForm
        Input={Input}
        setInput={setInput}
        loading={loading}
        handleSubmit={handleSubmit}
      />
      <div className="d-flex justify-content-end mb-3">
        {/* Button to extract the table to a csv file */}
        {name === "Laraabouorm" && (
          <CSVLink
            data={Students}
            headers={headers}
            filename="Learning Support Center Student Visits.csv"
            className="btn btn-success"
          >
            <img src={exportImage} alt="" />
            Export CSV
          </CSVLink>
        )}
      </div>
      <Table
        Students={Students}
        handleUpdate={handleUpdate}
        isUpdating={isUpdating}
      />
    </>
  );
}
