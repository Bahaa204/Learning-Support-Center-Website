import { AlertTriangleIcon, LogOutIcon, TrashIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "../ui/field";
import { useState } from "react";
import Modal from "../Modal";

type DangerZoneProps = {
  LogOut: () => Promise<boolean>;
  DeleteAccount: () => Promise<void>;
};

export default function DangerZone({ LogOut, DeleteAccount }: DangerZoneProps) {
  const [IsOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Card className='settings-section bg-destructive/20!' id='danger-zone'>
        <CardHeader className='settings-section-title flex items-center gap-4 pl-0'>
          <AlertTriangleIcon size={50} className='text-destructive' />
          <div className='flex flex-col'>
            <CardTitle className='font-extrabold text-[1.25rem] text-destructive'>
              Danger Zone
            </CardTitle>
            <CardDescription>
              This section contains actions that can have serious consequences.
              Please proceed with caution and ensure you understand the
              implications of each action before proceeding.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel className='text-(--navy) text-[1.2rem] font-bold'>
                Log Out of All Devices
              </FieldLabel>
              <FieldDescription className='text-[0.875rem]'>
                Log out of your account on all devices. This action will require
                you to log in again on each device.
              </FieldDescription>
              <Button variant='destructive' onClick={LogOut}>
                <LogOutIcon /> Log Out of All Devices
              </Button>
            </Field>
            <Field>
              <FieldLabel className='text-(--navy) text-[1.2rem] font-bold'>
                Delete Account
              </FieldLabel>
              <FieldDescription className='text-[0.875rem]'>
                Delete your account and all associated data. This action cannot
                be undone.
              </FieldDescription>
              <Button variant='destructive' onClick={() => setIsOpen(true)}>
                <TrashIcon /> Delete Account
              </Button>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>

      <Modal
        Open={IsOpen}
        setOpen={setIsOpen}
        text='your Account'
        handleDelete={DeleteAccount}
      />
    </>
  );
}
