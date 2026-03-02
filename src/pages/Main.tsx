import { Navigate, useNavigate } from "react-router-dom";
import InputForm from "../components/InputForm";
import Table from "../components/Table";
import { useFetchFromTable, useGetSession } from "../hooks/CustomHooks";
import { getName } from "../helper/functions";

export default function Main() {
  const navigate = useNavigate();

  const {
    Session,
    Loading: SessionLoading,
    Error: SessionError,
  } = useGetSession();

  const name = getName(Session);

  const {
    Data: Students,
    Loading: LoadingData,
    Error: FetchError,
  } = useFetchFromTable<"Students">("Students", name);

  if (SessionLoading || LoadingData) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        {SessionLoading ? "Checking Authentication" : "Loading Data"} Please
        Wait...
      </div>
    );
  }

  const error = FetchError || SessionError;
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

  if (!Session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <InputForm Students={Students} />
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
      <Table Students={Students} />
    </>
  );
}
