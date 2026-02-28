import "../assets/CSS/table.css";
import { useDataContext } from "../context/context";
import { incrementVisits } from "../helper/backend";
import { CSVLink } from "react-csv";
import type { Data } from "../types/types";
import exportImage from "../assets/Images/file-export_24.png";

export default function Table() {
  const { Data, setData, error, setError, Loading } = useDataContext();

  async function handleClick(student: Data) {
    const error = await incrementVisits(student);

    if (error) {
      console.error("An Error has occurred: ", error.message);
      console.error("Error Details: ", error.details);
      setError("Failed to increment the number of visits");
      return;
    }

    setData((prev) =>
      prev.map((data) =>
        data.studentId === student.studentId
          ? { ...data, nb_visits: data.nb_visits + 1 }
          : data,
      ),
    );
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
            <CSVLink
              data={Data}
              headers={headers}
              filename="students.csv"
              className="btn btn-success"
            >
              <img src={exportImage} alt="" />
              Export CSV
            </CSVLink>
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
                    <td className="hover-cell">{student.studentName}</td>
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
