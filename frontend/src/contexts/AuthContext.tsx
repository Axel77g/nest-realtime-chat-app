import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";
import { getAxiosInstance } from "../lib/axiosInstance.ts";

export interface User {
  pseudo: string;
  password: string;
  avatarURL: string;
  color: string;
}

interface AuthContextType {
  user: User | null;
  setUser(user: User | null): void;
  fetchMe: () => Promise<void>;
  login: (credentials: { pseudo: string; password: string }) => Promise<void>;
  register: (credentials: {
    pseudo: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  wsConnection: Socket | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, _setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const wsConnection = useRef<Socket>(null);

  const setUser = (user: User | null) => {
    _setUser(user ? { ...user } : null);
    if (user) {
      document.documentElement.style.setProperty("--color-primary", user.color);
    }
    setLoading(false);
  };

  const setupWS = () => {
    const token = localStorage.getItem("token");
    if (!token && wsConnection.current) {
      wsConnection.current.close();
    } else if (token && !wsConnection.current) {
      wsConnection.current = io(`http://localhost:3001/chat`, {
        query: { token },
      });
    }
  };

  const makeCall = async (
    credentials: { pseudo: string; password: string },
    action: string = "login",
  ) => {
    const client = getAxiosInstance();
    try {
      const response = await client.post(`/auth/${action}`, credentials);
      const token = response.data.access_token;
      localStorage.setItem("token", token);
      setUser({ ...response.data.user });
    } catch (e) {
      console.error(e);
      setUser(null);
      throw e;
    } finally {
      setupWS();
    }
  };

  const login = async (credentials: { pseudo: string; password: string }) => {
    return makeCall(credentials, "login");
  };

  const register = async (credentials: {
    pseudo: string;
    password: string;
  }) => {
    return makeCall(credentials, "register");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setupWS();
    location.reload();
  };

  async function fetchMe() {
    try {
      const client = getAxiosInstance();

      const response = await client.get("/auth/me");
      setUser(response.data);
    } catch (e) {
      console.error(e);
      logout();
    } finally {
      setupWS();
    }
  }

  // Auto-login on app load (optional)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchMe().then();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        fetchMe,
        setUser,
        register,
        wsConnection: wsConnection.current,
      }}
    >
      {loading ? "" : children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
