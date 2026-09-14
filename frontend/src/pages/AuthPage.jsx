import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { loginUser, registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const [mode, setMode] = useState("login");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const redirectTo = location.state?.from || "/";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const switchMode = () => {
    setMode((currentMode) =>
      currentMode === "login" ? "register" : "login"
    );

    setFormData({
      name: "",
      email: "",
      password: "",
    });

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (mode === "register") {
        const response = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        setSuccess(
          response.message ||
            "Account created successfully. Please login."
        );

        setMode("login");

        setFormData({
          name: "",
          email: formData.email,
          password: "",
        });
      } else {
        const response = await loginUser({
          email: formData.email,
          password: formData.password,
        });

        login(response);

        navigate(redirectTo, {
          replace: true,
        });
      }
    } catch (requestError) {
      setError(
        requestError.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF6EC] px-4 py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">
        {/* Left section */}
        <div className="hidden bg-[#173F35] p-10 text-white md:flex md:flex-col md:justify-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#E4C35F]">
            Aaditya's Midway
          </p>

          <h1 className="font-serif text-4xl leading-tight">
            Good food,
            <br />
            Good mood.
          </h1>

          <p className="mt-5 max-w-sm text-white/75">
            Create an account to place orders, track your
            orders, and enjoy a smoother dining experience.
          </p>
        </div>

        {/* Right section */}
        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <Link
              to="/"
              className="text-sm font-medium text-[#6B4632] hover:underline"
            >
              ← Back to home
            </Link>

            <h2 className="mt-6 font-serif text-3xl font-bold text-[#24231F]">
              {mode === "login"
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p className="mt-2 text-sm text-[#625F56]">
              {mode === "login"
                ? "Login to continue with your order."
                : "Register to place orders and manage your account."}
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-[#24231F]"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-[#D8CFBD] bg-[#FFFDF8] px-4 py-3 outline-none transition focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/20"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-[#24231F]"
              >
                Email address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#D8CFBD] bg-[#FFFDF8] px-4 py-3 outline-none transition focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/20"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#24231F]"
              >
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete={
                  mode === "login"
                    ? "current-password"
                    : "new-password"
                }
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-[#D8CFBD] bg-[#FFFDF8] px-4 py-3 outline-none transition focus:border-[#D4A72C] focus:ring-2 focus:ring-[#D4A72C]/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#173F35] px-5 py-3.5 font-semibold text-white transition hover:bg-[#0F2D26] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Login"
                : "Create account"}
            </button>
          </form>

          <div className="mt-7 text-center text-sm text-[#625F56]">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="font-semibold text-[#6B4632] hover:underline"
            >
              {mode === "login"
                ? "Create one"
                : "Login"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AuthPage;