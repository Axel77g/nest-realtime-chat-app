import React from 'react';
import {
  Smile,
  Paperclip,
  Image as ImageIcon,
  Send
} from 'lucide-react';

interface MessageInputProps {
  value: string;
  setValue: (value: string) => void;
  onSend: () => void;
  onInput: React.FormEventHandler<HTMLInputElement> ;
}

const MessageInput: React.FC<MessageInputProps> = ({ value, setValue, onSend, onInput }) => {
    function handleInput(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key !== 'Enter') {
            onInput(e);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            onSend();
        }
    }
    return (
    <div className="flex items-center px-4 py-3 bg-white border-t border-primary-light/10">
      {/* Input field */}
      <div className="flex-1 flex items-center bg-[#eef1f9] rounded-lg px-4 py-2">
        <input
          type="text"
          value={value}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter Message..."
          className="bg-transparent flex-1 outline-none text-sm text-gray-700 placeholder-gray-500"
        />
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-4 px-4">
        <button className="text-primary hover:text-primary/70 transition" type="button">
          <Smile size={18} />
        </button>
        <button className="text-primary hover:text-primary/70 transition" type="button">
          <Paperclip size={18} />
        </button>
        <button className="text-primary hover:text-primary/70 transition" type="button">
          <ImageIcon size={18} />
        </button>
      </div>

      {/* Send */}
      <button
        onClick={onSend}
        type="button"
        className="bg-primary text-white p-3 rounded-lg hover:bg-primary/90 transition"
      >
        <Send size={16} />
      </button>
    </div>
  );
};

export default MessageInput;
