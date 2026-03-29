import SmallSpinnerButton from "./SmallSpinnerButton";
import type { TableProps } from "../types/types";
import "../assets/CSS/table.css";

export default function Table({
  Students,
  handleUpdate,
  isUpdating,
}: TableProps) {
  return (
    <>
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
                    {isUpdating === student.studentId ? (
                      <SmallSpinnerButton />
                    ) : (
                      <button
                        className="btn btn-sm btn-secondary hover-btn"
                        onClick={() => handleUpdate(student.studentId)}
                        disabled={isUpdating === student.studentId}
                      >
                        +
                      </button>
                    )}
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
