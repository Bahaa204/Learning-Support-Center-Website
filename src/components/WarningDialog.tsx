import type { UpdaterFunction } from "@/types/types";
import { Button } from "./ui/button";

import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { AlertTriangleIcon } from "lucide-react";
import { Link } from "react-router-dom";

type WarningDialogProps = {
  IsOpen: boolean;
  setIsOpen: UpdaterFunction<boolean>;
};

export default function WarningDialog({
  IsOpen,
  setIsOpen,
}: WarningDialogProps) {
  function onClose() {
    setIsOpen(false);
  }

  return (
    <Dialog
      open={IsOpen}
      as='div'
      className='relative z-9999999 focus:outline-none'
      onClose={onClose}
    >
      <div className='fixed inset-0 z-9999999 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-center justify-center p-4'>
          <DialogBackdrop className='fixed inset-0 bg-black/15' />
          <DialogPanel
            transition
            className='w-full max-w-lg rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0'
          >
            <Card className='ring-0!'>
              <CardHeader>
                <CardTitle className='text-3xl'>
                  <DialogTitle className='flex justify-center items-center gap-2 text-yellow-400'>
                    <AlertTriangleIcon size={40} /> Still in Development
                  </DialogTitle>
                </CardTitle>
              </CardHeader>
              <CardContent className='text-[16px]'>
                This site is currently under active development and will
                continue to be expanded and improved over time. You may
                encounter bugs, unexpected behavior, or features that are still
                being refined.
                <br />
                <br />
                If you notice an issue, please report it on the{" "}
                <Link
                  to='/report'
                  className='text-primary underline font-semibold'
                  onClick={onClose}
                >
                  Report
                </Link>{" "}
                page.
                <br />
                <br />
                You can also share your suggestions or feedback through the{" "}
                <Link
                  to='/feedback'
                  className='text-primary underline font-semibold'
                  onClick={onClose}
                >
                  Feedback
                </Link>{" "}
                page to help us improve the site.
                <br />
                <br />
                Thank you for your patience and for helping us make the site
                better.
              </CardContent>
              <CardFooter className='bg-transparent'>
                <CardAction className='size-full'>
                  <Button onClick={onClose} className='size-full py-2 text-lg'>
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
