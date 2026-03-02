import "../assets/CSS/table.css";
import { CSVLink } from "react-csv";
import type { Props, Student } from "../types/types";
import exportImage from "../assets/Images/file-export_24.png";
import { supabaseClient } from "../supabase-client";
import { useState } from "react";
import { getName } from "../helper/functions";
import { useGetSession } from "../hooks/CustomHooks";

export default function Table({ Students }: Props) {
  // Getting the name from the current Session
  const { Session } = useGetSession();
  const name = getName(Session);

  const [isAdding, setIsAdding] = useState<number | null>(null);

  async function handleClick(student: Student) {
    if (isAdding === student.studentId) return;

    setIsAdding(student.studentId);

    const { error } = await supabaseClient
      .from("Students")
      .update({ nb_visits: student.nb_visits + 1 })
      .eq("studentId", student.studentId);

    if (error) {
      const msg = `Failed to increment visits. Error message: ${error.message}`;
      console.error(msg);
      setIsAdding(null);
      return;
    }

    setIsAdding(null);
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
      <div className="d-flex justify-content-end mb-3">
        {/* Button to extract the table to a csv file */}
        {name === "Lara" && (
          <CSVLink
            data={Students}
            headers={headers}
            filename="students.csv"
            className="btn btn-success"
          >
            <img src={exportImage} alt="" />
            Export CSV
          </CSVLink>
        )}
      </div>
      <div
        className="table-responsive"
        style={{ maxHeight: "50vh", overflowY: "auto" }}
      >
        <table className="table table-secondary table-striped table-hover table-bordered text-center align-middle">
          <thead className="table-light">
            <tr className="sticky-top">
              <th scope="col">Student ID</th>
              <th scope="col">Student Name</th>
              <th scope="col">Added At</th>
              <th scope="col">Added By</th>
              <th scope="col">Visits</th>
            </tr>
          </thead>
          <tbody>
            {Students.map((student) => (
              <tr key={student.id} className="text-center">
                <th scope="row">{student.studentId}</th>
                <td>{student.studentName}</td>
                <td>{student.added_at}</td>
                <td>{student.added_by}</td>
                <td className="hover-cell">
                  <div className="d-flex flex-wrap align-items-center">
                    <span className="flex-grow-1 text-center">
                      {student.nb_visits}
                    </span>
                    <button
                      className="btn btn-sm btn-secondary hover-btn"
                      onClick={() => handleClick(student)}
                      disabled={isAdding === student.studentId}
                    >
                      +
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
