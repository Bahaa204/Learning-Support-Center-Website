import { Navigate, useNavigate } from "react-router-dom";
import InputForm from "../components/InputForm";
import Table from "../components/Table";
import { useDocumentTitle, useFetchFromTable, useGetSession } from "../hooks/CustomHooks";
import { getName } from "../helper/functions";
import { useEffect, useState } from "react";
import type { Student } from "../types/types";
import { supabaseClient } from "../supabase-client";
import Spinner from "../components/Spinner";

export default function Main() {

  useDocumentTitle("Home")

  const [Students, setStudents] = useState<Student[]>([]);
  const {
    Session,
    Loading: SessionLoading,
    Error: SessionError,
  } = useGetSession();

  const name = getName(Session);

  const {
    Data,
    Loading: LoadingData,
    Error: FetchError,
  } = useFetchFromTable<"Students">("Students", name);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => setStudents(Data))();
  }, [Data]);

  // Real Time Listeners to update the State
  useEffect(() => {
    const channel = supabaseClient.channel("Students-Channel");
    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Students" },
        (payload) => {
          const newStudent = payload.new as Student;
          setStudents((prev) => [...prev, newStudent]);
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "Students" },
        (payload) => {
          const newStudent = payload.new as Student;
          setStudents((prev) =>
            prev.map((student) =>
              student.studentId === newStudent.studentId
                ? { ...student, nb_visits: student.nb_visits + 1 }
                : student,
            ),
          );
        },
      )
      .subscribe((status) => {
        console.log(status);
      });

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  if (SessionLoading || LoadingData) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <Spinner text={SessionLoading? "Checking Authentication": "Loading Data"} />
      </div>
    );
  }

  if (!Session) {
    return <Navigate to="/login" replace />;
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
