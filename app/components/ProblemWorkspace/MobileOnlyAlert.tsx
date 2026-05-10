"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

function useIsMobileSm() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 400px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

export function MobileOnlyAlert() {
  const isMobile = useIsMobileSm();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (isMobile) setOpen(true);
  }, [isMobile]);

  return (
    <div className="sm:hidden">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="">Mobile view</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-800 dark:text-gray-200">
              You can only view the problem description on mobile. Please use a desktop or laptop to access the full experience, including the code editor, run and submit functionality.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="">OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}