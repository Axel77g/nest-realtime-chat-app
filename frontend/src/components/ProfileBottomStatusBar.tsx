import { useAuth } from "../contexts/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import Avatar from "./ui/Avatar.tsx";

export function ProfileBottomStatusBar() {
  const { user } = useAuth();
  if (!user) throw new Error("No user logged");
  const online = true;
  const statusColor = '"bg-emerald-400';
  const navigate = useNavigate();
  return (
    <div
      className="flex items-center space-x-3"
      onClick={() => navigate("/profile")}
    >
      <div className="relative w-10 h-10">
        <Avatar user={user} />
        {online && (
          <span
            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${statusColor}`}
          />
        )}
      </div>
      <span className="font-semibold text-gray-800">{user?.pseudo}</span>
    </div>
  );
}
