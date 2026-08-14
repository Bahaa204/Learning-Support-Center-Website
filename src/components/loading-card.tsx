import { Card, CardHeader, CardTitle } from "./ui/card";
import { Spinner } from "./ui/spinner";

type LoadingCardProps = {
  message?: string;
};

export default function LoadingCard({ message }: LoadingCardProps) {
  return (
    <Card className='flex min-h-screen w-full justify-center ring-0! shadow-none! bg-transparent!'>
      <CardHeader className='bg-none!'>
        <CardTitle className='flex justify-center items-center gap-5 w-full text-xl'>
          <Spinner className='size-7' />
          {message || "Loading"}...
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
