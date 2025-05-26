import { useRef } from "react";
import { createPortal } from "react-dom";
import { Tooltip } from "react-tooltip";

function generateRandomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
export function NotImplemented(props: { children: any }) {
  const uniqueId = useRef(generateRandomString(20));
  return (
    <span
      data-tooltip-id={uniqueId.current}
      data-tooltip-content="Not implemented"
      data-tooltip-place="bottom"
    >
      {props.children}
      {createPortal(<Tooltip id={uniqueId.current} />, document.body)}
    </span>
  );
}
