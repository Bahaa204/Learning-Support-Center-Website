import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

type ErrorCardProps = {
  message: string;
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function ErrorCard({
  message,
  title = "Something went wrong",
  actionLabel,
  onAction,
}: ErrorCardProps) {
  return (
    <div className='flex items-center justify-center h-[50vh]'>
      <Card className='w-full max-w-xl border-destructive/20 bg-destructive/5 shadow-none ring-1 ring-destructive/10'>
        <CardHeader className='text-center items-center gap-3'>
          <CardTitle className='flex items-center justify-center gap-2 text-destructive text-lg'>
            <AlertTriangle className='size-5' />
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className='text-center flex flex-col items-center gap-4 pb-8'>
          <p className='text-sm text-(--text-muted)'>{message}</p>
          {actionLabel && onAction && (
            <Button variant='destructive' onClick={onAction}>
              {actionLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
