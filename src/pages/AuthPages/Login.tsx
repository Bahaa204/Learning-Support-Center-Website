import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useState, type SubmitEvent } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMultistepForm } from "@/hooks/useMultistepForm";
import LoginForm from "@/components/Login Forms/LoginForm";
import ResetPasswordForm from "@/components/Login Forms/ResetPasswordForm";
import type { LoginFormData } from "@/types/auth";

export default function Login() {
  useDocumentTitle("Login");

  const InitialValue: LoginFormData = {
    email: "",
    password: "",
    email_sent: false,
  };

  const [LoginFormdata, setLoginFormdata] =
    useState<LoginFormData>(InitialValue);

  const {
    Session,
    Loading: AuthLoading,
    Error: AuthError,
    SignInWithPassword,
    ResetPassword,
  } = useAuth();

  const { step, next, back, isFirstStep } = useMultistepForm([
    <LoginForm
      {...LoginFormdata}
      error={AuthError}
      loading={AuthLoading}
      updateFields={updateFields}
    />,
    <ResetPasswordForm
      {...LoginFormdata}
      loading={AuthLoading}
      updateFields={updateFields}
    />,
  ]);

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isFirstStep)
      return await SignInWithPassword(
        LoginFormdata.email,
        LoginFormdata.password,
      );

    const ok = await ResetPassword(LoginFormdata.email);
    if (ok) return updateFields({ email_sent: true });
  }

  if (Session) {
    return <Navigate to='/' replace />;
  }

  function updateFields(fields: Partial<LoginFormData>) {
    setLoginFormdata((prev) => ({ ...prev, ...fields }));
  }

  return (
    <>
      {/* <div className='login-card-header'>
        <h2>Login</h2>
        <p>Use your Support Center account credentials to continue.</p>
      </div> */}

      <form onSubmit={handleSubmit} className='login-form'>
        {step}
      </form>

      {isFirstStep ? (
        <div className='login-footer-note'>
          Forgot Password?
          <Button type='button' className='p-2' variant='link' onClick={next}>
            reset password
          </Button>
        </div>
      ) : (
        <div className='login-footer-note'>
          Remembered your password?
          <Button type='button' className='p-2' variant='link' onClick={back}>
            login
          </Button>
        </div>
      )}
    </>
  );
}
