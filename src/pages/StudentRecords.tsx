import InputForm from "@/components/InputForm";
import StudentTable from "@/components/StudentTable";
import { checkDupes, formatDate } from "@/helper/functions";
import { useAuth } from "@/hooks/useAuth";
import { useDepartments } from "@/hooks/useDepartments";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useSettings } from "@/hooks/useSettings";
import { useStudents } from "@/hooks/useStudents";
import { useUsers } from "@/hooks/useUsers";
import { exportData } from "@/lib/exportUtils";
import type { NewStudent, StudentInput } from "@/types/students";
import { useState, type SubmitEvent } from "react";
import { Navigate } from "react-router-dom";
import LoadingCard from "@/components/loading-card";
import LoadingModal from "@/components/loading-modal";
import ErrorCard from "@/components/error-card";
import { SetErrorMessage } from "@/helper/errorhelpers";
import useAskedAbout from "@/hooks/useAsked_About";

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
    IncrementStudentVisits,
    IsUpdating,
    AddStudent,
    UpdateStudent,
    DeleteStudent,
  } = useStudents(Session?.user);

  const { AskedAbout, syncStudentCourses } = useAskedAbout();

  const { Users, Loading: UsersLoading } = useUsers(Session?.user);

  const { Departments, Loading: DepartmentsLoading } = useDepartments();

  const loading =
    AuthLoading || StudentsLoading || DepartmentsLoading || UsersLoading;

  if (AuthError) {
    return <ErrorCard message={SetErrorMessage(AuthError)} />;
  }

  if (loading) {
    return (
      <LoadingCard
        message={AuthLoading ? "Checking authentication" : "Loading data"}
      />
    );
  }

  if (!Session) {
    return <Navigate to='/login' replace />;
  }

  if (!Students || !Users || !Departments || !AskedAbout) {
    return <ErrorCard message='Failed to load required data.' />;
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || !Session || !Students) return false;

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

    await AddStudent(newStudent, {
      onSuccess: async(newStudent) => {
        console.log("created a new student");

        if (StudentInput.askedCourses.length > 0) {
          const coursesSaved = await syncStudentCourses(
            newStudent.id,
            StudentInput.askedCourses,
          );

          if (!coursesSaved) {
            setLocalError(
              "Student added, but failed to save asked-about courses.",
            );
          }
        }

        setIsSubmitting(false);
        setStudentInput(InitialValue);
      },
    });

    return true;
  }

  function handleExport() {
    const exportData_formatted = Students!.map((student) => ({
      "Student ID": student.studentId,
      "Student Name": student.studentName,
      Email: student.email,
      Department:
        Departments!.find((d) => d.id === student.department_id)?.name || "—",
      "Added By":
        Users!.find((u) => u.id === student.added_by)?.display_name || "—",
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
        formError={LocalError}
      />

      <LoadingModal
        open={isSubmitting}
        message={`Adding ${StudentInput.studentName || "student"}...`}
      />

      <StudentTable
        Students={Students}
        Users={Users}
        Departments={Departments}
        IncrementVisits={IncrementStudentVisits}
        UpdateStudent={UpdateStudent}
        DeleteStudent={DeleteStudent}
        isUpdating={IsUpdating}
        AskedAbout={AskedAbout}
        syncStudentCourses={syncStudentCourses}
      />
    </>
  );
}
