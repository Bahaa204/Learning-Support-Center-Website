import InputForm from "@/components/InputForm";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/helper/functions";
import { useAuth } from "@/hooks/useAuth";
import { useDepartments } from "@/hooks/useDepartments";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useSettings } from "@/hooks/useSettings";
import { useUsers } from "@/hooks/useUsers";
import { useTimeSlots } from "@/hooks/useTimeSlots";
import { exportData } from "@/lib/exportUtils";
import type { NewUser, User, UserInput } from "@/types/users";
import { MoreHorizontalIcon } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { Navigate } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";
import ErrorCard from "@/components/error-card";
import LoadingCard from "@/components/loading-card";
import LoadingModal from "@/components/loading-modal";
import { simplifyErrorMessage } from "@/helper/functions";
import { useNavigate } from "react-router-dom";
import { titleCase } from "title-case";
import { TimeSlotsMenu } from "@/components/TimeSlotMenu";

export default function WorkStudy() {
  useDocumentTitle("Support Center Staff");

  const InitialValue: UserInput = {
    displayname: "",
    email: "",
    password: "",
    department_id: NaN,
    isSupervisor: false,
    time_slots: [],
  };

  const [Input, setInput] = useState<UserInput>(InitialValue);
  const [LocalError, setLocalError] = useState<string>("");

  const {
    Session,
    Loading: AuthLoading,
    Error: AuthError,
    SignUp,
    DeleteUser,
  } = useAuth();

  const {
    Users,
    Loading: UsersLoading,
    Error: UsersError,
    AddUser,
  } = useUsers(Session?.user);

  const {
    Departments,
    Loading: DepartmentsLoading,
    Error: DepartmentsError,
  } = useDepartments();

  const { Settings } = useSettings();

  const { AddTimeSlots } = useTimeSlots();

  const loading = AuthLoading || UsersLoading || DepartmentsLoading;
  const rawError = AuthError || UsersError || DepartmentsError || LocalError;
  const error = rawError ? simplifyErrorMessage(rawError) : "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return false;

    // Validate that a department has been selected
    if (isNaN(Input.department_id)) {
      setLocalError("Please select a department.");
      return false;
    }

    // Validate that all required fields are filled
    if (
      !Input.displayname.trim() ||
      !Input.email.trim() ||
      !Input.password.trim()
    ) {
      setLocalError("Please fill in all required fields.");
      return false;
    }

    setIsSubmitting(true);

    const SignUpData = await SignUp(
      Input.email,
      Input.password,
      Input.displayname,
      Input.isSupervisor,
      Input.department_id,
    );

    if (!SignUpData?.user) {
      setIsSubmitting(false);
      setLocalError("Failed to create account. Please try again.");
      return false;
    }

    const UserId = SignUpData.user.id;

    const newUser: NewUser = {
      id: UserId,
      email: Input.email,
      display_name: Input.displayname,
      role: Input.isSupervisor ? "admin" : "workstudy",
      department_id: Input.department_id,
    };

    const Insert_confirmed = await AddUser(newUser);
    if (!Insert_confirmed) {
      setIsSubmitting(false);
      setLocalError("Failed to insert user.");
      return false;
    }

    // Insert time slots for the created user (if any)
    if (Input.time_slots && Input.time_slots.length > 0) {
      const slotInserts = Input.time_slots.map((s) => ({
        userId: UserId,
        Weekday: s.Weekday,
        start_time: s.start_time,
        end_time: s.end_time,
      }));

      const slotsOk = await AddTimeSlots(slotInserts as any);

      if (!slotsOk) {
        setIsSubmitting(false);
        setLocalError("Failed to insert time slots.");
        return false;
      }
    }

    setIsSubmitting(false);
    setInput(InitialValue);
    return true;
  }

  function updateFields(fields: Partial<UserInput>) {
    setInput((prev) => ({ ...prev, ...fields }));
  }

  if (error) {
    return <ErrorCard error={error} />;
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

  if (Session.user.user_metadata.role !== "admin") {
    return (
      <div className='flex items-center justify-center h-[60vh]'>
        <div className='card p-6 text-center'>
          <h2 className='text-lg font-semibold mb-2'>Access Denied</h2>
          <p className='mb-4'>
            You do not have permission to access this page.
          </p>
          <div className='flex gap-3 justify-center'>
            <Button variant='outline' onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </div>
        </div>
      </div>
    );
  }

  async function handleDelete(id: User["id"]) {
    const ok = await DeleteUser(id);

    if (!ok) {
      setLocalError("Failed to remove user. Please try again.");
    }
  }

  function handleExport() {
    const exportData_formatted = Users.map((user) => ({
      Name: user.display_name,
      Email: user.email,
      Role: user.role,
      Department:
        Departments.find((d) => d.id === user.department_id)?.name || "—",
      "Created At": formatDate(user.created_at),
    }));

    exportData(
      exportData_formatted,
      Settings.exportFormat,
      "Support Center Staff",
    );
  }

  return (
    <>
      <div className='page-header'>
        <Breadcrumbs />
        <div className='flex justify-between items-start'>
          <div>
            <h1 className='page-title'>Support Center Staff Management</h1>
            <p className='page-desc'>Manage Support Center Staff accounts.</p>
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
        mode='user'
        loading={loading}
        updateFields={updateFields}
        handleUserSubmit={handleSubmit}
        userInput={Input}
        Departments={Departments}
        formError={error}
      />

      <LoadingModal
        open={isSubmitting}
        message={`Adding ${Input.displayname || "user"}...`}
      />

      <div className='mt-8'>
        <h2 className='text-xl text-(--navy) mb-4 font-serif font-semibold'>
          Active WorkStudy Accounts
        </h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center'></TableHead>
              <TableHead className='text-center'>Name</TableHead>
              <TableHead className='text-center'>Email</TableHead>
              <TableHead className='text-center'>Role</TableHead>
              <TableHead className='text-center'>Department</TableHead>
              <TableHead className='text-center'>Time Slots</TableHead>
              <TableHead className='text-center'>Added At</TableHead>
              <TableHead className='text-center'>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Users.length > 0 ? (
              Users.map((user, index) => {
                return (
                  <TableRow key={user.id}>
                    <TableHead className='text-center'>{index + 1}</TableHead>
                    <TableCell className='text-center'>
                      {user.display_name}
                    </TableCell>
                    <TableCell className='text-center'>{user.email}</TableCell>
                    <TableCell className='text-center'>
                      {titleCase(user.role)}
                    </TableCell>
                    <TableCell className='text-center'>
                      {Departments.find(
                        (department) => department.id === user.department_id,
                      )?.name || "—"}
                    </TableCell>
                    <TableCell>
                      <TimeSlotsMenu userId={user.id} />
                    </TableCell>
                    <TableCell className='text-center'>
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild className='cursor-pointer'>
                          <Button variant='secondary'>
                            <MoreHorizontalIcon />
                            <span className='sr-only'>Open Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align='center'
                          className='focus:bg-none w-full'
                        >
                          {user.role === "admin" ? (
                            <DropdownMenuItem>
                              No actions available for admin accounts
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem variant='destructive'>
                              <Button
                                variant='destructive'
                                onClick={() => handleDelete(user.id)}
                              >
                                Remove
                              </Button>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className='text-center text-muted'>
                  No workstudy accounts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
