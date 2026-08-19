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
import { FilterIcon, LightbulbIcon, MoreHorizontalIcon } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import ErrorCard from "@/components/error-card";
import LoadingCard from "@/components/loading-card";
import { titleCase } from "title-case";
import { TimeSlotsMenu } from "@/components/TimeSlotMenu";
import { SetErrorMessage } from "@/helper/errorhelpers";
import { validateUserInput } from "@/helper/validation";
import { FilterModal } from "@/components/FilterModal";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Modal from "@/components/Modal";

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
  const [IsSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [IsFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [DeletedUser, setDeletedUser] = useState<User | null>(null);

  const [SearchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

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
    AddUser,
    Error: UsersError,
  } = useUsers(Session?.user);

  const {
    Departments,
    Loading: DepartmentsLoading,
    Error: DepartmentsError,
  } = useDepartments();

  const { Settings } = useSettings();

  const {
    AddBulkTimeSlots,
    Loading: TimeSlotsLoading,
    Error: TimeSlotsError,
  } = useTimeSlots();

  const loading =
    AuthLoading || UsersLoading || DepartmentsLoading || TimeSlotsLoading;

  const error = AuthError || UsersError || DepartmentsError || TimeSlotsError;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || IsSubmitting) return false;
    setIsSubmitting(true);

    const validationmessage = validateUserInput(Input);

    if (validationmessage) {
      setLocalError(validationmessage);
      setIsSubmitting(false);
      return false;
    }

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

    await AddUser(newUser, {
      onError: () => {
        setIsSubmitting(false);
        setLocalError("Failed to create account. Please try again.");
      },
      onSuccess: async () => {
        const slotInserts = Input.time_slots.map((s) => ({
          userId: UserId,
          Weekday: s.Weekday,
          start_time: s.start_time,
          end_time: s.end_time,
        }));

        await AddBulkTimeSlots(slotInserts, {
          onError: () => {
            setIsSubmitting(false);
            setLocalError("Failed to insert time slots.");
          },
        });

        setIsSubmitting(false);
        setInput(InitialValue);
      },
    });

    return true;
  }

  function updateFields(fields: Partial<UserInput>) {
    setInput((prev) => ({ ...prev, ...fields }));
  }

  if (error) {
    return <ErrorCard message={SetErrorMessage(error)} />;
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

  if (Session.user.user_metadata.role !== "admin")
    return (
      <ErrorCard
        message='You do not have permission to view this page.'
        actionLabel='Go to Home'
        onAction={() => navigate("/")}
      />
    );

  const data = Users && Departments;

  if (!data) return <ErrorCard message='Failed to load required data.' />;

  const IsFilterActive = SearchParams.toString() !== "";

  const filteredUsers = IsFilterActive
    ? Users.filter((user) => {
        const nameFilter = SearchParams.get("name");
        const emailFilter = SearchParams.get("email");
        const roleFilter = SearchParams.get("role");
        const departmentFilter = SearchParams.get("department_id");
        const dateFilter = SearchParams.get("date");
        // const timeSlotsFilter = SearchParams.get("time_slots");

        const selectedDate = dateFilter ? new Date(dateFilter) : null;
        const createdDate = user.created_at ? new Date(user.created_at) : null;
        const isDateMatch =
          !selectedDate ||
          !createdDate ||
          (createdDate.getFullYear() === selectedDate.getFullYear() &&
            createdDate.getMonth() === selectedDate.getMonth() &&
            createdDate.getDate() === selectedDate.getDate());

        return (
          (!nameFilter || user.display_name.includes(nameFilter)) &&
          (!emailFilter || user.email?.includes(emailFilter)) &&
          (!roleFilter || user.role === roleFilter) &&
          (!departmentFilter ||
            user.department_id === parseInt(departmentFilter)) &&
          isDateMatch
        );
      })
    : Users;

  async function handleDelete(id: User["id"]) {
    const ok = await DeleteUser(id);

    if (!ok) {
      setLocalError("Failed to remove user. Please try again.");
    }
  }

  function handleExport() {
    const exportData_formatted = filteredUsers.map((user) => ({
      Name: user.display_name,
      Email: user.email,
      Role: user.role,
      Department:
        Departments!.find((d) => d.id === user.department_id)?.name || "—",
      "Created At": formatDate(user.created_at),
    }));

    exportData(
      exportData_formatted,
      Settings.exportFormat,
      "Support Center Staff",
    );
  }

  function RowActions({
    user,
    menu_item,
  }: {
    user: User;
    menu_item: "context" | "dropdown";
  }) {
    const MenuItemElement =
      menu_item === "context" ? ContextMenuItem : DropdownMenuItem;

    return (
      <>
        {user.role === "admin" ? (
          <MenuItemElement>
            No actions available for admin accounts
          </MenuItemElement>
        ) : (
          <MenuItemElement
            variant='destructive'
            className='cursor-pointer text-[16px] text-primary'
            onClick={() => setDeletedUser(user)}
          >
            Remove
          </MenuItemElement>
        )}
      </>
    );
  }

  return (
    <>
      <div className='page-header'>
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
        isSubmitting={loading}
        updateFields={updateFields}
        handleUserSubmit={handleSubmit}
        userInput={Input}
        Departments={Departments}
        formError={LocalError}
      />

      <div className='p-5 flex flex-col gap-4'>
        <h2 className='text-xl text-(--navy) mb-4 font-serif font-semibold flex '>
          Active WorkStudy Accounts
          <div className='flex gap-2 mt-2 ml-auto font-[georgia]'>
            <Button
              className='text-lg btn-primary'
              onClick={() => setIsFilterOpen(true)}
            >
              <FilterIcon className='size-5!' /> Filter Records
            </Button>
          </div>
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
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => {
                return (
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <TableRow key={user.id}>
                        <TableHead className='text-center'>
                          {index + 1}
                        </TableHead>
                        <TableCell className='text-center'>
                          {user.display_name}
                        </TableCell>
                        <TableCell className='text-center'>
                          {user.email}
                        </TableCell>
                        <TableCell className='text-center'>
                          {titleCase(user.role)}
                        </TableCell>
                        <TableCell className='text-center'>
                          {Departments.find(
                            (department) =>
                              department.id === user.department_id,
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
                              <RowActions user={user} menu_item='dropdown' />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </ContextMenuTrigger>

                    <ContextMenuContent>
                      <RowActions user={user} menu_item='context' />
                    </ContextMenuContent>
                  </ContextMenu>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} className='text-center text-[17px]'>
                  No student records found. Check your filters or add new
                  student records to see them here.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className='flex items-center justify-center gap-2 text-gray-600/50'>
          <LightbulbIcon /> Tip: Right click (hold on mobile) or click the
          actions button on a row to view some quick actions.
        </div>
      </div>

      <Modal
        Open={DeletedUser !== null}
        setOpen={() => setDeletedUser(null)}
        text={`${DeletedUser?.display_name}`}
        handleDelete={async () => {
          if (!DeletedUser) return;
          return await handleDelete(DeletedUser.id);
        }}
      />

      <FilterModal
        mode='user'
        IsOpen={IsFilterOpen}
        setIsOpen={setIsFilterOpen}
        Departments={Departments}
        SearchParams={SearchParams}
        setSearchParams={setSearchParams}
      />
    </>
  );
}
