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
          <h1 className="text-lg font-semibold py-2 px-5 text-center">QR Chat</h1>
        </div>
        <div className="overflow-y-auto h-[calc(100dvh-106px)] py-3 px-5">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.initiator === "user" ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`max-w-xs p-2 rounded-lg shadow ${
                  message.initiator === "system"
                    ? "bg-blue-200 text-blue-800 rounded-bl-none"
                    : "bg-green-200 text-green-800 rounded-br-none"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="max-w-max p-2 rounded-lg shadow mb-2 bg-blue-200 text-blue-800 rounded-bl-none">
              Loading...
            </div>
          )}
        </div>
        <div className="flex items-center mb-5 px-5 gap-4">
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
