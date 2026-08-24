import PasswordInput from "@/components/PasswordInput";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { SetErrorMessage } from "@/helper/errorhelpers";
import { useAuth } from "@/hooks/useAuth";
import type { ResetPasswordInput } from "@/types/auth";
import { useState, type SubmitEvent } from "react";
import { Navigate } from "react-router-dom";

export default function ResetPassword() {
  const {
    Session,
    Loading: AuthLoading,
    Error: AuthError,
    UpdatePassword,
  } = useAuth();

  const InitialValue: ResetPasswordInput = {
    password: "",
    confirm_password: "",
  };

  const [ResetPasswordInput, setResetPasswordInput] =
    useState<ResetPasswordInput>(InitialValue);

  const [ErrorMessage, setErrorMessage] = useState<string>("");

  function updateFields(fields: Partial<ResetPasswordInput>) {
    setResetPasswordInput((prev) => {
      return { ...prev, ...fields };
    });
  }

  if (Session) return <Navigate to='/' />;

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (AuthLoading) return;

    if (ResetPasswordInput.password !== ResetPasswordInput.confirm_password)
      return setErrorMessage("Passwords do not match");

    const ok = await UpdatePassword(ResetPasswordInput.password);
    if (!ok) return setErrorMessage("Failed to update password");
    setErrorMessage("");
  }

  const error = (AuthError && SetErrorMessage(AuthError)) || ErrorMessage;

  return (
    <div className='login-card'>
      <div className='login-card-header'>
        <h2>Reset Password</h2>
        <p>Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit} className='login-form'>
        <FieldSet>
          <Field className='login-field'>
            <FieldLabel htmlFor='email'>Password</FieldLabel>
            <PasswordInput
              required
              id='password'
              className='login-input'
              placeholder='Enter your new password'
              value={ResetPasswordInput.password}
              onChange={(event) =>
                updateFields({ password: event.target.value })
              }
              aria-invalid={Boolean(AuthError)}
            />
            {error && <FieldError>{error}</FieldError>}
          </Field>
          <Field className='login-field'>
            <FieldLabel htmlFor='confirm_password'>Confirm Password</FieldLabel>
            <PasswordInput
              required
              id='confirm_password'
              className='login-input login-password-input'
              placeholder='Confirm your new password'
              value={ResetPasswordInput.confirm_password}
              onChange={(event) =>
                updateFields({ confirm_password: event.target.value })
              }
              aria-invalid={Boolean(AuthError)}
            />
            {error && <FieldError>{error}</FieldError>}
          </Field>
          <Field>
            <Button
              type='submit'
              className='login-submit btn btn-primary'
              disabled={AuthLoading}
            >
              {AuthLoading ? (
                <>
                  <Spinner /> Loading...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </Field>
        </FieldSet>
      </form>
    </div>
  );
}
