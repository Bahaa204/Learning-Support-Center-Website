import BahaaProfile from "/Images/ProfilePicture.jpg";
import Github from "/Images/github.png";
import LinkedIn from "/Images/linkedin.png";

import type { Item, UpdaterFunction } from "@/types/types";
import { Button } from "./ui/button";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
import { ItemAvatar } from "./Icons/ItemAvatar";

type FooterModal = {
  IsOpen: boolean;
  setIsOpen: UpdaterFunction<boolean>;
};

export default function FooterModal({ IsOpen, setIsOpen }: FooterModal) {
  const items: Item[] = [
    {
      name: "Bahaa El Rawass",
      avatar: BahaaProfile,
      actions: [
        {
          name: "Github",
          link: "https://github.com/BahaaRawass",
          icon: Github,
        },
        {
          name: "LinkedIn",
          link: "https://www.linkedin.com/in/bahaa-rawass-0153053b5",
          icon: LinkedIn,
        },
      ],
    },
    {
      name: "Mahdi Dagher",
      //   avatar: MahdiProfile,
      actions: [
        {
          name: "Github",
          link: "https://github.com/mahdidagher",
          icon: Github,
        },
        {
          name: "LinkedIn",
          link: "https://www.linkedin.com/in/mahdidagher" /* Replace this is with the actual LinkedIn profile link */,
          icon: LinkedIn,
        },
      ],
    },
  ];

  return (
    <Dialog
      open={IsOpen}
      as='div'
      className='relative z-9999999 focus:outline-none'
      onClose={() => setIsOpen(false)}
    >
      <div className='fixed inset-0 z-9999999 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-center justify-center p-4'>
          <DialogBackdrop className='fixed inset-0 bg-black/15' />
          <DialogPanel
            transition
            className='w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0'
          >
            <Card className='ring-0!'>
              <CardHeader>
                <CardTitle className='text-2xl'>
                  <DialogTitle>RHU Learning Support Center Website</DialogTitle>
                </CardTitle>
                <CardDescription className='text-[16px]'>
                  Developed & Designed by
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ItemAvatar items={items} />
              </CardContent>
              <CardFooter className='bg-transparent'>
                <CardAction className='size-full'>
                  <Button
                    onClick={() => setIsOpen(false)}
                    className='size-full py-2 text-lg'
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
