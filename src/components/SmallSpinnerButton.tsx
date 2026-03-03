export default function SmallSpinnerButton() {
  return (
    <button
      className="btn btn-sm btn-secondary hover-btn"
      type="button"
      disabled
    >
      <span
        className="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      ></span>
      <span className="visually-hidden">Loading...</span>
    </button>
  );
}
