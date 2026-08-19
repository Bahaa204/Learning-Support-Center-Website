import PasswordInput from "@/components/PasswordInput";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import type { LoginInput } from "@/types/auth";
import { useEffect, useState, type SubmitEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import LoadingCard from "@/components/loading-card";
import { SetErrorMessage } from "@/helper/errorhelpers";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  useDocumentTitle("Login");

  useEffect(() => {
    const main = document.querySelector(".main") as HTMLElement | null;
    const footer = document.querySelector(".site-footer") as HTMLElement | null;

    const originalMainPadding = main ? main.style.padding : "";
    const originalMainMarginLeft = main ? main.style.marginLeft : "";
    const originalFooterWidth = footer ? footer.style.width : "";

    if (main) {
    main.style.padding = "0px";
      main.style.marginLeft = "0px";
    }
    if (footer) footer.style.width = "100%";

    return () => {
      if (main) {
        main.style.padding = originalMainPadding;
        main.style.marginLeft = originalMainMarginLeft;
      }
      if (footer) footer.style.width = originalFooterWidth;
    };
  }, []);

  const InitialValue: LoginInput = {
    email: "",
    password: "",
  };

  const [Login, setLogin] = useState<LoginInput>(InitialValue);

  const {
    Session,
    Loading: AuthLoading,
    Error: AuthError,
    SignInWithPassword,
  } = useAuth();

  const navigate = useNavigate();

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const ok = await SignInWithPassword(Login.email, Login.password);

    if (ok) {
      navigate("/");
    }
  }

  if (AuthLoading) {
    return <LoadingCard message='Checking authentication' />;
  }

  if (Session) {
    return <Navigate to='/' replace />;
  }

  function updateFields(fields: Partial<LoginInput>) {
    setLogin((prev) => ({ ...prev, ...fields }));
  }

  return (
    <div className='login-page scrollbar-none'>
      <div className='login-panel'>
        <div className='login-hero'>
          <h1>RHU Learning Support Center</h1>
          <p>
            Sign in to manage student visits, workstudy staff, and support
            records.
          </p>
        </div>

        <div className='login-card'>
          <div className='login-card-header'>
            <h2>Login</h2>
            <p>Use your Support Center account credentials to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className='login-form'>
            <FieldSet>
              <Field className='login-field'>
                <FieldLabel htmlFor='email'>Email</FieldLabel>
                <Input
                  required
                  type='email'
                  id='email'
                  className='login-input'
                  placeholder='Enter your Support Center email'
                  value={Login.email}
                  onChange={(event) =>
                    updateFields({ email: event.target.value })
                  }
                  aria-invalid={Boolean(AuthError)}
                />
                {AuthError && (
                  <FieldError>{SetErrorMessage(AuthError)}</FieldError>
                )}
              </Field>
              <Field className='login-field'>
                <FieldLabel htmlFor='password'>Password</FieldLabel>
                <PasswordInput
                  required
                  id='password'
                  className='login-input login-password-input'
                  placeholder='Enter your password'
                  value={Login.password}
                  onChange={(event) =>
                    updateFields({ password: event.target.value })
                  }
                  aria-invalid={Boolean(AuthError)}
                />
                {AuthError && (
                  <FieldError>{SetErrorMessage(AuthError)}</FieldError>
                )}
              </Field>
              <Field>
                <Button
                  type='submit'
                  className='login-submit btn btn-primary'
                  disabled={AuthLoading}
                >
                  Login
                </Button>
              </Field>
            </FieldSet>
          </form>

          <div className='login-footer-note'>
            Secure access for RHU Learning Center staff.
          </div>
        </div>
      </div>
    </div>
  );
}
