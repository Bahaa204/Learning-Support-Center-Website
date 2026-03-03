export default function SpinnerButton() {
  return (
    <button className="btn btn-dark" type="button" disabled>
      <span
        className="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      ></span>
      Loading...
    </button>
  );
}
