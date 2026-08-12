import { Spinner } from "./ui/spinner";

type LoadingCardProps = {
  message?: string;
};

export default function LoadingCard({ message }: LoadingCardProps) {
  return (
    <div className='flex min-h-screen w-full justify-center items-center gap-5 text-xl'>
      <Spinner className='size-7' />
      {message || "Loading..."}
    </div>
  );
}
