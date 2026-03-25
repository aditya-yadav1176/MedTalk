document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {
    let userMessage = document.getElementById("user-input").value.trim();

    if (userMessage === "") return;

    addMessage(userMessage, "user");

    fetch("/chat", {
        method: "POST",
        body: JSON.stringify({ message: userMessage }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        if (data.reply) {
            addMessage(data.reply, "bot");
        } else {
            addMessage("Error: No response from server", "bot");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        addMessage("Error: Unable to reach server", "bot");
    });

    document.getElementById("user-input").value = "";
}

function addMessage(text, sender) {
    let chatBox = document.getElementById("chat-box");
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", sender);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Voice Input Feature
document.getElementById("voice-btn").addEventListener("click", function () {
    let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onstart = function () {
        document.getElementById("voice-btn").textContent = "🎙️"; // Mic while recording
    };

    recognition.onend = function () {
        document.getElementById("voice-btn").textContent = "🎧"; // Back to headphones
    };

    recognition.onresult = function (event) {
        let transcript = event.results[0][0].transcript;
        document.getElementById("user-input").value = transcript;
        sendMessage();
    };

    recognition.start();
});
