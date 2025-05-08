import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

export default function Login() {
  const [password, setPassword] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsChecking(true);
    setError("");
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        router.push('/');
      } else {
        setError(data.message || "Invalid password");
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
      console.error("Auth error:", err);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - Admin Panel</title>
      </Head>
      <h3 style={{ backgroundColor: "#FFCCCC" }}>This is the login for the HSE Admin App. Recently, due to security concerns, the password has changed. If you need the new password, or are experiencing an error, email <a href="mailto:patchjoh000@hsestudents.org">patchjoh000@hsestudents.org</a> or <a href="mailto:jalano@hse.k12.in.us">jalano@hse.k12.in.us</a>. This change was made in a quick security fix, so if there are any bugs, please report them.</h3>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
          
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-3"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isChecking}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 disabled:bg-blue-300"
            >
              {isChecking ? "Logging in..." : "Log In"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
