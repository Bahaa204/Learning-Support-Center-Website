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
import { exportData } from "@/lib/exportUtils";
import type { NewUser, User, UserInput } from "@/types/users";
import {
  FilterIcon,
  InfoIcon,
  LightbulbIcon,
  MoreHorizontalIcon,
  UserRoundIcon,
} from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import NavigateToLogin from "@/components/NavigateToLogin";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import FormSection from "@/components/FormSection";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import PasswordInput from "@/components/PasswordInput";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TimeSlots from "@/components/TimeSlots";
import { Spinner } from "@/components/ui/spinner";

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

  const [UserInput, setUserInput] = useState<UserInput>(InitialValue);
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
    // Loading: UsersLoading,
    AddUser,
    Error: UsersError,
  } = useUsers(Session?.user);

  const {
    Departments,
    Loading: DepartmentsLoading,
    Error: DepartmentsError,
  } = useDepartments();

  const { Settings } = useSettings();

  const loading = AuthLoading || DepartmentsLoading;

  const error = AuthError || UsersError || DepartmentsError;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || IsSubmitting) return;
    setIsSubmitting(true);

    const validationmessage = validateUserInput(UserInput);

    if (validationmessage) {
      setLocalError(validationmessage);
      setIsSubmitting(false);
      return;
    }

    const SignUpData = await SignUp(
      UserInput.email,
      UserInput.password,
      UserInput.displayname,
      UserInput.isSupervisor,
      UserInput.department_id,
    );

    if (!SignUpData?.user) {
      setIsSubmitting(false);
      setLocalError("Failed to create account. Please try again.");
      return;
    }

    const UserId = SignUpData.user.id;

    const newUser: NewUser = {
      id: UserId,
      email: UserInput.email,
      display_name: UserInput.displayname,
      role: UserInput.isSupervisor ? "admin" : "workstudy",
      department_id: UserInput.department_id,
      time_slots: UserInput.time_slots,
    };

    await AddUser(newUser, {
      onError: () => {
        setIsSubmitting(false);
        setLocalError("Failed to create account. Please try again.");
      },
      onSuccess: () => {
        setIsSubmitting(false);
        setUserInput(InitialValue);
      },
    });
  }

  function updateFields(fields: Partial<UserInput>) {
    setUserInput((prev) => ({ ...prev, ...fields }));
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
    return <NavigateToLogin />;
  }

  if (Session.user.user_metadata.role !== "admin")
    return (
      <ErrorCard
        message="You do not have permission to view this page."
        actionLabel="Go to Home"
        onAction={() => navigate("/")}
      />
    );

  const data = Users && Departments;

  if (!data) return <ErrorCard message="Failed to load required data." />;

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
      Role: user.role === "admin" ? "Supervisor" : user.role,
      Department:
        Departments!.find((d) => d.id === user.department_id)?.name || "—",
      "Created At": formatDate(user.created_at),
      "Time Slots": user.time_slots
        .map((slot) => `${slot.weekday}: ${slot.start_time} - ${slot.end_time}`)
        .join(", "),
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
            variant="destructive"
            className="cursor-pointer text-[16px] text-primary"
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
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <UserPlusIcon className="size-8 text-primary" />
              <div>
                <CardTitle>Add New User</CardTitle>
                <CardDescription>
                  Add a new workstudy or supervisor account to the Support
                  Center Staff
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
            <FormSection
              icon={<UserRoundIcon />}
              title={`${UserInput.isSupervisor ? "Supervisor" : "Workstudy"} Account Details`}
            >
              <FieldGroup className="grid grid-cols-2 grid-rows-2">
                <Field>
                  <FieldLabel>
                    Display Name <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      type="text"
                      value={UserInput.displayname}
                      onChange={(event) =>
                        updateFields({ displayname: event.target.value })
                      }
                      placeholder="e.g. John Doe"
                      required
                      aria-invalid={LocalError.includes("Display name")}
                    />
                    <FieldDescription>
                      Enter the{" "}
                      {UserInput.isSupervisor ? "supervisor's" : "workstudy's"}{" "}
                      display name
                      {LocalError.includes("Display name") && (
                        <span className="text-destructive"> Required</span>
                      )}
                    </FieldDescription>
                    {!UserInput.displayname && (
                      <span className="text-destructive"> Required</span>
                    )}
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>
                    Email <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <Input
                      type="email"
                      value={UserInput.email}
                      onChange={(event) =>
                        updateFields({ email: event.target.value })
                      }
                      placeholder="e.g. john.doe@example.com"
                      required
                      aria-invalid={LocalError.includes("Email")}
                    />
                    <FieldDescription>
                      Enter the{" "}
                      {UserInput.isSupervisor ? "supervisor's" : "workstudy's"}{" "}
                      email address
                      {LocalError.includes("Email") && (
                        <span className="text-destructive"> Required</span>
                      )}
                    </FieldDescription>
                    {!UserInput.email && (
                      <span className="text-destructive"> Required</span>
                    )}
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>
                    Password <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <PasswordInput
                      value={UserInput.password}
                      onChange={(event) =>
                        updateFields({ password: event.target.value })
                      }
                      placeholder="Enter a strong password"
                      required
                      aria-invalid={LocalError.includes("Password")}
                    />
                    <FieldDescription>
                      Enter a strong password for the{" "}
                      {UserInput.isSupervisor ? "supervisor's" : "workstudy's"}{" "}
                      account
                      {LocalError.includes("Password") && (
                        <span className="text-destructive"> Required</span>
                      )}
                    </FieldDescription>
                    {!UserInput.password && (
                      <span className="text-destructive"> Required</span>
                    )}
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>
                    Department <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <Select
                      value={
                        UserInput.department_id
                          ? String(UserInput.department_id)
                          : undefined
                      }
                      onValueChange={(value) =>
                        updateFields({ department_id: Number(value) })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Departments</SelectLabel>
                          {Departments.map((department) => (
                            <SelectItem
                              key={department.id}
                              value={String(department.id)}
                            >
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FieldDescription>
                      Enter the{" "}
                      {UserInput.isSupervisor ? "supervisor's" : "workstudy's"}{" "}
                      department
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FormSection>
            <FormSection icon={<InfoIcon />} title="Additional Information">
              <FieldGroup className="grid grid-cols-2 grid-rows-1">
                <Field>
                  <FieldLabel>Role</FieldLabel>
                  <FieldContent className="flex flex-row! gap-2 items-center">
                    <Button
                      type="button"
                      className="w-1/2 cursor-pointer"
                      variant={UserInput.isSupervisor ? "default" : "outline"}
                      onClick={() => updateFields({ isSupervisor: true })}
                    >
                      Supervisor
                    </Button>
                    <Button
                      type="button"
                      className="w-1/2 cursor-pointer"
                      variant={UserInput.isSupervisor ? "outline" : "default"}
                      onClick={() => updateFields({ isSupervisor: false })}
                    >
                      WorkStudy
                    </Button>
                  </FieldContent>
                  <FieldDescription>
                    Select the role for the new account.
                    <br /> Supervisors have elevated permissions and can manage
                    workstudy accounts.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel>
                    Time Slots <span className="text-destructive">*</span>
                  </FieldLabel>
                  <FieldContent>
                    <TimeSlots
                      userinput={UserInput}
                      updateFields={updateFields}
                      disabled={IsSubmitting}
                    />
                    <FieldDescription>
                      Select the time slots for the{" "}
                      {UserInput.isSupervisor ? "supervisor" : "workstudy"} to
                      be available. <br />
                      At least one time slot must be selected.
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldGroup>
            </FormSection>
          </CardContent>
          <CardFooter className="justify-end gap-3">
            <Button
              type="reset"
              variant="outline"
              onClick={() => setUserInput(InitialValue)}
            >
              Clear
            </Button>
            <Button type="submit" className="btn-primary">
              {IsSubmitting ? (
                <>
                  <Spinner /> Adding{" "}
                  {UserInput.isSupervisor ? "Supervisor" : "WorkStudy"}
                </>
              ) : UserInput.isSupervisor ? (
                "Add Supervisor"
              ) : (
                "Add WorkStudy"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <div className="page-header">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="page-title">Support Center Staff Management</h1>
            <p className="page-desc">Manage Support Center Staff accounts.</p>
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4">
        <h2 className="text-xl text-(--navy) mb-4 font-serif font-semibold flex ">
          Active WorkStudy Accounts
          <div className="flex gap-2 mt-2 ml-auto font-[georgia]">
            <Button
              className="text-lg btn-primary"
              onClick={() => setIsFilterOpen(true)}
            >
              <FilterIcon className="size-5!" /> Filter Records
            </Button>
          </div>
        </h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center"></TableHead>
              <TableHead className="text-center">Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-center">Role</TableHead>
              <TableHead className="text-center">Department</TableHead>
              <TableHead className="text-center">Time Slots</TableHead>
              <TableHead className="text-center">Added At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => {
                return (
                  <ContextMenu key={user.id}>
                    <ContextMenuTrigger asChild>
                      <TableRow>
                        <TableHead className="text-center">
                          {index + 1}
                        </TableHead>
                        <TableCell className="text-center">
                          {user.display_name}
                        </TableCell>
                        <TableCell className="text-center">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-center">
                          {titleCase(
                            user.role === "admin" ? "Supervisor" : user.role,
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {Departments.find(
                            (department) =>
                              department.id === user.department_id,
                          )?.name || "—"}
                        </TableCell>
                        <TableCell className="flex justify-center items-center">
                          <TimeSlotsMenu timeslots={user.time_slots} />
                        </TableCell>
                        <TableCell className="text-center">
                          {formatDate(user.created_at)}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              className="cursor-pointer"
                            >
                              <Button variant="secondary">
                                <MoreHorizontalIcon />
                                <span className="sr-only">Open Menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="center"
                              className="focus:bg-none w-full"
                            >
                              <RowActions user={user} menu_item="dropdown" />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    </ContextMenuTrigger>

                    <ContextMenuContent>
                      <RowActions user={user} menu_item="context" />
                    </ContextMenuContent>
                  </ContextMenu>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-[17px]">
                  No workstudy found. Check your filters or add new student
                  records to see them here.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex flex-wrap items-center justify-center gap-2 text-gray-600/50">
          <LightbulbIcon /> Tip: Right click (hold on mobile) or click the
          actions button on a row to view some quick actions.
        </div>
      </div>

      <Modal
        Open={DeletedUser !== null}
        setOpen={() => setDeletedUser(null)}
        text={DeletedUser?.display_name}
        IsDestructive
        handleDelete={async () => {
          if (!DeletedUser) return;
          return await handleDelete(DeletedUser.id);
        }}
      />

      <FilterModal
        mode="user"
        IsOpen={IsFilterOpen}
        setIsOpen={setIsFilterOpen}
        Departments={Departments}
        SearchParams={SearchParams}
        setSearchParams={setSearchParams}
      />
    </>
  );
}
