/* ========= DOM Elements ========= */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const openChatBtn = document.getElementById("openChatBtn");
const chatContainer = document.getElementById("chatContainer");

/* ========= Initial Message ========= */
chatWindow.textContent = "Hello! How can I help you today?";

/* ========= Show Chat on Button Click ========= */
openChatBtn.addEventListener("click", () => {
  chatContainer.classList.remove("hidden");
  openChatBtn.style.display = "none"; // hide the button after opening chat
});

/* ========= Chat Form Submit Handler ========= */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Show user message in chat
  chatWindow.innerHTML += <p><strong>You:</strong> ${userMessage}</p>;
  userInput.value = "";

  try {
    // Send message securely to Cloudflare Worker
    const response = await fetch("https://adviceloreal.gurung-38.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) throw new Error("Network response was not ok.");

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || "No response received.";

    // Display AI response
    chatWindow.innerHTML += <p><strong>AI:</strong> ${aiResponse}</p>;
  } catch (error) {
    console.error(error);
    chatWindow.innerHTML += <p><strong>Error:</strong> Something went wrong.</p>;
  }
});

/* ========= Panel Slider Logic ========= */
let panelIndex = 0;
const panels = document.querySelectorAll(".panel");
const nextPanelBtn = document.querySelector(".panel-next");
const prevPanelBtn = document.querySelector(".panel-prev");

function showPanel(index) {
  panels.forEach((panel, i) => {
    panel.classList.remove("active");
    if (i === index) panel.classList.add("active");
  });
}

// Next button
nextPanelBtn?.addEventListener("click", () => {
  panelIndex = (panelIndex + 1) % panels.length;
  showPanel(panelIndex);
});

// Previous button
prevPanelBtn?.addEventListener("click", () => {
  panelIndex = (panelIndex - 1 + panels.length) % panels.length;
  showPanel(panelIndex);
});

// Auto switch every 6 seconds
if (panels.length > 0) {
  setInterval(() => {
    panelIndex = (panelIndex + 1) % panels.length;
    showPanel(panelIndex);
  }, 6000);
}

/* —— basic reset —— */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

@font-face {
  font-family: 'LOreal Sans';
  src: url('/assets/fonts/LOrealSans-Regular.woff2') format('woff2'),
       url('/assets/fonts/LOrealSans-Regular.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}