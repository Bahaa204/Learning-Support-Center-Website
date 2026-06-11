import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function NotFound() {
  useDocumentTitle("Not Found");
  const nav = useNavigate();

  return (
    <div>
      <div className='page-header'>
        <h1 className='page-title'>Page Not Found</h1>
        <p className='page-desc'>We couldn't find the page you requested.</p>
      </div>

      <div className='flex items-center justify-center h-[60vh]'>
        <div className='card text-center p-8'>
          <p className='mb-4'>The page you are looking for doesn't exist.</p>
          <div className='flex gap-3 justify-center'>
            <Button onClick={() => nav(-1)} variant='outline'>
              Go Back
            </Button>
            <Button onClick={() => nav("/")}>Go Home</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
