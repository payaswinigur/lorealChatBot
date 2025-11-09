/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const openChatBtn = document.getElementById("openChatBtn");
const chatContainer = document.getElementById("chatContainer");

/* === Toggle chat visibility === */
openChatBtn.addEventListener("click", () => {
  chatContainer.classList.toggle("hidden");

  if (!chatContainer.classList.contains("hidden")) {
    chatContainer.scrollIntoView({ behavior: "smooth" });
  }
});

/* === Initial message === */
chatWindow.innerHTML = `
  <div class="msg ai">Hello! How can I help you today?</div>
`;

/* === Handle form submit === */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Add user bubble
  chatWindow.innerHTML += `<div class="msg user">${userMessage}</div>`;
  chatWindow.scrollTop = chatWindow.scrollHeight;
  userInput.value = "";

  // Typing indicator
  const typingEl = document.createElement("div");
  typingEl.className = "msg AIdvisor typing";
  typingEl.textContent = "AIdvisor is typing...";
  chatWindow.appendChild(typingEl);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  try {
    // Send to Cloudflare Worker
    const response = await fetch("https://adviceloreal.gurung-38.workers.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a friendly L'Oréal product assistant." },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();
    const aiReply = data.choices?.[0]?.message?.content || "Sorry, I didn’t get that.";

    typingEl.remove();
    chatWindow.innerHTML += `<div class="msg ai">${aiReply}</div>`;
  } catch (err) {
    typingEl.remove();
    chatWindow.innerHTML += `<div class="msg ai error">⚠️ Error: ${err.message}</div>`;
  }

  chatWindow.scrollTop = chatWindow.scrollHeight;
});
