const textInput = document.querySelector("#text-input");
const wordCountResult = document.querySelector("#word-count");
const characterCountResult = document.querySelector("#character-count");
const readingTimeResult = document.querySelector("#reading-time");

const WORDS_PER_MINUTE = 200;

function updateCounts() {
  const text = textInput.value;
  const trimmedText = text.trim();
  const wordCount = trimmedText === "" ? 0 : trimmedText.split(/\s+/).length;
  const characterCount = text.length;
  const readingMinutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

  wordCountResult.textContent = `Word count: ${wordCount}`;
  characterCountResult.textContent = `Character count: ${characterCount}`;
  readingTimeResult.textContent = `Estimated reading time: ${readingMinutes} min`;
}

textInput.addEventListener("input", updateCounts);
updateCounts();
