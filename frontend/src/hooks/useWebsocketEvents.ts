import {useAuth} from "../contexts/AuthContext.tsx";
import {useEffect} from "react";

export function useWebsocketEvents( event:string, onNewUpdate : (message:any) => void = () => {}) {
    const {wsConnection} = useAuth()
    useEffect(() => {
        if(wsConnection) wsConnection.on(event, onNewUpdate)
        return () => {
            if(wsConnection) wsConnection.off(event, onNewUpdate)
        }
    }, [onNewUpdate]);

    return (message:any)=>{
        wsConnection?.emit(event, message)
    }
}