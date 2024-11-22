import { forwardRef, type KeyboardEvent, memo, useEffect, useRef, useState } from "react";

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
	<header className="flex items-center justify-center border-b bg-gray-50">
		{/* <h1 className="px-3 py-2 text-center text-lg font-semibold">AI Chat</h1> */}
		<div className="w-36">
			<img src="/logo.webp" className="h-full w-full object-contain" alt="Logo" />
		</div>
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
				disabled={loading || !input.trim()}
			>
				<UpArrowSVG />
			</button>
		</footer>
	);
};

// Message Component
const Message = memo(({ content, role }: Message) => {
	const messageRef = useRef<HTMLDivElement>(null);
	const isAssistant = role === Role.Assistant;

	useEffect(() => {
		// Scroll to the bottom of the message when it's rendered
		messageRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	return (
		<div className={`flex ${isAssistant ? "justify-start gap-2" : "justify-end"} mb-4`}>
			{isAssistant && (
				<div className="mt-1 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-50 text-white">
					<img src="/logo.webp" className="h-full w-full object-contain" alt="Logo" />
				</div>
			)}
			<div ref={messageRef} className={`max-w-xs break-words lg:max-w-2xl ${isAssistant ? "flex-1" : "rounded-3xl bg-gray-200 px-5 py-2.5"}`}>
				<p>{content}</p>
			</div>
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
			content: ""
		}
	]);
	const [input, setInput] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const typewriter = async () => {
			setLoading(true);
			const firstMessage = "Hello! I'm an AI assistant. How can I help you today?";

			const splittedStream = firstMessage.split(" ");

			for (const word of splittedStream) {
				setMessages((prev) => {
					const updatedMessages = [...prev];
					const lastMessage = updatedMessages[updatedMessages.length - 1];

					if (lastMessage.role === Role.Assistant) {
						lastMessage.content += ` ${word}`;
					} else {
						updatedMessages.push({ role: Role.Assistant, content: word });
					}

					return updatedMessages;
				});
				await new Promise((resolve) => setTimeout(resolve, 50));
			}
			setLoading(false);
		};

		typewriter();
	}, []);

	const handleSend = async () => {
		if (loading) return;

		if (input.trim()) {
			const newMessage = { content: input, role: Role.User };
			setMessages((prev) => [...prev, newMessage]);
			setInput("");
			setLoading(true);

			try {
				const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ messages: [...messages, newMessage] })
				});

				if (!response.body) throw new Error("No response body");

				const reader = response.body.getReader();
				const decoder = new TextDecoder("utf-8");

				let content = "";

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const chunk = decoder.decode(value, { stream: true });
					content += chunk;

					setMessages((prev) => {
						const updatedMessages = [...prev];
						const lastMessage = updatedMessages[updatedMessages.length - 1];

						if (lastMessage.role === Role.Assistant) {
							lastMessage.content += chunk;
						} else {
							updatedMessages.push({ role: Role.Assistant, content: chunk });
						}

						return updatedMessages;
					});
				}
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
		<div className="flex h-dvh w-full flex-col bg-gray-100">
			<Header />
			<Chat ref={chatRef} messages={messages} />
			<Input {...inputProps} scrollToBottom={scrollToBottom} />
		</div>
	);
};

export default App;
