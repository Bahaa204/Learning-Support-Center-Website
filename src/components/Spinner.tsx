import type { SpinnerProps } from "../types/types";

export default function Spinner({ text }: SpinnerProps) {
  return (
    <div className="d-flex align-items-center">
      <div
        className="spinner-border ms-auto"
        role="status"
        aria-hidden="true"
      ></div>
      <strong>{text}. Please Wait...</strong>
    </div>
  );
}
