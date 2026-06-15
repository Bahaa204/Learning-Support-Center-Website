import type { InputFormProps } from "@/types/types";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "./ui/field";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import PasswordInput from "./PasswordInput";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { useState, type SubmitEvent } from "react";
import CoursesMenu from "./CoursesMenu";
import { DateTimePicker } from "./DateTimePicker.tsx";
import TimeSlots from "./TimeSlots.tsx";

export default function InputForm({
  loading,
  mode,
  handleStudentSubmit,
  handleUserSubmit,
  studentInput,
  userInput,
  updateFields,
  Departments,
  formError,
}: InputFormProps) {
  const isStudent = mode === "student";

  const title = isStudent ? "Add New Student" : "Add New Support Center Staff";

  const description = isStudent
    ? "Register a new student to track their support center visits"
    : "Create a new Support Center Staff account";

  const [successMessage, setSuccessMessage] = useState<string>("");

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setSuccessMessage("");

    const ok = isStudent
      ? await handleStudentSubmit(event)
      : await handleUserSubmit(event);

    if (ok) {
      setSuccessMessage(isStudent ? "Student added." : "User added.");
      setTimeout(() => setSuccessMessage(""), 3500);
    }
  }

  return (
    <FieldSet className='form-card'>
      <FieldGroup className='form-card-header gold'>
        <FieldTitle className='section-title'>{title}</FieldTitle>
        <FieldDescription className='section-desc'>
          {description}
        </FieldDescription>
      </FieldGroup>

      {formError && (
        <FieldGroup className='bg-red-500/15 rounded-lg p-5'>
          <Field>
            <FieldError className='px-5 font-bold text-lg'>
              {formError}
            </FieldError>
          </Field>
        </FieldGroup>
      )}

      <FieldGroup className='form-body'>
        <form onSubmit={onSubmit}>
          <div className={isStudent ? "grid-3" : "grid-1"}>
            {isStudent && (
              <>
                <Field className='field'>
                  <FieldLabel htmlFor='studentName'>
                    Student Name <span className='required'>*</span>
                  </FieldLabel>

                  <Input
                    required
                    type='text'
                    id='studentName'
                    placeholder='John Doe'
                    value={studentInput.studentName}
                    onChange={(event) =>
                      updateFields({ studentName: event.target.value })
                    }
                  />
                  <FieldDescription>
                    Enter the full name of the student.
                  </FieldDescription>
                  {!studentInput.studentName && (
                    <FieldError>Student name is required.</FieldError>
                  )}
                </Field>

                <Field className='field'>
                  <FieldLabel htmlFor='studentId'>
                    Student ID <span className='required'>*</span>
                  </FieldLabel>

                  <Input
                    required
                    type='number'
                    id='studentId'
                    placeholder='123456'
                    value={
                      Number.isNaN(studentInput.studentId)
                        ? ""
                        : studentInput.studentId
                    }
                    onChange={(event) =>
                      updateFields({
                        studentId: Number(event.target.value),
                      })
                    }
                  />
                  <FieldDescription>Enter the student ID</FieldDescription>
                  {!studentInput.studentId && (
                    <FieldError>Student ID is required.</FieldError>
                  )}
                </Field>

                <Field className='field'>
                  <FieldLabel htmlFor='studentEmail'>Student Email</FieldLabel>

                  <Input
                    type='email'
                    id='studentEmail'
                    placeholder='johndoe@students.rhu.edu.lb'
                    value={studentInput.email || ""}
                    onChange={(event) =>
                      updateFields({ email: event.target.value })
                    }
                  />
                  <FieldDescription>
                    Enter the student's email address.
                    <br />
                    Optional
                  </FieldDescription>
                </Field>

                <Field className='field'>
                  <FieldLabel htmlFor='studentDepartment'>
                    Student Department <span className='required'>*</span>
                  </FieldLabel>

                  <Select
                    value={String(studentInput.department_id)}
                    onValueChange={(value) => {
                      updateFields({ department_id: parseInt(value) });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select a department' />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select a Department</SelectLabel>
                        {Departments.map((department, index) => (
                          <div key={department.id}>
                            <SelectItem value={String(department.id)}>
                              {department.name}
                            </SelectItem>
                            {index !== Departments.length - 1 && (
                              <SelectSeparator />
                            )}
                          </div>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Enter the student's department
                  </FieldDescription>
                  {!studentInput.department_id && (
                    <FieldError>Student department is required.</FieldError>
                  )}
                </Field>
                <Field className='field'>
                  <FieldLabel htmlFor='studentEmail'>
                    Courses Asked About
                  </FieldLabel>

                  <CoursesMenu
                    selectedCourseCodes={studentInput.askedCourses}
                    onSelectionChange={(askedCourses) =>
                      updateFields({ askedCourses })
                    }
                    buttonLabel='Open Courses Menu'
                  />
                  <FieldDescription>
                    Choose the courses that the student asked about.
                    <br />
                    You can search by course name or code.
                  </FieldDescription>
                </Field>
                <Field className='field'>
                  <FieldLabel htmlFor='studentEmail'>
                    Date & Time of Visit
                  </FieldLabel>

                  <DateTimePicker
                    value={studentInput.visitDateTime}
                    onChange={(visitDateTime: string) =>
                      updateFields({ visitDateTime })
                    }
                  />
                  <FieldDescription>
                    Choose the date and time of the student's visit.
                    <br />
                    Defaults to the current date and time.
                  </FieldDescription>
                </Field>
              </>
            )}

            {!isStudent && (
              <>
                <Field className='field'>
                  <FieldLabel htmlFor='displayname'>
                    Display Name <span className='required'>*</span>
                  </FieldLabel>

                  <Input
                    required
                    type='text'
                    id='displayname'
                    placeholder='John Doe'
                    value={userInput.displayname}
                    onChange={(event) =>
                      updateFields({ displayname: event.target.value })
                    }
                  />
                  <FieldDescription>
                    Enter the full name of the
                    {userInput.isSupervisor ? "supervisor" : "workstudy "}.
                  </FieldDescription>
                  {!userInput.displayname && (
                    <FieldError>Display name is required.</FieldError>
                  )}
                </Field>

                <Field className='field'>
                  <FieldLabel htmlFor='email'>
                    Email <span className='required'>*</span>
                  </FieldLabel>

                  <Input
                    required
                    type='email'
                    id='email'
                    placeholder='johndoe@students.rhu.edu.lb'
                    value={userInput.email}
                    onChange={(event) =>
                      updateFields({ email: event.target.value })
                    }
                  />
                  <FieldDescription>
                    Enter the email address for this account
                  </FieldDescription>
                  {!userInput.email && (
                    <FieldError>Email is required.</FieldError>
                  )}
                </Field>

                <Field className='field'>
                  <FieldLabel htmlFor='password'>
                    Password <span className='required'>*</span>
                  </FieldLabel>

                  <PasswordInput
                    id='password'
                    placeholder='••••••••'
                    value={userInput.password}
                    onChange={(event) =>
                      updateFields({ password: event.target.value })
                    }
                    className='pr-10'
                  />
                  <FieldDescription>
                    Enter a password for this account. Must be at least 6
                    characters.
                  </FieldDescription>
                  {!userInput.password && (
                    <FieldError>
                      Password is required. Must be at least 6 characters.
                    </FieldError>
                  )}
                </Field>

                <FieldGroup>
                  <Field orientation='horizontal'>
                    <Checkbox
                      id='isSupervisor'
                      name='isSupervisor'
                      className='cursor-pointer rounded-[5px]! size-6!'
                      checked={userInput.isSupervisor}
                      onCheckedChange={(checked) =>
                        updateFields({ isSupervisor: Boolean(checked) })
                      }
                    />
                    <FieldContent>
                      <FieldLabel
                        htmlFor='isSupervisor'
                        className='cursor-pointer'
                      >
                        Is Supervisor
                      </FieldLabel>
                      <FieldDescription>
                        Is This account for a supervisor?
                      </FieldDescription>
                    </FieldContent>
                  </Field>
                </FieldGroup>

                <Field className='field'>
                  <FieldLabel htmlFor='studentDepartment'>
                    Student Department <span className='required'>*</span>
                  </FieldLabel>

                  <Select
                    value={String(userInput.department_id)}
                    onValueChange={(value) => {
                      updateFields({ department_id: parseInt(value) });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select a department' />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select a Department</SelectLabel>
                        {Departments.map((department, index) => (
                          <div key={department.id}>
                            <SelectItem value={String(department.id)}>
                              {department.name}
                            </SelectItem>
                            {index !== Departments.length - 1 && (
                              <SelectSeparator />
                            )}
                          </div>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Enter the{" "}
                    {isStudent
                      ? "student"
                      : userInput.isSupervisor
                        ? "supervisor"
                        : "workstudy"}
                    's department
                  </FieldDescription>
                  {!userInput.department_id && (
                    <FieldError>
                      {userInput.isSupervisor
                        ? "Supervisor department is required."
                        : "WorkStudy department is required."}
                    </FieldError>
                  )}
                </Field>
                <Field className='field'>
                  <FieldLabel htmlFor='password'>
                    Time Slots <span className='required'>*</span>
                  </FieldLabel>
                  <TimeSlots
                    userinput={userInput}
                    updateFields={updateFields}
                    disabled={loading}
                  />
                  <FieldDescription>
                    Choose the time slots of the workstudy.
                  </FieldDescription>
                  {/* {!userInput.password && (
                    <FieldError>
                      Time
                    </FieldError>
                  )} */}
                </Field>
              </>
            )}
          </div>

          <FieldLegend className='form-actions'>
            {successMessage && <div className='mr-auto'>{successMessage}</div>}
            <div className='flex items-center gap-3'>
              <Button
                type='submit'
                className='btn btn-primary p-5!'
                disabled={loading}
              >
                {loading
                  ? "Loading..."
                  : `Add ${isStudent ? "Student" : userInput.isSupervisor ? "Supervisor" : "WorkStudy"}`}
              </Button>
            </div>
          </FieldLegend>
        </form>
      </FieldGroup>
    </FieldSet>
  );
}
