import { createContext, JSX, useContext, useState } from "react";
import { createPortal } from "react-dom";

interface DialogContext {
  open: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}
const DialogContext = createContext<DialogContext | null>(null);
export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context)
    throw new Error("useDialog must be used within a DialogContextProvider");
  return context;
};
export function DialogOpener(props: { children: JSX.Element }) {
  const { open } = useDialogContext();
  const portal = createPortal(
    open && (
      <div className={"absolute z-100 inset-0 bg-gray-500/10 bg-opacity-50"}>
        <div
          className={
            "relative top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white max-w-2/3 p-4 rounded-md"
          }
        >
          {props.children}
        </div>
      </div>
    ),
    document.body,
  );

  return portal;
}

export function createDialogContext(openValue: boolean): DialogContext {
  const [open, setOpen] = useState<boolean>(openValue);
  function openDialog() {
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  return {
    open,
    openDialog,
    closeDialog,
  };
}

export interface DialogProps extends DialogContext {
  children: JSX.Element;
}
export function Dialog(props: DialogProps) {
  return (
    <DialogContext.Provider value={props}>
      <DialogOpener>{props.children}</DialogOpener>
    </DialogContext.Provider>
  );
}
