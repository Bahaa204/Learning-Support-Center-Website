import type { CustomError } from "@/types/types";
import PasswordInput from "../PasswordInput";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { SetErrorMessage } from "@/helper/errorhelpers";
import { Spinner } from "../ui/spinner";

type LoginFormData = {
  email: string;
  password: string;
};

type LoginFormProps = LoginFormData & {
  loading: boolean;
  error: CustomError | null;
  updateFields: (fields: Partial<LoginFormData>) => void;
};

export default function LoginForm({
  email,
  password,
  loading,
  error,
  updateFields,
}: LoginFormProps) {
  return (
    <FieldSet>
      <Field className='login-field'>
        <FieldLabel htmlFor='email'>Email</FieldLabel>
        <Input
          required
          type='email'
          id='email'
          className='login-input'
          placeholder='Enter your Support Center email'
          value={email}
          onChange={(event) => updateFields({ email: event.target.value })}
          aria-invalid={Boolean(error)}
        />
        {error && <FieldError>{SetErrorMessage(error)}</FieldError>}
      </Field>
      <Field className='login-field'>
        <FieldLabel htmlFor='password'>Password</FieldLabel>
        <PasswordInput
          required
          id='password'
          className='login-input login-password-input'
          placeholder='Enter your password'
          value={password}
          onChange={(event) => updateFields({ password: event.target.value })}
          aria-invalid={Boolean(error)}
        />
        {error && <FieldError>{SetErrorMessage(error)}</FieldError>}
      </Field>
      <Field>
        <Button
          type='submit'
          className='login-submit btn btn-primary'
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner /> Loading...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </Field>
    </FieldSet>
  );
}
