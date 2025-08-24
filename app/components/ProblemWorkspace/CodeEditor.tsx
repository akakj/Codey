import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

function CodeEditor() {
  return (
    <div>
      <div className="px-1 bg-muted/10">
        <Select defaultValue="javascript">
      <SelectTrigger className="w-auto">
        <SelectValue placeholder="JavaScript" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="javascript">JavaScript</SelectItem>
          <SelectItem value="python3">Python 3</SelectItem>
          <SelectItem value="csharp">C#</SelectItem>
          <SelectItem value="java">Java</SelectItem>
        </SelectGroup>
      </SelectContent>
      </Select>
      <Separator className = ""/>
      </div>
    </div>
  )
}

export default CodeEditor;
