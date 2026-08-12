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

const MOBILE_ALERT_KEY = "codey-mobile-workspace-alert-seen";

function useIsMobileSm() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");

    const onChange = () => {
      setIsMobile(mq.matches);
    };

    onChange();

    mq.addEventListener("change", onChange);

    return () => {
      mq.removeEventListener("change", onChange);
    };
  }, []);

  return isMobile;
}

export function MobileOnlyAlert() {
  const isMobile = useIsMobileSm();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isMobile) return;

    const hasSeenAlert = localStorage.getItem(MOBILE_ALERT_KEY);

    if (!hasSeenAlert) {
      setOpen(true);
    }
  }, [isMobile]);

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen);

    if (!isOpen) {
      localStorage.setItem(MOBILE_ALERT_KEY, "true");
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="top-[45%]">
        <AlertDialogHeader>
          <AlertDialogTitle>Mobile view</AlertDialogTitle>

          <AlertDialogDescription className="text-gray-800 dark:text-gray-200">
            You can only view the problem description on mobile. Please use a
            desktop or laptop to access the full experience, including the code
            editor, run and submit functionality.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}