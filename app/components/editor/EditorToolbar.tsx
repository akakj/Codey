"use client";

import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tooltip, TooltipProvider, TooltipTrigger, TooltipContent,
} from "@/components/ui/tooltip";
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogFooter, AlertDialogTitle, AlertDialogDescription,
  AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { CircleQuestionMark, RotateCcw, ClockArrowUp } from "lucide-react";
import { LANGS, type Lang, type StarterMap, DISPLAY_NAME } from "@/lib/languages";

export function EditorToolbar({
  lang,
  starters,
  onLangChange,
  onReset,
  canReset,
}: {
  lang: Lang;
  starters: StarterMap;
  onLangChange: (l: Lang) => void;
  onReset: () => void;
  canReset: boolean;
}) {
  return (
    <div className="flex items-center gap-2 border-b bg-muted/30 px-2 py-1">
      {/* Language select */}
      <Select value={lang} onValueChange={(v) => onLangChange(v as Lang)}>
        <SelectTrigger className="hover:cursor-pointer">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {LANGS.map((L) => (
              <SelectItem key={L} value={L} disabled={!starters[L]} className="hover:cursor-pointer">
                {DISPLAY_NAME[L]} {!starters[L] && "(unavailable)"}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* Help tip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 hover:cursor-pointer" aria-label="Editor zoom tip">
              <CircleQuestionMark className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent align="start">
            Tip: Hold <b>⌘/Ctrl</b> and <b>scroll</b> to zoom editor text
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Right side actions */}
      <div className="ml-auto">
        <AlertDialog>
        <TooltipProvider delayDuration={150}>

            <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="hover:cursor-pointer"
                aria-label="Retrieve last submitted code"
              >
                <ClockArrowUp className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              Retrieve last submitted code
            </TooltipContent>
          </Tooltip>

          <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:cursor-pointer"
                    aria-label="Reset to starter code"
                    disabled={!canReset}
                  >
                    <RotateCcw className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                Reset code to default
              </TooltipContent>
            </Tooltip>

            </TooltipProvider>

          <AlertDialogContent className="rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Reset current code to default?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Your current code will be discarded and reset to the default code!
                <br/>This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="hover:cursor-pointer ">Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive/70 text-destructive-foreground hover:bg-destructive/90 hover:cursor-pointer"
                onClick={onReset}
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
