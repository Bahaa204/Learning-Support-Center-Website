import { Spinner } from "./ui/spinner";

type LoadingCardProps = {
  message?: string;
  className?: string;
};

export default function LoadingCard({
  message,
  className = "",
}: LoadingCardProps) {
  return (
    <div
      className={`flex min-h-screen w-full justify-center items-center gap-5 text-xl ${className}`}
    >
      <Spinner className="size-7" />
      {message || "Loading"}...
    </div>
  );
}
