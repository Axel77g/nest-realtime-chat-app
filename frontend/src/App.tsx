import { Route, Routes} from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import ChatPage from "./pages/ChatPage.tsx";
import ConversationPage from "./pages/ConversationPage.tsx";
import PrivateRoute from "./PrivateRoute.tsx";
import {AuthProvider} from "./contexts/AuthContext.tsx";
import ChatContextProvider from "./contexts/ChatContext.tsx";


function App(){
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route element={<PrivateRoute/>}>
            <Route path={"/"} element={
                <ChatContextProvider>
                    <ChatPage/>
                </ChatContextProvider>
            }>
                <Route path={"/:id"} element={
                        <ConversationPage/>
                    }/>
            </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
