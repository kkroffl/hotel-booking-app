import { useState } from "react";
import { Link } from "react-router-dom";

function Login() {
  // Store the values entered into the login form.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submission for now.
  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Login form submitted:", {
      email,
      password,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto flex max-w-md flex-col justify-center">
        {/* Page heading */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>

          <p className="mt-2 text-gray-600">Sign in to continue to StayNest.</p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl bg-white p-6 shadow-md md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Sign In
            </button>
          </form>

          {/* Register link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
