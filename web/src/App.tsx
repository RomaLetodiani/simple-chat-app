import { useState } from "react";

const App = () => {
  const [messages, setMessages] = useState([{ text: "გამარჯობა", initiator: "system" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { text: input, initiator: "user" };
      setMessages([...messages, newMessage]);
      setInput("");

      setLoading(true);
      setTimeout(() => {
        const systemMessage = { text: "Fake API call completed", initiator: "system" };
        setMessages((prev) => [...prev, systemMessage]);
        setLoading(false);
      }, 1000);
    }
  };

  return (
    <div className="  bg-gray-100">
      <div className="w-full flex flex-col bg-white min-h-dvh">
        <div className="border-b">
          <h1 className="text-lg font-semibold py-2 px-3 text-center">QR Chat</h1>
        </div>
        <div className="overflow-y-auto h-[calc(100dvh-106px)] py-3 px-3">
          {messages.map((message, index) => {
            const isSystem = message.initiator === "system";
            return (
              <div
                key={index}
                className={`flex ${
                  isSystem ? "justify-start gap-2 items-center" : "justify-end"
                } mb-4`}
              >
                {isSystem && (
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center overflow-hidden justify-center text-white">
                    <img src="/logo.jpg" alt="Retain Logo" />
                  </div>
                )}
                <div
                  className={`max-w-xs py-1 ${
                    isSystem ? "" : " bg-[rgb(244,244,244)] rounded-2xl px-4"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center mb-5 px-3 gap-4">
          <input
            type="text"
            id="message"
            name="message"
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50"
            disabled={loading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
