document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");
    const stopButton = document.createElement("button");
    stopButton.textContent = "Stop";
    stopButton.id = "stop-btn";
    stopButton.style.display = "none";
    document.querySelector(".input-container").appendChild(stopButton);

    let controller = null;

    sendButton.addEventListener("click", sendMessage);
    stopButton.addEventListener("click", stopResponse);
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
        stopButton.style.display = "inline-block";

        controller = new AbortController();
        const signal = controller.signal;

        try {
            const response = await fetch("http://localhost:3000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message }),
                signal
            });

            const data = await response.json();
            hideTypingIndicator();
            stopButton.style.display = "none";

            if (data && data.content) {
                appendMessage("bot", formatResponse(data.content));
            } else {
                appendMessage("bot", "I'm not sure about that.");
            }
        } catch (error) {
            console.error("Error:", error);
            hideTypingIndicator();
            stopButton.style.display = "none";
            appendMessage("bot", "Response stopped or an error occurred.");
        }
    }

    function stopResponse() {
        if (controller) {
            controller.abort();
            stopButton.style.display = "none";
        }
    }

    function appendMessage(sender, text) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender === "user" ? "user-message" : "bot-message");
        messageElement.innerHTML = formatResponse(text);
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
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
        return text
            .replace(/\n/g, "<br>")
            .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
            .replace(/\*(.*?)\*/g, "<i>$1</i>");
    }
});
