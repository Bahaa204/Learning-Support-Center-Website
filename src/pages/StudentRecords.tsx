import InputForm from "@/components/InputForm";
import StudentTable from "@/components/StudentTable";
import { formatDate } from "@/helper/functions";
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
import ErrorCard from "@/components/error-card";
import { SetErrorMessage } from "@/helper/errorhelpers";
import useAskedAbout from "@/hooks/useAsked_About";
import { validateStudentInput } from "@/helper/validation";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  const [IsSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [Filter, setFilter] = useState<boolean>(false);

  const { Session, Loading: AuthLoading, Error: AuthError } = useAuth();
  const { Settings } = useSettings();

  const {
    Students,
    Loading: StudentsLoading,
    Error: StudentsError,
    IncrementStudentVisits,
    IsUpdating,
    AddStudent,
    UpdateStudent,
    DeleteStudent,
  } = useStudents(Session?.user);

  const {
    AskedAbout,
    syncStudentCourses,
    Error: AskedAboutError,
  } = useAskedAbout();

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
    AuthError ||
    StudentsError ||
    DepartmentsError ||
    UsersError ||
    AskedAboutError;

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

  if (error) {
    return <ErrorCard message={SetErrorMessage(error)} />;
  }

  const data = Students && Users && Departments && AskedAbout;

  if (!data) {
    return <ErrorCard message='Failed to load required data.' />;
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || IsSubmitting) return false;
    setIsSubmitting(true);

    const validationmessage = validateStudentInput(StudentInput);

    if (validationmessage) {
      setLocalError(validationmessage);
      setIsSubmitting(false);
      return false;
    }

    const newStudent: NewStudent = {
      studentName: StudentInput.studentName,
      studentId: StudentInput.studentId,
      email: StudentInput.email,
      department_id: StudentInput.department_id,
      added_at: formatDate(StudentInput.visitDateTime),
      added_by: Session!.user.id,
      nb_visits: 1,
    };

    await AddStudent(newStudent, {
      onSuccess: async (newStudent) => {
        if (StudentInput.askedCourses.length > 0) {
          const coursesSaved = await syncStudentCourses(
            newStudent.id,
            StudentInput.askedCourses,
          );

          if (!coursesSaved) {
            setLocalError(
              "Student added, but failed to save asked-about courses.",
            );
            setIsSubmitting(false);
          }
        }

        setLocalError("");
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
        isSubmitting={IsSubmitting}
        formError={LocalError}
      />

      <div className='p-5 flex flex-col gap-4'>
        <h2 className='text-xl text-(--navy) mb-4 font-serif font-semibold flex '>
          Student Records
          <div className='flex gap-2 mt-2 ml-auto font-(georgia)'>
            <Checkbox
              id='filter-by-department'
              name='filter-by-department'
              className='cursor-pointer rounded-[5px]! size-6! bg-(--light-gray) border-2! border-(--gray) checked:bg-primary checked:border-primary focus:ring-0'
              checked={Filter}
              onCheckedChange={(checked) => setFilter(Boolean(checked))}
            />
            <Label htmlFor='filter-by-department' className='cursor-pointer'>
              Filter by department
            </Label>
          </div>
        </h2>

        <StudentTable
          Students={
            Filter
              ? Students.filter(
                  (student) =>
                    student.department_id ===
                    Session?.user.user_metadata.department_id,
                )
              : Students
          }
          Users={Users}
          Departments={Departments}
          IncrementVisits={IncrementStudentVisits}
          UpdateStudent={UpdateStudent}
          DeleteStudent={DeleteStudent}
          isUpdating={IsUpdating}
          AskedAbout={AskedAbout}
          syncStudentCourses={syncStudentCourses}
        />
      </div>
    </>
  );
}
