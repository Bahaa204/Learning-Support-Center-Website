import InputForm from "@/components/InputForm";
import StudentTable from "@/components/StudentTable";
import { checkDupes, formatDate } from "@/helper/functions";
import { useAuth } from "@/hooks/useAuth";
import { useDepartments } from "@/hooks/useDepartments";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useSettings } from "@/hooks/useSettings";
import { useStudents } from "@/hooks/useStudents";
import { useUsers } from "@/hooks/useUsers";
import { useAsked_About } from "@/hooks/useAsked_About";
import { exportData } from "@/lib/exportUtils";
import type { NewStudent, StudentInput } from "@/types/students";
import { useState, type SubmitEvent } from "react";
import { Navigate } from "react-router-dom";
import LoadingCard from "@/components/loading-card";
import LoadingModal from "@/components/loading-modal";

export default function StudentRecords() {
  useDocumentTitle("Student Records");

  const InitialValue: StudentInput = {
    studentId: NaN,
    studentName: "",
    email: "",
    department_id: NaN,
    askedCourses: [],
    visitDateTime: new Date().toISOString(),
  };

  const [StudentInput, setStudentInput] = useState<StudentInput>(InitialValue);
  const [LocalError, setLocalError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { Session, Loading: AuthLoading, Error: AuthError } = useAuth();
  const { Settings } = useSettings();

  const {
    Students,
    Loading: StudentsLoading,
    Error: StudentsError,
    incrementStudentVisits,
    isUpdating,
    addStudent,
    UpdateStudent,
    DeleteStudent,
  } = useStudents(Session?.user);

  const { syncStudentCourses } = useAsked_About();

  const {
    Users,
    Loading: UsersLoading,
    Error: UsersError,
  } = useUsers(Session?.user);

  const {
    Departments,
    Loading: DepartmentsLoading,
    Error: DepartmentsError,
  } = useDepartments();

  const loading =
    AuthLoading || StudentsLoading || DepartmentsLoading || UsersLoading;
  const error =
    AuthError || StudentsError || DepartmentsError || UsersError || LocalError;

  if (error && !LocalError) {
    return (
      <div className='flex items-center justify-center h-[50vh]'>{error}</div>
    );
  }

  if (loading) {
    return (
      <LoadingCard
        message={AuthLoading ? "Checking authentication" : "Loading students"}
      />
    );
  }

  if (!Session) {
    return <Navigate to='/login' replace />;
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || !Session) return false;

    if (checkDupes(Students, StudentInput)) {
      setLocalError("A student with this ID or email already exists.");
      return false;
    }

    const newStudent: NewStudent = {
      studentName: StudentInput.studentName,
      studentId: StudentInput.studentId,
      email: StudentInput.email,
      department_id: StudentInput.department_id,
      added_at: formatDate(StudentInput.visitDateTime),
      added_by: Session.user.id,
      nb_visits: 1,
    };

    // show a small modal while submitting
    setLocalError("");
    setIsSubmitting(true);
    const createdStudent = await addStudent(newStudent);
    setIsSubmitting(false);

    if (createdStudent) {
      if (StudentInput.askedCourses.length > 0) {
        const coursesSaved = await syncStudentCourses(
          createdStudent.id,
          StudentInput.askedCourses,
        );

        if (!coursesSaved) {
          setLocalError(
            "Student added, but failed to save asked-about courses.",
          );
        }
      }

      setStudentInput(InitialValue);
      return true;
    }

    setLocalError("Failed to add student. Please try again.");
    return false;
  }

  function handleExport() {
    const exportData_formatted = Students.map((student) => ({
      "Student ID": student.studentId,
      "Student Name": student.studentName,
      Email: student.email,
      Department:
        Departments.find((d) => d.id === student.department_id)?.name || "—",
      "Added By":
        Users.find((u) => u.id === student.added_by)?.display_name || "—",
      "Added At": student.added_at,
      Visits: student.nb_visits,
    }));

    exportData(exportData_formatted, Settings.exportFormat, "Student Records");
  }

  function UpdateFields(fields: Partial<StudentInput>) {
    setStudentInput((prev) => ({ ...prev, ...fields }));
  }

  return (
    <>
      <div className='page-header'>
        <div className='flex justify-between items-start'>
          <div>
            <h1 className='page-title'>Student Support Center Visits</h1>
            <p className='page-desc'>
              Track student visits and support sessions at the Learning Support
              Center.
            </p>
          </div>
          <button
            onClick={handleExport}
            className='btn btn-primary export-button'
          >
            Export {Settings.exportFormat === "csv" ? "CSV" : "Excel"}
          </button>
        </div>
      </div>

      <InputForm
        mode='student'
        handleStudentSubmit={handleSubmit}
        studentInput={StudentInput}
        updateFields={UpdateFields}
        Departments={Departments}
        loading={loading}
        formError={error}
      />

      <LoadingModal
        open={isSubmitting}
        message={`Adding ${StudentInput.studentName || "student"}...`}
      />

      <StudentTable
        Students={Students}
        Users={Users}
        Departments={Departments}
        IncrementVisits={incrementStudentVisits}
        UpdateStudent={UpdateStudent}
        DeleteStudent={DeleteStudent}
        isUpdating={isUpdating}
      />
    </>
  );
}
