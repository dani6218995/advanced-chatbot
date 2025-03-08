document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;

        appendMessage("user", message);
        userInput.value = "";
        showTypingIndicator();
        
        try {
            const response = await fetch("http://localhost:3000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            hideTypingIndicator();

            if (data && data.content) {
                appendMessage("bot", formatResponse(data.content));
            } else {
                appendMessage("bot", "I'm not sure about that.");
            }
        } catch (error) {
            console.error("Error:", error);
            hideTypingIndicator();
            appendMessage("bot", "Sorry, I am having trouble responding right now.");
        }
    }

    function appendMessage(sender, text) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender === "user" ? "user-message" : "bot-message");
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;

        let index = 0;
        function typeEffect() {
            if (index < text.length) {
                messageElement.textContent += text[index];
                index++;
                chatBox.scrollTop = chatBox.scrollHeight;
                setTimeout(typeEffect, 50);
            }
        }
        typeEffect();
    }

    function showTypingIndicator() {
        const typingIndicator = document.createElement("div");
        typingIndicator.classList.add("bot-message", "typing");
        typingIndicator.textContent = "Typing...";
        typingIndicator.id = "typing-indicator";
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function hideTypingIndicator() {
        const typingIndicator = document.getElementById("typing-indicator");
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function formatResponse(text) {
        return text.replace(/\n/g, "<br>")
                   .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                   .replace(/\*(.*?)\*/g, "<i>$1</i>");
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    async function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;

        appendMessage("user", message);
        userInput.value = "";
        showTypingIndicator();
        
        try {
            const response = await fetch("http://localhost:3000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();
            hideTypingIndicator();

            if (data && data.content) {
                appendMessage("bot", formatResponse(data.content));
            } else {
                appendMessage("bot", "I'm not sure about that.");
            }
        } catch (error) {
            console.error("Error:", error);
            hideTypingIndicator();
            appendMessage("bot", "Sorry, I am having trouble responding right now.");
        }
    }

    function appendMessage(sender, text) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender === "user" ? "user-message" : "bot-message");
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;

        let index = 0;
        function typeEffect() {
            if (index < text.length) {
                messageElement.textContent += text[index];
                index++;
                chatBox.scrollTop = chatBox.scrollHeight;
                setTimeout(typeEffect, 50);
            }
        }
        typeEffect();
    }

    function showTypingIndicator() {
        const typingIndicator = document.createElement("div");
        typingIndicator.classList.add("bot-message", "typing");
        typingIndicator.textContent = "Typing...";
        typingIndicator.id = "typing-indicator";
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function hideTypingIndicator() {
        const typingIndicator = document.getElementById("typing-indicator");
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    function formatResponse(text) {
        return text.replace(/\n/g, "<br>")
                   .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                   .replace(/\*(.*?)\*/g, "<i>$1</i>");
    }
});

import { Analytics } from '@vercel/analytics/react';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
