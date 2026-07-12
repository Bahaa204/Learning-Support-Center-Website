import LoadingCard from "@/components/loading-card";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import type { FeedbackInput } from "@/types/Feedback";
import { useState, type SubmitEvent } from "react";
import { Navigate } from "react-router-dom";

export default function Feedback() {
  const { Session, Loading: AuthLoading, SendEmail } = useAuth();

  const InitialValue: FeedbackInput = {
    message: "",
    subject: "",
  };

  const [FeedbackInput, setFeedbackInput] =
    useState<FeedbackInput>(InitialValue);

  if (AuthLoading) return <LoadingCard message='Checking Authentication...' />;

  if (!Session) return <Navigate to='/login' replace />;

  function updateFields(fields: Partial<FeedbackInput>) {
    setFeedbackInput((prev) => ({ ...prev, ...fields }));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (AuthLoading || !Session?.user.email) return;

    const subject = `[FEEDBACK] ${FeedbackInput.subject}`;

    const message = `Feedback from ${Session.user.email}:\n\n${FeedbackInput.message}`;

    const ok = await SendEmail(
      "brawass6@gmail.com",
      "RHU Learning Support Center Support <support@trustedappartmentbridge.app>",
      subject,
      message,
      Session.user.email,
    );

    if (ok) setFeedbackInput(InitialValue);
  }

  return (
    <>
      <h1 className='page-title'>Submit Feedback</h1>
      <p className='page-desc'>
        We value your feedback! Please fill out the form below to share your
        thoughts, suggestions, or concerns.
        <br />
        Your input helps us improve our services and provide a better experience
        for everyone. Thank you for taking the time to share your feedback with
        us.
      </p>

      <form onSubmit={handleSubmit}>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor='subject'>Subject</FieldLabel>
              <Input
                id='subject'
                type='text'
                placeholder='Enter the subject of your feedback'
                onChange={(e) => updateFields({ subject: e.target.value })}
                value={FeedbackInput.subject}
                required
              />
              <FieldDescription>
                Please provide a brief and descriptive subject for your
                feedback.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor='message'>Message</FieldLabel>
              <Textarea
                id='message'
                placeholder='Enter your feedback'
                onChange={(e) => updateFields({ message: e.target.value })}
                value={FeedbackInput.message}
                required
              />
              <FieldDescription>
                Please provide a detailed description of your feedback.
              </FieldDescription>
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Button type='submit'>Send Feedback</Button>
          </FieldGroup>
        </FieldSet>
      </form>
    </>
  );
}
