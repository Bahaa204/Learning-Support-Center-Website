import { Navigate, useNavigate } from "react-router-dom";
import InputForm from "../components/InputForm";
import Table from "../components/Table";
import { getName } from "../helper/functions";
import Spinner from "../components/Spinner";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { useAuth } from "../hooks/useAuth";
import { useStudents } from "../hooks/useStudents";

export default function Main() {
  useDocumentTitle("Home");

  const { Session, Loading: AuthLoading, Error: AuthError } = useAuth();

  const name = getName(Session);

  const {
    Students,
    Loading: DataLoading,
    Error: DataError,
  } = useStudents(name);

  const navigate = useNavigate();

  if (AuthLoading || DataLoading) {
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

  const error = AuthError || DataError;
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

  return (
    <>
      <InputForm Students={Students} />
      {name === "Laraabouorm" && (
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
      <Table Students={Students} />
    </>
  );
}
