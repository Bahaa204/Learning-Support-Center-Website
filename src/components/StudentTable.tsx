import type { Department } from "@/types/department";
import type { Student, StudentInput, UpdatedStudent } from "@/types/students";
import type { ErrorNotice, MutationOptions } from "@/types/types";
import type { User } from "@/types/users";
import { useSettings } from "@/hooks/useSettings";
import { LightbulbIcon, MoreHorizontalIcon } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
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
import { Spinner } from "./ui/spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import Modal from "./Modal";
import CoursesMenu from "./CoursesMenu";
import CoursesDisplayList from "./CoursesDisplayList";
import type { AskedAbout } from "@/types/asked_about";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "./ui/context-menu";

export type TableProps = {
  Students: Student[];
  Users: User[];
  Departments: Department[];
  IncrementVisits: (
    studentId: Student["studentId"],
    options?: MutationOptions<Student, Student["studentId"]>,
  ) => Promise<Student | null>;
  UpdateStudent: (
    id: Student["studentId"],
    updatedStudent: UpdatedStudent,
    options?: MutationOptions<
      Student,
      { id: Student["studentId"]; updatedStudent: UpdatedStudent }
    >,
  ) => Promise<Student | null>;
  DeleteStudent: (
    id: Student["studentId"],
    options?: MutationOptions<boolean, Student["studentId"]>,
  ) => Promise<boolean>;
  isUpdating: Student["studentId"] | null;
  AskedAbout: AskedAbout[];
  syncStudentCourses: (
    studentId: AskedAbout["student_Id"],
    courseCodes: AskedAbout["course_code"][],
  ) => Promise<boolean>;
};

export default function StudentTable({
  Students,
  IncrementVisits,
  UpdateStudent,
  DeleteStudent,
  isUpdating,
  Users,
  Departments,
  AskedAbout,
  syncStudentCourses,
}: TableProps) {
  const InitialValue: StudentInput = {
    studentId: NaN,
    studentName: "",
    email: "",
    department_id: NaN,
    askedCourses: [],
    visitDateTime: new Date().toISOString(),
  };

  const EmptyError: ErrorNotice = {
    id: NaN,
    message: "",
  };

  const { Settings } = useSettings();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const [EditId, setEditId] = useState<Student["studentId"] | null>(null);
  const [EditValues, setEditValues] = useState<StudentInput>(InitialValue);
  const [EditAskedCourses, setEditAskedCourses] = useState<string[]>([]);
  const [DeletedStudent, setDeletedStudent] = useState<Student | null>(null);
  const [IsOpen, setIsOpen] = useState<boolean>(false);
  const [ErrorNotice, setErrorNotice] = useState<ErrorNotice>(EmptyError);

  const askedCoursesByStudent = useMemo(() => {
    const map: Record<string, string[]> = {};

    for (const row of AskedAbout) {
      if (!map[row.student_Id]) {
        map[row.student_Id] = [];
      }

      map[row.student_Id].push(row.course_code);
    }

    return map;
  }, [AskedAbout]);

  function startEditing(student: Student) {
    setEditId(student.studentId);
    setEditValues({
      studentId: student.studentId,
      studentName: student.studentName,
      email: student.email,
      department_id: student.department_id,
      askedCourses: askedCoursesByStudent[student.id] || [],
      visitDateTime: student.added_at,
    });
    setEditAskedCourses(askedCoursesByStudent[student.id] || []);
  }

  function cancelEditing() {
    setEditId(null);
    setEditValues(InitialValue);
    setEditAskedCourses([]);
  }

  async function handleDeleteStudent(id: Student["studentId"]) {
    await DeleteStudent(id, {
      onError: (_error, id) =>
        setErrorNotice({
          id: id,
          message: "Failed to delete student. Please try again.",
        }),
    });
  }

  async function handleEditStudent(student: Student) {
    const updatedStudentPayload: UpdatedStudent = {
      studentId: EditValues.studentId,
      studentName: EditValues.studentName,
      email: EditValues.email || null,
      department_id: EditValues.department_id,
    };

    await UpdateStudent(student.studentId, updatedStudentPayload, {
      onSuccess: async (updatedStudent) => {
        await syncStudentCourses(updatedStudent.id, EditAskedCourses);
        cancelEditing();
      },
      onError: () => {
        setErrorNotice({
          id: student.studentId,
          message: "Failed to update student. Please try again.",
        });
      },
    });
  }

  async function handleIncrementVisits(id: Student["studentId"]) {
    if (isUpdating === id) return;

    await IncrementVisits(id, {
      onError: (_error, id) => {
        setErrorNotice({
          id: id,
          message: "Failed to update student visits. Please try again.",
        });
        setTimeout(() => {
          setErrorNotice(EmptyError);
        }, 2500);
      },
    });
  }

  function updateFields(fields: Partial<StudentInput>) {
    setEditValues((prev) => ({ ...prev, ...fields }));
  }

  // Pagination logic
  const startIndex = (currentPage - 1) * Settings.pageSize;
  const endIndex = startIndex + Settings.pageSize;
  const paginatedStudents = Students.slice(startIndex, endIndex);
  const totalPages = Math.ceil(Students.length / Settings.pageSize);

  function RowActions({
    student,
    isEditing,
    menu_item,
  }: {
    student: Student;
    isEditing: boolean;
    menu_item: "context" | "dropdown";
  }) {
    const MenuItemElement =
      menu_item === "context" ? ContextMenuItem : DropdownMenuItem;

    const Separator =
      menu_item === "context" ? ContextMenuSeparator : DropdownMenuSeparator;

    return (
      <>
        {!isEditing && (
          <>
            <MenuItemElement>
              <Button
                className='cursor-pointer'
                onClick={() => startEditing(student)}
              >
                Edit
              </Button>
            </MenuItemElement>
            <Separator />
          </>
        )}
        {isEditing && (
          <>
            <MenuItemElement>
              <Button
                className='cursor-pointer'
                onClick={() => {
                  console.log("Clicked");
                  handleEditStudent(student);
                }}
              >
                Submit Edits
              </Button>
            </MenuItemElement>
            <Separator />
          </>
        )}
        {isEditing && (
          <MenuItemElement variant='destructive'>
            <Button
              variant='destructive'
              className='cursor-pointer'
              onClick={cancelEditing}
            >
              Cancel Edits
            </Button>
          </MenuItemElement>
        )}
        {!isEditing && (
          <MenuItemElement>
            <Button
              className='cursor-pointer'
              onClick={() => handleIncrementVisits(student.studentId)}
            >
              Increment Visits
            </Button>
          </MenuItemElement>
        )}
        {!isEditing && (
          <MenuItemElement variant='destructive'>
            <Button
              variant='destructive'
              className='cursor-pointer'
              onClick={() => {
                setIsOpen(true);
                setDeletedStudent(student);
              }}
            >
              Delete
            </Button>
          </MenuItemElement>
        )}
      </>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center'></TableHead>
            <TableHead className='text-center'>Student ID</TableHead>
            <TableHead className='text-center'>Student Name</TableHead>
            <TableHead className='text-center'>Email</TableHead>
            <TableHead className='text-center'>Department</TableHead>
            <TableHead className='text-center'>Added By</TableHead>
            <TableHead className='text-center'>Added At</TableHead>
            <TableHead className='text-center'>Courses Asked About</TableHead>
            <TableHead className='text-center'>Visits</TableHead>
            <TableHead className='text-center'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedStudents.length > 0 ? (
            paginatedStudents.map((student, index) => {
              const isEditing = EditId === student.studentId;

              if (ErrorNotice.id === student.studentId)
                return (
                  <TableRow key={student.id}>
                    <TableCell
                      colSpan={10}
                      className='text-center text-red-500 bg-red-500/5'
                    >
                      {ErrorNotice.message}
                    </TableCell>
                  </TableRow>
                );

              return (
                <ContextMenu key={student.id}>
                  <ContextMenuTrigger asChild>
                    <TableRow>
                      <TableHead className='text-center'>{index + 1}</TableHead>
                      <TableCell className='text-center'>
                        {isEditing ? (
                          <Input
                            type='number'
                            placeholder='Student ID'
                            value={EditValues.studentId}
                            onChange={(event) =>
                              updateFields({
                                studentId: parseInt(event.target.value),
                              })
                            }
                          />
                        ) : (
                          student.studentId
                        )}
                      </TableCell>
                      <TableCell className='text-center'>
                        {isEditing ? (
                          <Input
                            type='text'
                            placeholder='Student Name'
                            value={EditValues.studentName}
                            onChange={(event) =>
                              updateFields({ studentName: event.target.value })
                            }
                          />
                        ) : (
                          student.studentName
                        )}
                      </TableCell>
                      <TableCell className='text-center'>
                        {isEditing ? (
                          <Input
                            type='email'
                            placeholder='Email'
                            value={EditValues.email || ""}
                            onChange={(event) =>
                              updateFields({ email: event.target.value })
                            }
                          />
                        ) : (
                          student.email || "—"
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Select
                            value={String(EditValues.department_id ?? "")}
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
                        ) : (
                          Departments.find(
                            (dept) => dept.id === student.department_id,
                          )?.name
                        )}
                      </TableCell>
                      <TableCell>
                        {Users.find((user) => user.id === student.added_by)
                          ?.display_name || "—"}
                      </TableCell>
                      <TableCell>{student.added_at}</TableCell>
                      <TableCell>
                        {isEditing ? (
                          <CoursesMenu
                            selectedCourseCodes={EditAskedCourses}
                            onSelectionChange={setEditAskedCourses}
                            buttonLabel='Open Courses Menu'
                          />
                        ) : (
                          <CoursesDisplayList
                            selectedCourseCodes={
                              askedCoursesByStudent[student.id] || []
                            }
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {isUpdating === student.studentId ? (
                          <Spinner />
                        ) : (
                          student.nb_visits
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            className='cursor-pointer'
                          >
                            <Button variant='secondary'>
                              <MoreHorizontalIcon />
                              <span className='sr-only'>Open Menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align='center'
                            className='focus:bg-none w-full'
                          >
                            <RowActions
                              menu_item='dropdown'
                              student={student}
                              isEditing={isEditing}
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </ContextMenuTrigger>

                  <ContextMenuContent>
                    <RowActions
                      menu_item='context'
                      student={student}
                      isEditing={isEditing}
                    />
                  </ContextMenuContent>
                </ContextMenu>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={10} className='text-center text-[17px]'>
                No student records found. Check your filters or add new student
                records to see them here.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-center gap-2 text-gray-600/50">
        <LightbulbIcon /> Tip: Right click (or hold on mobile) or click the actions button on a
        row to view some quick actions.
      </div>

      {/* Pagination */}
      <div className='flex justify-center items-center gap-4 m-4'>
        <Button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className='btn-primary'
        >
          Previous
        </Button>
        <span className='text-[0.9rem] text-(--text-muted)'>
          Page {currentPage} of {Math.max(1, totalPages)}
        </span>
        <Button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className='btn-primary'
        >
          Next
        </Button>
      </div>

      {IsOpen && (
        <Modal
          Open={IsOpen}
          setOpen={setIsOpen}
          text={DeletedStudent?.studentName || "this student"}
          handleDelete={async () => {
            if (DeletedStudent)
              await handleDeleteStudent(DeletedStudent.studentId);
          }}
        />
      )}
    </>
  );
}
