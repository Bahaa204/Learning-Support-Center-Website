import { Navigate, useNavigate } from "react-router-dom";
import InputForm from "../components/InputForm";
import Table from "../components/Table";
import { useDataContext } from "../context/context";

export default function Main() {
  const { Session, Loading, name } = useDataContext();
  const navigate = useNavigate();

  if (Loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        Checking Authentication Please Wait...
      </div>
    );
  }

  if (!Session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <InputForm />
      {name === "Lara" && (
        <div className="d-flex justify-content-center ">
          <button
            className="btn btn-success"
            onClick={() => {
              navigate("/workstudy");
            }}
          >
            Edit WorkStudy
          </button>
        </div>
      )}
      <Table />
    </>
  );
}
