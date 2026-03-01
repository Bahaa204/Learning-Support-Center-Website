import "../assets/CSS/table.css";
import { useDataContext } from "../context/context";
import { CSVLink } from "react-csv";
import type { Data } from "../types/types";
import exportImage from "../assets/Images/file-export_24.png";
import {useState } from "react";
import { supabaseClient } from "../supabase-client";

export default function Table() {
  const { Data, setData, error, setError, Loading, name } =
    useDataContext();
  const [AddingVisits, setAddingVisits] = useState<number>(0);

  console.log(Data);

  async function handleClick(student: Data) {
    if (AddingVisits === student.studentId) return;
    setAddingVisits(student.studentId);
    const { error: IncrementingError } = await supabaseClient
      .from("Students")
      .update({ nb_visits: student.nb_visits + 1 })
      .eq("studentId", student.studentId);

    if (IncrementingError) {
      console.error("An Error has occurred: ", IncrementingError.message);
      setError(
        `Failed to increment visits. Error message: ${IncrementingError.message}`,
      );
      return;
    }

    setData((prev) =>
      prev.map((data) =>
        data.studentId === student.studentId
          ? { ...data, nb_visits: data.nb_visits + 1 }
          : data,
      ),
    );
    setAddingVisits(0);
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
      {Loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "50vh" }}
        >
          Loading Data Please Wait...
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-end mb-3">
            {name === "Lara" && (
              <CSVLink
                data={Data}
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
                {Data.map((student) => (
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
                          disabled={AddingVisits === student.studentId}
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
      )}
    </>
  );
}
