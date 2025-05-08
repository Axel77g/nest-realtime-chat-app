import {createContext, useContext, useState, useEffect, ReactNode, useRef, RefObject} from 'react';
import {io, Socket} from "socket.io-client";
import {getAxiosInstance} from "../lib/axiosInstance.ts";

interface User {
    id: string;
    pseudo: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    login: (credentials: { pseudo: string; password: string }) => Promise<void>;
    logout: () => void;
    wsConnection : Socket | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, _setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true)
    const wsConnection = useRef<Socket>(null);

    const setUser = (user : User | null) => {
        _setUser(user)
        setLoading(false)
    }

    const setupWS = ()=>{
        const token = localStorage.getItem("token")
        if(!token && wsConnection.current){
            wsConnection.current.close()
        }else if(token && !wsConnection.current){
            wsConnection.current = io(`http://localhost:3001/chat`, {
                query: {token}
            })
        }
    }



    const login = async (credentials: { pseudo: string; password: string }) => {
        const client= getAxiosInstance()
        try{
            const response = await client.post('/auth/login', credentials)
            const token = response.data.access_token
            localStorage.setItem('token', token);
            setUser(response.data.user);

        }catch (e){
            console.error(e)
            setUser(null)
        }finally {
            setupWS()
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setupWS()
    };

    // Auto-login on app load (optional)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const client = getAxiosInstance()

            async function fetchMe(){
                try{
                    const response = await client.get('/auth/me')
                    setUser(response.data)
                }catch (e){
                    logout()
                }finally {
                    setupWS()
                }
            }

            fetchMe()
                .then()

        }else{
            setLoading(false)
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, wsConnection : wsConnection.current }}>
            {loading ? "" : children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
