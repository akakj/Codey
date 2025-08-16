import { ReactNode } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

function ProblemLayout({ children }: { children: ReactNode }) {
  return (
    <div>
        <header className =""></header>
        <main>{children}</main>
    </div>
  )
}

export default ProblemLayout;