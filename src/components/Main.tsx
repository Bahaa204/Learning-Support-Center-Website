import { useEffect } from "react";
import { useDataContext } from "../context/context";
import InputForm from "./InputForm";
import Table from "./Table";
import { getStudents } from "../helper/backend";
export default function Main() {
  const { setData, setError, setLoading } = useDataContext();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      const { error, data } = await getStudents();

      if (error) {
        console.error("An Error has occurred: ", error.message);
        console.error("Error Details: ", error.details);
        setError("Failed to fetch Data");
        setLoading(false);
        return;
      }

      setLoading(false);
      if (data) setData(data);
    }
    fetchData();
  }, [setData, setError, setLoading]);

  return (
    <>
      <InputForm />
      <Table />
    </>
  );
}
