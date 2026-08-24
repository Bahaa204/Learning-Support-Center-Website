import { Button } from "../ui/button";
import { Field, FieldLabel, FieldLegend, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

type ResetPasswordFormData = {
  email: string;
  email_sent: boolean;
};

type ResetPasswordFormProps = ResetPasswordFormData & {
  loading: boolean;
  updateFields: (fields: Partial<ResetPasswordFormData>) => void;
};

export default function ResetPasswordForm({
  email,
  email_sent,
  loading,
  updateFields,
}: ResetPasswordFormProps) {
  return (
    <FieldSet>
      {email_sent && (
        <Field>
          <FieldLegend
            className='rounded-2xl border border-primary bg-emerald-500/30 px-4 py-3 text-slate-900 shadow-sm'
            role='alert'
          >
            <p className='font-semibold text-slate-950'>Email Sent</p>
            <p className='text-sm text-slate-700'>
              We've sent a password reset link to your email address.
            </p>
          </FieldLegend>
        </Field>
      )}
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
        />
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
            "Reset Password"
          )}
        </Button>
      </Field>
    </FieldSet>
  );
}
