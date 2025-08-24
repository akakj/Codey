import { ReactNode } from 'react';

function ProblemLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header className =""></header>
      <main>{children}</main>
    </div>
  )
}

export default ProblemLayout;