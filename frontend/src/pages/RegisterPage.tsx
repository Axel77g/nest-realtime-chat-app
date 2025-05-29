import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.tsx";
import { Lock, User } from "lucide-react";

const RegisterPage = () => {
  const { register } = useAuth(); // Assure-toi que `register` est bien défini dans ton contexte
  const navigate = useNavigate();
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    try {
      await register({ pseudo, password });
      navigate("/");
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("Une erreur est survenue lors de l'inscription");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-back-light">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Sign up</h2>
        <p className="text-center text-gray-500 mb-6">
          Create an account to start chatting.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="pseudo"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-light/80">
                <User />
              </span>
              <input
                id="pseudo"
                type="text"
                placeholder={"Enter your username"}
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                className="pl-10 w-full border border-primary-light/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-light/80">
                <Lock />
              </span>
              <input
                id="password"
                placeholder={"Enter your password"}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full border border-primary-light/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-light/80">
                <Lock />
              </span>
              <input
                id="confirm-password"
                type="password"
                placeholder={"Confirm your password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 w-full border border-primary-light/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
