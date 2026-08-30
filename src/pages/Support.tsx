import LoadingCard from "@/components/loading-card";
import NavigateToLogin from "@/components/NavigateToLogin";
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
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import type { FeedbackInput } from "@/types/Feedback";
import { useState, type SubmitEvent } from "react";
import { titleCase } from "title-case";

type SupportProps = {
  type: "feedback" | "report";
};

export default function Support({ type }: SupportProps) {
  useDocumentTitle("Feedback");

  const { Session, Loading: AuthLoading, SendEmail } = useAuth();

  const InitialValue: FeedbackInput = {
    message: "",
    subject: "",
  };

  const [FeedbackInput, setFeedbackInput] =
    useState<FeedbackInput>(InitialValue);

  if (AuthLoading) return <LoadingCard message="Checking Authentication..." />;

  if (!Session) return <NavigateToLogin />;

  function updateFields(fields: Partial<FeedbackInput>) {
    setFeedbackInput((prev) => ({ ...prev, ...fields }));
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (AuthLoading || !Session?.user.email) return;

    const subject = `[${type.toUpperCase()}] ${FeedbackInput.subject}`;

    const message = `${titleCase(type)} from ${Session.user.email}:\n\n${FeedbackInput.message}`;

    const ok = await SendEmail(
      "brawass6@gmail.com",
      import.meta.env.VITE_RESEND_SUPPORT_EMAIL,
      subject,
      message,
      Session.user.email,
    );

    if (ok) setFeedbackInput(InitialValue);
  }

  return (
    <>
      <h1 className="page-title">Submit {titleCase(type)}</h1>
      <p className="page-desc">
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
              <FieldLabel htmlFor="subject">Subject</FieldLabel>
              <Input
                id="subject"
                type="text"
                placeholder={`Enter the subject of your ${type}`}
                onChange={(e) => updateFields({ subject: e.target.value })}
                value={FeedbackInput.subject}
                required
              />
              <FieldDescription>
                Please provide a brief and descriptive subject for your {type}.
              </FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="message">Message</FieldLabel>
              <Textarea
                id="message"
                placeholder={`Enter your ${type}`}
                onChange={(e) => updateFields({ message: e.target.value })}
                value={FeedbackInput.message}
                required
              />
              <FieldDescription>
                Please provide a detailed description of your {type}.
              </FieldDescription>
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Button type="submit" className="btn-primary">
              Send {titleCase(type)}
            </Button>
          </FieldGroup>
        </FieldSet>
      </form>
    </>
  );
}
