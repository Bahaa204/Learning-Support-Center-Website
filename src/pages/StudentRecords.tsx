import StudentTable from "@/components/StudentTable";
import { formatDate } from "@/helper/functions";
import { useAuth } from "@/hooks/useAuth";
import { useDepartments } from "@/hooks/useDepartments";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useSettings } from "@/hooks/useSettings";
import { useStudents } from "@/hooks/useStudents";
import { useUsers } from "@/hooks/useUsers";
import { exportData } from "@/lib/exportUtils";
import type { NewStudent, Student, StudentInput } from "@/types/students";
import { useState, type SubmitEvent } from "react";
import { useSearchParams } from "react-router-dom";
import LoadingCard from "@/components/loading-card";
import ErrorCard from "@/components/error-card";
import { SetErrorMessage } from "@/helper/errorhelpers";
import useAskedAbout from "@/hooks/useAsked_About";
import { validateStudentInput } from "@/helper/validation";
import { Button } from "@/components/ui/button";
import {
  BookOpenIcon,
  FilterIcon,
  UserPlusIcon,
  UserRoundIcon,
} from "lucide-react";
import { FilterModal } from "@/components/FilterModal";
import NavigateToLogin from "@/components/NavigateToLogin";
import Modal from "@/components/Modal";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormSection from "@/components/FormSection";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker } from "@/components/DateTimePicker";
import CoursesMenu from "@/components/CoursesMenu";
import { Spinner } from "@/components/ui/spinner";

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
  const [IsOpen, setIsOpen] = useState<boolean>(false);
  const [ExistingStudent, setExistingStudent] = useState<Student | null>(null);
  const [SearchParams, setSearchParams] = useSearchParams();

  const { Session, Loading: AuthLoading, Error: AuthError } = useAuth();
  const { Settings } = useSettings();

  const {
    Students,
    // Loading: StudentsLoading,
    Error: StudentsError,
    IncrementStudentVisits,
    IsUpdating,
    IsDeleting,
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

  const loading = AuthLoading || DepartmentsLoading || UsersLoading;

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
    return <NavigateToLogin />;
  }

  if (error) {
    return <ErrorCard message={SetErrorMessage(error)} />;
  }

  const data = Students && Users && Departments && AskedAbout;

  if (!data) {
    return <ErrorCard message="Failed to load required data." />;
  }

  const IsFilterActive = SearchParams.toString() !== "";

  const filteredStudents = IsFilterActive
    ? Students.filter((student) => {
        const nameFilter = SearchParams.get("name");
        const emailFilter = SearchParams.get("email");
        const departmentFilter = SearchParams.get("department_id");
        const dateFilter = SearchParams.get("date");
        const askedAboutFilter = SearchParams.get("asked_about");
        const selectedAskedAboutCourses = askedAboutFilter
          ? askedAboutFilter.split(",")
          : [];
        const studentAskedAboutCourses = AskedAbout.filter(
          (course) => course.student_Id === student.id,
        ).map((course) => course.course_code);

        const selectedDate = dateFilter ? new Date(dateFilter) : null;
        const studentDate = student.added_at
          ? new Date(student.added_at)
          : null;
        const isDateMatch =
          !selectedDate ||
          !studentDate ||
          (studentDate.getFullYear() === selectedDate.getFullYear() &&
            studentDate.getMonth() === selectedDate.getMonth() &&
            studentDate.getDate() === selectedDate.getDate());

        return (
          (!nameFilter || student.studentName.includes(nameFilter)) &&
          (!emailFilter || student.email?.includes(emailFilter)) &&
          (!departmentFilter ||
            student.department_id === parseInt(departmentFilter)) &&
          isDateMatch &&
          (selectedAskedAboutCourses.length === 0 ||
            studentAskedAboutCourses.some((course) =>
              selectedAskedAboutCourses.includes(course),
            ))
        );
      })
    : Students;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || IsSubmitting) return;
    setIsSubmitting(true);

    const validationmessage = validateStudentInput(StudentInput);

    if (validationmessage) {
      setLocalError(validationmessage);
      setIsSubmitting(false);
      return;
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

    const ExistingStudent = Students?.find(
      (student) => student.studentId === newStudent.studentId,
    );

    if (ExistingStudent) {
      setExistingStudent(ExistingStudent);
      return;
    }

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
  }

  function handleExport() {
    const exportData_formatted = filteredStudents.map((student) => ({
      "Student ID": student.studentId,
      "Student Name": student.studentName,
      Email: student.email,
      Department:
        Departments!.find((d) => d.id === student.department_id)?.name || "—",
      "Added By":
        Users!.find((u) => u.id === student.added_by)?.display_name || "—",
      "Added At": student.added_at,
      "Courses Asked About": AskedAbout!
        .filter((course) => course.student_Id === student.id)
        .map((course) => course.course_code)
        .join(", "),
      Visits: student.nb_visits,
    }));

    exportData(exportData_formatted, Settings.exportFormat, "Student Records");
  }

  function UpdateFields(fields: Partial<StudentInput>) {
    setStudentInput((prev) => ({ ...prev, ...fields }));
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <UserPlusIcon className="size-8 text-primary" />
              <div>
                <CardTitle>Add New Student</CardTitle>
                <CardDescription>
                  Register a student and record their support center visit.
                </CardDescription>
              </div>
              <Button
                type="button"
                onClick={handleExport}
                className="btn-primary ml-auto"
              >
                Export {Settings.exportFormat === "csv" ? "CSV" : "Excel"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormSection icon={<UserRoundIcon />} title="Student Information">
              <FieldGroup className="grid grid-cols-2 grid-rows-2">
                <Field>
                  <FieldLabel>
                    Student Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      type="text"
                      value={StudentInput.studentName}
                      onChange={(event) =>
                        UpdateFields({ studentName: event.target.value })
                      }
                      required
                      aria-invalid={LocalError.includes("Student name")}
                      disabled={IsSubmitting}
                      placeholder="e.g John Doe"
                    />
                    <FieldDescription>
                      Enter the Student's full name <br />
                      {!StudentInput.studentName && (
                        <span className="text-destructive">Required</span>
                      )}
                    </FieldDescription>
                    {LocalError.includes("Student name") && (
                      <FieldError>{LocalError}</FieldError>
                    )}
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>
                    Student ID <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      type="number"
                      value={StudentInput.studentId}
                      onChange={(event) =>
                        UpdateFields({ studentId: Number(event.target.value) })
                      }
                      required
                      aria-invalid={LocalError.includes("Student ID")}
                      disabled={IsSubmitting}
                      placeholder="e.g 123456"
                    />
                    <FieldDescription>
                      Enter the Student's RHU ID
                      <br />
                      {!StudentInput.studentId && (
                        <span className="text-destructive">Required</span>
                      )}
                    </FieldDescription>
                    {LocalError.includes("Student ID") && (
                      <FieldError>{LocalError}</FieldError>
                    )}
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Student email</FieldLabel>
                  <FieldContent>
                    <Input
                      type="email"
                      value={StudentInput.email || ""}
                      onChange={(event) =>
                        UpdateFields({ email: event.target.value })
                      }
                      aria-invalid={LocalError.includes("Invalid email")}
                      disabled={IsSubmitting}
                      placeholder="e.g john.doe@students.rhu.edu.lb"
                    />
                    <FieldDescription>
                      Enter the Student's RHU email address <br /> Optional
                    </FieldDescription>
                    {LocalError.includes("Invalid email") && (
                      <FieldError>{LocalError}</FieldError>
                    )}
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>
                    Student Department{" "}
                    <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <Select
                      value={
                        isNaN(StudentInput.department_id)
                          ? undefined
                          : String(StudentInput.department_id)
                      }
                      onValueChange={(value) =>
                        UpdateFields({ department_id: Number(value) })
                      }
                    >
                      <SelectTrigger
                        className="w-full"
                        aria-invalid={LocalError.toLowerCase().includes(
                          "department",
                        )}
                      >
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Departments</SelectLabel>
                          {Departments.map((department, index) => (
                            <SelectItem
                              key={index}
                              value={String(department.id)}
                            >
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      Select the Student's department
                    </FieldDescription>
                    {LocalError.toLowerCase().includes("department") && (
                      <FieldError>{LocalError}</FieldError>
                    )}
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FormSection>
            <FormSection icon={<BookOpenIcon />} title="Visit Details">
              <FieldGroup className="grid grid-cols-2 grid-rows-1">
                <Field>
                  <FieldLabel>Date And Time</FieldLabel>
                  <FieldContent>
                    <DateTimePicker
                      value={StudentInput.visitDateTime}
                      onChange={(value) =>
                        UpdateFields({ visitDateTime: value })
                      }
                    />
                    <FieldDescription>
                      Date and Time of the student's visit <br />
                      Defaults to the current date and time
                    </FieldDescription>
                    {LocalError.includes("date and time") && (
                      <FieldError>{LocalError}</FieldError>
                    )}
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Asked About Courses</FieldLabel>
                  <FieldContent>
                    <CoursesMenu
                      selectedCourseCodes={StudentInput.askedCourses}
                      onSelectionChange={(courses) =>
                        UpdateFields({ askedCourses: courses })
                      }
                    />
                  </FieldContent>
                  <FieldDescription>
                    Select the courses the student asked about during their
                    visit
                  </FieldDescription>
                  {LocalError.includes("courses") && (
                    <FieldError>{LocalError}</FieldError>
                  )}
                </Field>
              </FieldGroup>
            </FormSection>
          </CardContent>
          <CardFooter className="justify-end gap-3">
            <CardAction>
              <Button
                type="reset"
                variant="outline"
                onClick={() => setStudentInput(InitialValue)}
                disabled={IsSubmitting}
              >
                Clear
              </Button>
            </CardAction>
            <CardAction>
              <Button
                type="submit"
                className="btn-primary"
                disabled={IsSubmitting}
              >
                {IsSubmitting ? (
                  <>
                    <Spinner /> Adding Student...
                  </>
                ) : (
                  "Add Student"
                )}
              </Button>
            </CardAction>
          </CardFooter>
        </Card>
      </form>

      <div className="p-5 flex flex-col gap-4">
        <h2 className="text-xl text-(--navy) mb-4 font-serif font-semibold flex ">
          Student Records
          <div className="flex gap-2 mt-2 ml-auto font-[georgia]">
            <Button
              className="text-lg btn-primary"
              onClick={() => setIsOpen(true)}
            >
              <FilterIcon className="size-5!" /> Filter Records
            </Button>
          </div>
        </h2>

        <StudentTable
          Students={filteredStudents}
          Users={Users}
          Departments={Departments}
          IncrementVisits={IncrementStudentVisits}
          UpdateStudent={UpdateStudent}
          DeleteStudent={DeleteStudent}
          isUpdating={IsUpdating}
          isDeleting={IsDeleting}
          AskedAbout={AskedAbout}
          syncStudentCourses={syncStudentCourses}
        />
      </div>

      <FilterModal
        IsOpen={IsOpen}
        setIsOpen={setIsOpen}
        SearchParams={SearchParams}
        setSearchParams={setSearchParams}
        Departments={Departments}
        mode="student"
      />

      <Modal
        IsDestructive={false}
        Open={ExistingStudent !== null}
        setOpen={() => setExistingStudent(null)}
        BtnText="Overwrite"
        text={
          <>
            Student {StudentInput.studentName} with {StudentInput.studentId}{" "}
            already exists. Do you want to overwrite their record?
            <strong>This Action Cannot Be Undone</strong>
          </>
        }
        OnConfirm={async () => {
          if (!ExistingStudent) return;

          await UpdateStudent(
            ExistingStudent.studentId,
            {
              added_at: ExistingStudent.added_at,
              added_by: ExistingStudent.added_by,
              department_id: StudentInput.department_id,
              email: StudentInput.email,
              studentName: StudentInput.studentName,
              nb_visits: ExistingStudent.nb_visits + 1,
            },
            {
              onSuccess: async (updatedStudent) => {
                await syncStudentCourses(
                  updatedStudent.id,
                  StudentInput.askedCourses,
                );
                setIsSubmitting(false);
              },
              onError: () => {
                setLocalError("Failed to update student. Please try again.");
              },
            },
          );
        }}
      />
    </>
  );
}
