import type { TableProps } from "../types/types";
import "../assets/CSS/table.css";

export default function Table({ Data, setData }: TableProps) {
  function handleClick(studentID: number): void {
    setData((prev) =>
      prev.map((data) =>
        data.studentId === studentID
          ? { ...data, nb_visits: data.nb_visits + 1 }
          : data,
      ),
    );
  }

  return (
    <div className="table-responsive">
      <table
        className="table table-secondary table-striped table-hover table-bordered text-center align-middle"
        style={{ height: "50vh" }}
      >
        <thead className="table-light">
          <tr>
            <th scope="col">Student ID</th>
            <th scope="col">Student Name</th>
            <th scope="col">Added At</th>
            <th scope="col">Added By</th>
            <th scope="col">Nb of Visits</th>
          </tr>
        </thead>
        <tbody>
          {Data.map((data) => (
            <tr key={data.id} className="text-center">
              <th scope="row">{data.studentId}</th>
              <td className="hover-cell">{data.studentName}</td>
              <td>{data.added_at}</td>
              <td>{data.added_by}</td>
              <td className="hover-cell">
                <div className="d-flex flex-wrap align-items-center">
                  <span className="flex-grow-1 text-center">
                    {data.nb_visits}
                  </span>
                  <button
                    className="btn btn-sm btn-secondary hover-btn"
                    onClick={() => handleClick(data.studentId)}
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
  );
}
