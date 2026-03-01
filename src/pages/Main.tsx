import { useNavigate } from "react-router-dom";
import InputForm from "../components/InputForm";
import Table from "../components/Table";
import { useDataContext } from "../context/context";

export default function Main() {
  const { Session } = useDataContext();
  const navigate = useNavigate();

  if (!Session) {
    navigate("/login");
    return;
  }

  return (
    <>
      <InputForm />
      <Table />
    </>
  );
}
