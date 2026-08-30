import type { FilterInput, UpdaterFunction } from "@/types/types";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import type { SetURLSearchParams } from "react-router-dom";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "./ui/field";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useState } from "react";
import type { Department } from "@/types/department";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DateTimePicker } from "./DateTimePicker";
import { Checkbox } from "./ui/checkbox";
import CoursesMenu from "./CoursesMenu";

type FilterModalProps = {
  IsOpen: boolean;
  setIsOpen: UpdaterFunction<boolean>;
  SearchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  Departments: Department[];
  mode: "student" | "user";
};

export function FilterModal({
  IsOpen,
  setIsOpen,
  SearchParams,
  setSearchParams,
  Departments,
  mode,
}: FilterModalProps) {
  const isStudent = mode === "student";

  const initial_value: FilterInput = {
    name: SearchParams.get("name") || "",
    email: SearchParams.get("email") || "",
    department_id: Number(SearchParams.get("department_id")) || null,
    date: SearchParams.get("date") || "",
    asked_about:
      SearchParams.get("asked_about")?.split(",").filter(Boolean) || [],
    role: Boolean(SearchParams.get("role")),
    time_slots:
      SearchParams.get("time_slots")?.split(",").filter(Boolean) || [],
  };

  const [FilterInput, setFilterInput] = useState<FilterInput>(initial_value);

  function updateFields(feilds: Partial<FilterInput>) {
    setFilterInput((prev) => ({ ...prev, ...feilds }));
  }

  function handleFilter() {
    const filters: Record<string, string> = {};

    if (FilterInput.name) filters.name = FilterInput.name;
    if (FilterInput.email) filters.email = FilterInput.email;
    if (FilterInput.department_id !== null)
      filters.department_id = String(FilterInput.department_id);
    if (FilterInput.date) filters.date = FilterInput.date;
    if (FilterInput.asked_about.length > 0)
      filters.asked_about = FilterInput.asked_about.join(",");
    if (FilterInput.role) filters.role = "admin";
    // if (FilterInput.time_slots.length > 0) filters.time_slots = FilterInput.time_slots.join(",");

    setSearchParams(filters);

    setIsOpen(false);
  }

  return (
    <Dialog
      open={IsOpen}
      as='div'
      className='relative z-300 focus:outline-none'
      onClose={() => setIsOpen(false)}
    >
      <div className='fixed inset-0 z-300 w-full! overflow-y-auto'>
        <div className='flex min-h-full items-center justify-center p-4'>
          <DialogBackdrop className='fixed inset-0 bg-black/15' />
          <DialogPanel
            transition
            className='w-full max-w-3xl  rounded-xl bg-white dark:bg-card p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0'
          >
            <Card className='ring-0!'>
              <CardHeader>
                <CardTitle className='text-2xl'>
                  <DialogTitle>
                    {isStudent ? "Filter Students" : "Filter Users"}
                  </DialogTitle>
                </CardTitle>
                <CardDescription className='text-[16px]'>
                  Filter the {isStudent ? "student" : "user"} records based on
                  the criteria you specify below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-[repeat(2,1fr)] gap-4'>
                  <FieldSet className='col-[1/1] row-[1/1]'>
                    <FieldGroup>
                      <Field>
                        <Label htmlFor='name'>Name:</Label>
                        <Input
                          id='name'
                          type='text'
                          placeholder='ex. John Doe'
                          value={FilterInput.name}
                          onChange={(event) =>
                            updateFields({ name: event.target.value })
                          }
                        />
                        <FieldDescription>
                          Shows the {isStudent ? "student" : "user"} records
                          that includes the name you entered.
                        </FieldDescription>
                      </Field>
                      <Field>
                        <Label htmlFor='email'>Email:</Label>
                        <Input
                          id='email'
                          type='email'
                          placeholder='ex. johndoe@example.com'
                          value={FilterInput.email}
                          onChange={(event) =>
                            updateFields({ email: event.target.value })
                          }
                        />
                        <FieldDescription>
                          Shows the {isStudent ? "student" : "user"} records
                          that includes the email you entered.
                        </FieldDescription>
                      </Field>
                      <Field>
                        <Label htmlFor='filterDepartment'>Department:</Label>
                        <Select
                          value={
                            FilterInput.department_id
                              ? String(FilterInput.department_id)
                              : undefined
                          }
                          onValueChange={(value) =>
                            updateFields({
                              department_id: parseInt(value) || null,
                            })
                          }
                        >
                          <SelectTrigger id='filterDepartment'>
                            <SelectValue placeholder='Select a department' />
                          </SelectTrigger>
                          <SelectContent className='z-301'>
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
                            <SelectGroup>
                              <SelectLabel>Clear Selection</SelectLabel>
                              <SelectItem value=''>None</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FieldDescription>
                          Shows the {isStudent ? "student" : "user"} records
                          that includes the department you selected.
                        </FieldDescription>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                  <FieldSet className='col-[2/2] row-[1/1]'>
                    <FieldGroup>
                      <Field className='field'>
                        <Label htmlFor='date'>Date:</Label>
                        <div className='flex items-start gap-2'>
                          <div className='flex-1'>
                            <DateTimePicker
                              value={FilterInput.date}
                              onChange={(visitDateTime: string) =>
                                setFilterInput({
                                  ...FilterInput,
                                  date: visitDateTime,
                                })
                              }
                            />
                          </div>
                          <Button
                            type='button'
                            variant='outline'
                            onClick={() => updateFields({ date: "" })}
                            className='mt-8 h-10'
                            disabled={!FilterInput.date}
                          >
                            Clear
                          </Button>
                        </div>
                        <FieldDescription>
                          Shows the student records that includes the date you
                          entered.
                        </FieldDescription>
                      </Field>
                    </FieldGroup>
                    {isStudent && (
                      <FieldGroup>
                        <Field>
                          <Label htmlFor='asked_about'>Asked About:</Label>
                          <CoursesMenu
                            selectedCourseCodes={FilterInput.asked_about}
                            onSelectionChange={(askedCourses) =>
                              updateFields({ asked_about: askedCourses })
                            }
                            buttonLabel='Open Courses Menu'
                          />
                          <FieldDescription>
                            Shows the student records that includes the courses
                            you entered.
                          </FieldDescription>
                        </Field>
                      </FieldGroup>
                    )}
                    {!isStudent && (
                      <>
                        <FieldGroup>
                          <Field orientation='horizontal'>
                            <Checkbox
                              id='filterRole'
                              name='filterRole'
                              className='cursor-pointer rounded-[5px]! size-6!'
                              checked={FilterInput.role}
                              onCheckedChange={(checked) =>
                                updateFields({ role: Boolean(checked) })
                              }
                            />
                            <FieldContent>
                              <FieldLabel
                                htmlFor='filterRole'
                                className='cursor-pointer'
                              >
                                Is Supervisor
                              </FieldLabel>
                              <FieldDescription>
                                Shows only admin users.
                              </FieldDescription>
                            </FieldContent>
                          </Field>
                        </FieldGroup>
                      </>
                    )}
                  </FieldSet>
                </div>
              </CardContent>
              <CardFooter className='bg-transparent'>
                <CardAction className='size-full flex justify-center items-center gap-5'>
                  <Button
                    onClick={handleFilter}
                    className=' size-1/2 py-2 text-lg'
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant='destructive'
                    onClick={() => setIsOpen(false)}
                    className=' size-1/2 py-2 text-lg'
                  >
                    Close
                  </Button>
                </CardAction>
              </CardFooter>
            </Card>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
