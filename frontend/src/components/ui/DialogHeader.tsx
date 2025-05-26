import { X } from "lucide-react";
import { useDialogContext } from "./Dialog.tsx";

export function DialogHeader(props: { children: any }) {
  const { closeDialog } = useDialogContext();
  return (
    <div
      className={"-m-4 mb-4 p-4 border-b border-gray-200 flex justify-between"}
    >
      <h1 className={"text-1xl font-bold"}>{props.children}</h1>
      <button className={"cursor-pointer"} onClick={() => closeDialog()}>
        <X />
      </button>
    </div>
  );
}
