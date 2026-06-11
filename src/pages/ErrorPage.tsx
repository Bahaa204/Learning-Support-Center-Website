import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import ErrorCard from "@/components/error-card";
import { simplifyErrorMessage } from "@/helper/functions";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function ErrorPage() {
  useDocumentTitle("Error");
  const error = useRouteError();

  const errorMessage = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : simplifyErrorMessage((error as any)?.message || "Unknown error");

  return (
    <div>
      <div className='page-header'>
        <h1 className='page-title'>Something went wrong</h1>
        <p className='page-desc'>An unexpected error occurred.</p>
      </div>

      <ErrorCard
        error={errorMessage}
        title='Route Error'
        actionLabel='Reload'
        onAction={() => window.location.reload()}
      />
    </div>
  );
}
