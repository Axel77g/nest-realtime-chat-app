import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../contexts/AuthContext.tsx";
import {Lock, User} from "lucide-react";

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [pseudo, setPseudo] = useState('axel');
    const [password, setPassword] = useState('ABCDE');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ pseudo, password });
            navigate('/');
        } catch {
            setError('Nom d\'utilisateur ou mot de passe incorrect');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-back-light">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-2">Sign in</h2>
                <p className="text-center text-gray-500 mb-6">Sign in to continue to Chatvia.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Username
                        </label>
                            <div className="relative mt-1">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-light/80">
                                <User/>
                              </span>
                            <input
                                id="email"
                                type="text"
                                value={pseudo}
                                onChange={(e) => setPseudo(e.target.value)}
                                className="pl-10 w-full border border-primary-light/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <div className="relative mt-1  items-center">
                              <span className="absolute top-2 flex items-center pl-3 text-primary-light/80">
                                <Lock/>
                              </span>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 w-full border border-primary-light/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                            <a href="#" className="text-sm text-gray-400 ml-auto pr-2 hover:text-gray-600 block">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 transition"
                    >
                        Sign in
                    </button>
                </form>
            </div>
        </div>

    );
};

export default LoginPage;
