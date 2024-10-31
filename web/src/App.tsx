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
		<div className="bg-gray-100">
			<div className="flex min-h-dvh w-full flex-col bg-white">
				<div className="border-b">
					<h1 className="px-3 py-2 text-center text-lg font-semibold">QR Chat</h1>
				</div>
				<div className="h-[calc(100dvh-106px)] overflow-y-auto px-3 py-3">
					{messages.map((message, index) => {
						const isSystem = message.initiator === "system";
						return (
							<div key={index} className={`flex ${isSystem ? "items-center justify-start gap-2" : "justify-end"} mb-4`}>
								{isSystem && (
									<div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-blue-500 text-white">
										<img src="/logo.jpg" alt="Retain Logo" />
									</div>
								)}
								<div className={`max-w-xs py-1 ${isSystem ? "" : "rounded-2xl bg-[rgb(244,244,244)] px-4"}`}>{message.text}</div>
							</div>
						);
					})}
				</div>
				<div className="mb-5 flex items-center gap-4 px-3">
					<input
						type="text"
						id="message"
						name="message"
						autoComplete="off"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Type a message..."
						className="flex-grow rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
						disabled={loading}
					/>
					<button
						onClick={handleSend}
						className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
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
