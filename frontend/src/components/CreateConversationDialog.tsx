import { Dialog, DialogProps } from "./ui/Dialog";
import { DialogHeader } from "./ui/DialogHeader.tsx";
import { useState } from "react";
import { getAxiosInstance } from "../lib/axiosInstance.ts";
import { useChatContext } from "../contexts/ChatContext.tsx";

export function CreateConversationDialog(props: Omit<DialogProps, "children">) {
  const [errorMessage, setErrorMessage] = useState("");
  const [participants, setParticipants] = useState("");
  const { fetchConversations } = useChatContext();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const participantsArray = participants.split(",").map((p) => p.trim());
    const payload = { participantsPseudos: participantsArray };
    const client = getAxiosInstance();
    try {
      await client.post("/conversations", payload);
      await fetchConversations();
      props.closeDialog();
    } catch (e: any) {
      const { response } = e;
      setErrorMessage(response.data.message);
    }
  };

  return (
    <Dialog {...props}>
      <>
        <DialogHeader>Create a conversation</DialogHeader>
        <form onSubmit={handleSubmit} className={"flex flex-col gap-4"}>
          <div>
            <label htmlFor="participants" className={"mb-2 block"}>
              Pseudos participants
            </label>
            <input
              id="participants"
              type="text"
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="Enter participants' pseudos, separated by commas"
              className="w-full px-4 py-2 text-sm rounded-md bg-primary-light/10 placeholder:text-gray-500 text-gray-700 focus:outline-none"
              required
            />
          </div>
          {errorMessage && (
            <span className={"text-red-600"}>{errorMessage}</span>
          )}
          <button
            type="submit"
            className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition"
          >
            Create
          </button>
        </form>
      </>
    </Dialog>
  );
}
