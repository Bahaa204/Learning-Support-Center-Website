export default function Login() {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-sm p-4" style={{ width: "350px" }}>
        <h2 className="text-center mb-4">Login</h2>

        <form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>

          {/* Optional links */}
          <div className="mt-3 text-center">
            <a href="#" className="text-decoration-none">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
