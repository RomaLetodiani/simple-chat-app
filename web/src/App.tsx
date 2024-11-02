import { memo, useState } from "react";

// Enums and types
enum Role {
	User = "user",
	Assistant = "assistant"
}

type Message = {
	content: string;
	role: Role;
};

// SVG Component
const UpArrowSVG = () => (
	<svg id="Arrow-Up--Streamline-Carbon" xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 16 16" height="1em" width="1em">
		<path
			d="M7.5 1.875 2.8125 6.5625l0.6609375 0.6609375L7.03125 3.6703125 7.03125 13.125l0.9375 0 0 -9.4546875 3.5578125 3.553125L12.1875 6.5625 7.5 1.875z"
			strokeWidth="1"
			fill="currentColor"
		/>
		<path id="_Transparent_Rectangle_" d="M0 0h15v15H0Z" fill="none" strokeWidth="1" />
	</svg>
);

// Header Component
const Header = () => (
	<header className="border-b bg-gray-50">
		<h1 className="px-3 py-2 text-center text-lg font-semibold">Retain Chat</h1>
	</header>
);

// Input Component
const Input = ({ input, setInput, loading, handleSend }: { input: string; setInput: (value: string) => void; loading: boolean; handleSend: () => void }) => {
	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleSend();
		}
	};

	return (
		<footer className="relative mb-5 flex items-center gap-4 px-3">
			<input
				type="text"
				id="message"
				name="message"
				autoComplete="off"
				value={input}
				onKeyDown={handleKeyDown}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Type a message..."
				className="flex-grow rounded-full border border-gray-300 py-3 pl-5 pr-14 outline-none disabled:opacity-70"
				disabled={loading}
			/>
			<button
				onClick={handleSend}
				className="absolute right-6 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-2xl font-semibold text-white outline-none disabled:opacity-70"
				disabled={loading}
			>
				<UpArrowSVG />
			</button>
		</footer>
	);
};

// Message Component
const Message = memo(({ content, role }: Message) => {
	const isSystem = role === Role.Assistant;
	return (
		<div className={`flex ${isSystem ? "items-center justify-start gap-2" : "justify-end"} mb-4`}>
			{isSystem && (
				<div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-blue-500 text-white">
					<img src="/logo.jpg" alt="Retain Logo" />
				</div>
			)}
			<div className={`max-w-xs break-words py-1 ${isSystem ? "" : "rounded-2xl bg-gray-200 px-4"}`}>{content}</div>
		</div>
	);
});

// Chat Component
const Chat = memo(({ messages }: { messages: Message[] }) => (
	<main className="h-[calc(100dvh-114px)] overflow-y-auto px-3 py-3">
		{messages.map((message, index) => (
			<Message key={index} {...message} />
		))}
	</main>
));

// Custom Hook for handling messages
const useHandleMessages = () => {
	const [messages, setMessages] = useState<Message[]>([{ content: "გამარჯობა", role: Role.Assistant }]);
	const [input, setInput] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const handleSend = () => {
		if (input.trim()) {
			const newMessage = { content: input, role: Role.User };
			setMessages((prev) => [...prev, newMessage]);
			setInput("");

			setLoading(true);
			setTimeout(() => {
				const systemMessage = { content: "Fake API call completed", role: Role.Assistant };
				setMessages((prev) => [...prev, systemMessage]);
				setLoading(false);
			}, 1000);
		}
	};

	return { messages, handleSend, loading, input, setInput };
};

// Main App Component
const App = () => {
	const { messages, handleSend, loading, input, setInput } = useHandleMessages();

	return (
		<div className="flex min-h-dvh w-full flex-col bg-gray-100">
			<Header />
			<Chat messages={messages} />
			<Input input={input} setInput={setInput} loading={loading} handleSend={handleSend} />
		</div>
	);
};

export default App;
