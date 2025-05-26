import { Participant } from "../../hooks/useConversations.ts";

function hexToRgba(hex: string, alpha = 1) {
  // Nettoie le #
  const cleanHex = hex.replace("#", "");

  // Découpe en 3 parties R,G,B (en hex)
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function Avatar(props: { user: Participant; className?: string }) {
  const { user } = props;
  const size = `${props.className || "w-10 h-10"}`;
  return (
    <>
      {user?.avatarURL ? (
        <img
          src={user.avatarURL}
          alt={user?.pseudo}
          className={size + " rounded-full object-cover"}
        />
      ) : (
        <div
          style={
            user?.color
              ? {
                  backgroundColor: hexToRgba(user.color, 0.1),
                  color: hexToRgba(user.color, 1),
                }
              : {}
          }
          className={`rounded-full font-bold flex items-center justify-center ${size} ${!user?.color ? "bg-primary/10 text-primary" : ""}`}
        >
          {user?.pseudo.charAt(0)}
        </div>
      )}
    </>
  );
}

export default Avatar;
