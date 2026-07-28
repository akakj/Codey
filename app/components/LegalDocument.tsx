import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type LegalDocumentProps = {
  content: string;
};

export function LegalDocument({ content }: LegalDocumentProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <article
          className="
            prose prose-neutral max-w-none dark:prose-invert
            prose-headings:font-semibold prose-headings:tracking-tight
            prose-h1:mb-3 prose-h1:text-3xl sm:prose-h1:text-4xl
            prose-h2:mt-10 prose-h2:border-b prose-h2:border-border
            prose-h2:pb-2 prose-h2:text-xl
            prose-p:leading-7
            prose-li:my-1
            prose-strong:text-foreground
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          "
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}