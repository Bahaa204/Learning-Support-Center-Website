import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { KeyRoundIcon, MailIcon, User2Icon } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

export default function AuthHome() {
  useDocumentTitle("Authentication");

  const { Session, SignInWithPasskey } = useAuth();

  if (Session) return <Navigate to='/' />;

  return (
    // <div className='login-card'>
      // <div className='login-card-header'>
      //   <h2>Welcome to the Learning Support Center</h2>
      //   <p>Choose which option to login with.</p>
      // </div>
      <div className='flex flex-col justify-evenly items-center lg:gap-0 gap-4 w-full h-1/2'>
        <Button className='btn-primary w-full text-[16px]'>
          <Link
            to='/auth/login'
            className='flex  items-center justify-center gap-2'
          >
            <MailIcon size={16} /> Sign in with Email
          </Link>
        </Button>
        <Button
          className='btn-primary w-full text-[16px]'
          onClick={SignInWithPasskey}
        >
          <KeyRoundIcon size={16} /> Continue With Passkey
          {/* <span className='text-[13px] text-muted'>(coming soon)</span> */}
        </Button>
        <Button className='btn-primary w-full text-[16px]' disabled>
          <User2Icon size={16} /> Continue as guest
          <span className='text-[13px] text-muted'>(coming soon)</span>
        </Button>
      </div>
    // </div>
  );
}
