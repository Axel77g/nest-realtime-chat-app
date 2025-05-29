import { Participant } from "../../hooks/useConversations.ts";
import Avatar from "./Avatar.tsx";

const ParticipantsConversation = (props: { participants: Participant[] }) => {
  const { participants } = props;
  return (
    <div className="flex -space-x-5">
      {participants.slice(0, 3).map((participant, index) => (
        <div
          key={participant.pseudo}
          style={{ zIndex: participants.length - index }}
          className={"bg-white rounded-full"}
        >
          <Avatar
            user={participant}
            className="border-2 border-white w-10 h-10"
          />
        </div>
      ))}
      {participants.length > 2 && (
        <div
          className="flex items-center justify-center w-8 h-8 rounded-full bg-primary border-2 border-white text-white"
          style={{ zIndex: participants.length }}
        >
          <span className="text-xs ">+{participants.length - 2}</span>
        </div>
      )}
    </div>
  );
};

export default ParticipantsConversation;
