const openaiApiKey = "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";
const chatHistory = document.querySelector(".chat-history");
const chatMessageInput = document.querySelector(".chat-message textarea");
const sendButton = document.querySelector(".chat-message button");

sendButton.addEventListener("click", async () => {
  const messageText = chatMessageInput.value.trim();
  if (messageText) {
    const message = createMessage("user", messageText);
    addMessageToHistory(message);

    const response = await getChatbotResponse(messageText);
    const reply = createMessage("chatbot", response.choices[0].text);
    addMessageToHistory(reply);
  }
});

function createMessage(sender, text) {
  const message = document.createElement("div");
  message.classList.add("message");
  message.classList.add(sender === "user" ? "user-message" : "chatbot-message");
  message.innerHTML = `
    <div class="sender">${sender === "user" ? "You" : "Chatbot"}</div>
    <div class="text">${text}</div>
  `;
  return message;
}

function addMessageToHistory(message) {
  chatHistory.appendChild(message);
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

async function getChatbotResponse(message) {
  const response = await fetch("https://api.openai.com/v1/engines/text-davinci-003/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      prompt: `The user says: ${message}\nChatbot says:`,
      max_tokens: 1024,
      temperature: 0.7,
      n: 1,
      stop: "\n"
    })
  });
  return response.json();
}