document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");
    let typingIndicator = null;

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
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            console.log("AI Response:", data);
            
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
        messageElement.innerHTML = text;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function showTypingIndicator() {
        if (!typingIndicator) {
            typingIndicator = document.createElement("div");
            typingIndicator.classList.add("bot-message", "typing");
            typingIndicator.textContent = "Typing...";
            chatBox.appendChild(typingIndicator);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    }

    function hideTypingIndicator() {
        if (typingIndicator) {
            typingIndicator.remove();
            typingIndicator = null;
        }
    }

    function formatResponse(text) {
        return text.replace(/\n/g, "<br>")
                   .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
                   .replace(/\*(.*?)\*/g, "<i>$1</i>");
    }
});
