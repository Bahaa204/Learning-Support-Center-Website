import type { InputFormProps } from "../types/types";
import SpinnerButton from "./SpinnerButton";

export default function InputForm({
  loading,
  Input,
  setInput,
  handleSubmit,
}: InputFormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex flex-column flex-wrap gap-3 justify-content-evenly align-items-center"
      style={{ height: "50vh" }}
    >
      <div className="form-group">
        <label htmlFor="name">Student Name:</label>
        <input
          required
          type="text"
          className="form-control border-2 border-secondary"
          id="name"
          value={Input.name}
          onChange={(event) => {
            setInput((prev) => ({
              ...prev,
              name: event.target.value,
            }));
          }}
        />
      </div>
      <div className="form-group">
        <label htmlFor="id">Student ID</label>
        <input
          required
          type="number"
          id="id"
          className="form-control border-2 border-secondary"
          value={isNaN(Input.id) ? "" : Input.id}
          onChange={(event) => {
            setInput((prev) => ({
              ...prev,
              id: parseInt(event.target.value.trim()) || NaN,
            }));
          }}
        />
      </div>
      {loading ? (
        <SpinnerButton />
      ) : (
        <button type="submit" className="btn btn-dark" disabled={loading}>
          Submit
        </button>
      )}
    </form>
  );
}
