import type { UpdaterFunction } from "@/types/types";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { AlertTriangleIcon } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { Button } from "./ui/button";

type ModalProps = {
  Open: boolean;
  setOpen: UpdaterFunction<boolean>;
  text: ReactNode;
} & (
  | {
      IsDestructive: true;
      handleDelete: () => Promise<void>;
      BtnText?: never;
      OnConfirm?: never;
    }
  | {
      IsDestructive?: false;
      handleDelete?: never;
      BtnText: string;
      OnConfirm: (event: MouseEvent<HTMLButtonElement>) => void;
    }
);

export default function Modal({
  Open,
  setOpen,
  text,
  IsDestructive,
  handleDelete,
  BtnText,
  OnConfirm,
}: ModalProps) {
  return (
    <Dialog open={Open} onClose={setOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-slate-900/30 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl outline -outline-offset-1 outline-slate-200 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 sm:mx-0 sm:size-10">
                  <AlertTriangleIcon
                    aria-hidden="true"
                    className="size-6 text-red-600"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-slate-900"
                  >
                    {IsDestructive ? `Delete ${text}` : text}
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-slate-600">
                      {IsDestructive ? (
                        <>
                          Are you sure you want to delete {text}? All of its
                          data will be permanently removed.
                          <strong>This action cannot be undone.</strong>
                        </>
                      ) : (
                        text
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-3 flex gap-4 sm:flex-row-reverse sm:px-6">
              <Button
                type="button"
                onClick={(event) => {
                  if (IsDestructive) handleDelete();
                  else OnConfirm(event);
                  setOpen(false);
                }}
                className={`${!IsDestructive ? "btn-primary" : ""} cursor-pointer p-5!`}
                variant={IsDestructive ? "destructive" : "default"}
              >
                {IsDestructive ? "Delete" : BtnText}
              </Button>
              <Button
                type="button"
                data-autofocus
                autoFocus
                onClick={() => setOpen(false)}
                variant="outline"
                className="cursor-pointer p-5!"
              >
                Cancel
              </Button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
