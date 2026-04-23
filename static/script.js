const form = document.getElementById("urlForm");
const urlInput = document.getElementById("urlInput");
const resultBox = document.getElementById("resultBox");
const resultTitle = document.getElementById("resultTitle");
const resultConfidence = document.getElementById("resultConfidence");
const resultMessage = document.getElementById("resultMessage");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const url = urlInput.value.trim();

    try {
        const response = await fetch("/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
        });

        const data = await response.json();
        resultBox.classList.remove("hidden", "safe", "phishing");

        if (!data.success) {
            resultTitle.textContent = "Error";
            resultConfidence.textContent = "";
            resultMessage.textContent = data.error;
            return;
        }

        resultTitle.textContent = data.prediction;
        resultConfidence.textContent = `Confidence: ${data.confidence}%`;
        resultMessage.textContent = data.message;
        resultBox.classList.add(data.prediction === "Safe" ? "safe" : "phishing");
    } catch (error) {
        resultBox.classList.remove("hidden", "safe", "phishing");
        resultTitle.textContent = "Error";
        resultConfidence.textContent = "";
        resultMessage.textContent = "Could not connect to the backend server.";
    }
});
