import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../features/auth/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      await loginUser(formData.email, formData.password);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h2 className="mb-6 text-center text-3xl font-bold text-blue-600">
        Login
      </h2>

      {error && (
        <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full rounded-lg border p-3"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Signing In..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;