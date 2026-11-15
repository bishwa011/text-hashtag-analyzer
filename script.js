const textInput = document.querySelector("#text-input");
const countButton = document.querySelector("#count-button");
const result = document.querySelector("#result");

countButton.addEventListener("click", () => {
  const text = textInput.value.trim();

  // Empty text has no words. Otherwise, split wherever whitespace appears.
  const words = text === "" ? [] : text.split(/\s+/);

  result.textContent = `Word count: ${words.length}`;
});
