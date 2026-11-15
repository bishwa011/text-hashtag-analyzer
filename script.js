const textInput = document.querySelector("#text-input");
const wordCountResult = document.querySelector("#word-count");
const characterCountResult = document.querySelector("#character-count");

function updateCounts() {
  const text = textInput.value;
  const trimmedText = text.trim();
  const wordCount = trimmedText === "" ? 0 : trimmedText.split(/\s+/).length;
  const characterCount = text.length;

  wordCountResult.textContent = `Word count: ${wordCount}`;
  characterCountResult.textContent = `Character count: ${characterCount}`;
}

textInput.addEventListener("input", updateCounts);
updateCounts();
