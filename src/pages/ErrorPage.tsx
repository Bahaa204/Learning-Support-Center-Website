import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import ErrorCard from "@/components/error-card";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { SetErrorMessage } from "@/helper/errorhelpers";

export default function ErrorPage() {
  useDocumentTitle("Error");
  const error = useRouteError();

  const errorMessage = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : SetErrorMessage(error as any);

  return (
    <div>
      <div className='page-header'>
        <h1 className='page-title'>Something went wrong</h1>
        <p className='page-desc'>An unexpected error occurred.</p>
      </div>

      <ErrorCard
        message={errorMessage}
        title='Route Error'
        actionLabel='Reload'
        onAction={() => window.location.reload()}
      />
    </div>
  );
}
