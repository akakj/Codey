export default async function ErrorPage({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const params = await searchParams
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
     <div className="w-full max-w-sm">
       <div className="flex flex-col gap-4">
             <h1 className="text-2xl">Sorry, something went wrong.</h1>
            {params?.error ? (
              <p className="text-md text-muted-foreground">Code error: {params.error}</p>
             ) : (
               <p className="text-md text-muted-foreground">An unspecified error occurred.</p>
             )}
      </div>
     </div>
    </div>
  )
}