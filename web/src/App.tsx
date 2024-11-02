import axios from "axios";
import { forwardRef, KeyboardEvent, memo, useEffect, useRef, useState } from "react";

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
		<h1 className="px-3 py-2 text-center text-lg font-semibold">AI Chat</h1>
	</header>
);

type InputProps = {
	input: string;
	setInput: (value: string) => void;
	loading: boolean;
	handleSend: () => void;
	scrollToBottom: () => void;
};

// Input Component
const Input = ({ input, setInput, loading, handleSend, scrollToBottom }: InputProps) => {
	const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			handleSend();
		}
	};
	const inputRef = useRef<HTMLInputElement>(null);
	const [isFocused, setIsFocused] = useState<boolean>(false);

	// Focus on the input when the component is rendered

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	useEffect(() => {
		const onFocus = () => setIsFocused(true);
		const onBlur = () => setIsFocused(false);

		const currentRef = inputRef.current;
		currentRef?.addEventListener("focus", onFocus);
		currentRef?.addEventListener("blur", onBlur);

		return () => {
			currentRef?.removeEventListener("focus", onFocus);
			currentRef?.removeEventListener("blur", onBlur);
		};
	}, [inputRef]);
	return (
		<footer className="relative mb-5 flex items-center gap-4 px-3">
			<input
				type="text"
				id="message"
				name="message"
				autoComplete="off"
				value={input}
				onClick={scrollToBottom}
				ref={inputRef}
				onKeyDown={handleKeyDown}
				onChange={(e) => setInput(e.target.value)}
				placeholder="Type a message..."
				className="w-full flex-grow rounded-full border border-gray-300 py-3 pl-5 pr-14 outline-none"
			/>
			<button
				onClick={handleSend}
				className={`absolute right-6 ${isFocused ? "bg-gray-600" : "bg-gray-400"} top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-2xl font-semibold text-white outline-none disabled:opacity-70`}
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
const Chat = memo(
	forwardRef<HTMLElement, { messages: Message[] }>(({ messages }, ref) => {
		return (
			<main ref={ref} className="h-full overflow-y-auto px-3 py-3">
				{messages.map((message, index) => (
					<Message key={index} {...message} />
				))}
			</main>
		);
	})
);

// Custom Hook for handling messages
const useHandleMessages = () => {
	const [messages, setMessages] = useState<Message[]>([
		{
			role: Role.Assistant,
			content: "Hello! I'm an AI assistant. How can I help you today?"
		}
	]);
	const [input, setInput] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const handleSend = async () => {
		if (loading) return;

		if (input.trim()) {
			const newMessage = { content: input, role: Role.User };
			setMessages((prev) => [...prev, newMessage]);
			setInput("");

			setLoading(true);

			try {
				const { data } = await axios.post(import.meta.env.BASE_URL, {
					messages: [...messages, newMessage]
				});
				setMessages((prev) => [...prev, { role: Role.Assistant, content: data }]);
			} catch (error) {
				console.error("Error fetching assistant message:", error);
			} finally {
				setLoading(false);
			}
		}
	};

	return { messages, handleSend, loading, input, setInput };
};

// Main App Component
const App = () => {
	const { messages, ...inputProps } = useHandleMessages();
	const chatRef = useRef<HTMLElement>(null);

	const scrollToBottom = () => {
		if (chatRef.current) {
			chatRef.current.scrollTop = chatRef.current.scrollHeight;
		}
	};

	return (
		<div className="flex min-h-dvh w-full flex-col bg-gray-100">
			<Header />
			<Chat ref={chatRef} messages={messages} />
			<Input {...inputProps} scrollToBottom={scrollToBottom} />
		</div>
	);
};

export default App;
