const messageInput = document.getElementById("messageInput");
const messageType = document.getElementById("messageType");
const tone = document.getElementById("tone");
const generateBtn = document.getElementById("generateBtn");
const regenerateBtn = document.getElementById("regenerateBtn");
const clearBtn = document.getElementById("clearBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const generatedMessage = document.getElementById("generatedMessage");
const emptyState = document.getElementById("emptyState");
const loadingState = document.getElementById("loadingState");
const resultActions = document.getElementById("resultActions");
const errorMessage = document.getElementById("errorMessage");
const copyFeedback = document.getElementById("copyFeedback");
const charCount = document.getElementById("charCount");

let lastGeneratedMessage = "";

messageInput.addEventListener("input", () => {
  charCount.textContent = `${messageInput.value.length.toLocaleString()} / 10,000`;
});

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.hidden = false;
}

function setLoading(isLoading) {
  generateBtn.disabled = isLoading;
  regenerateBtn.disabled = isLoading;
  generateBtn.querySelector("span:first-child").textContent =
    isLoading ? "Working..." : "Generate with AI";
  loadingState.hidden = !isLoading;
  if (isLoading) {
    emptyState.hidden = true;
    generatedMessage.hidden = true;
    resultActions.hidden = true;
  }
}

async function generateMessage() {
  const message = messageInput.value.trim();
  errorMessage.hidden = true;
  copyFeedback.textContent = "";

  if (!message) {
    showError("Please enter your message before generating.");
    messageInput.focus();
    return;
  }

  setLoading(true);
  try {
    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        message_type: messageType.value,
        tone: tone.value
      })
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.error || "Something went wrong. Please try again.");
    }

    lastGeneratedMessage = data.generated_message;
    generatedMessage.textContent = lastGeneratedMessage;
    generatedMessage.hidden = false;
    emptyState.hidden = true;
    resultActions.hidden = false;
  } catch (error) {
    emptyState.hidden = false;
    showError(error.message || "Unable to connect to the AI service. Please try again.");
  } finally {
    setLoading(false);
  }
}

generateBtn.addEventListener("click", generateMessage);
regenerateBtn.addEventListener("click", generateMessage);

clearBtn.addEventListener("click", () => {
  messageInput.value = "";
  charCount.textContent = "0 / 10,000";
  generatedMessage.textContent = "";
  generatedMessage.hidden = true;
  lastGeneratedMessage = "";
  emptyState.hidden = false;
  resultActions.hidden = true;
  loadingState.hidden = true;
  errorMessage.hidden = true;
  copyFeedback.textContent = "";
  messageInput.focus();
});

copyBtn.addEventListener("click", async () => {
  if (!lastGeneratedMessage) return;
  try {
    await navigator.clipboard.writeText(lastGeneratedMessage);
    copyFeedback.textContent = "Message copied to clipboard.";
  } catch {
    copyFeedback.textContent = "Copy is unavailable in this browser. Select the text and copy it manually.";
  }
});

downloadBtn.addEventListener("click", () => {
  if (!lastGeneratedMessage) return;
  const blob = new Blob([lastGeneratedMessage], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "improved_message.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

document.getElementById("year").textContent = new Date().getFullYear();
