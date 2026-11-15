const textInput = document.querySelector("#text-input");
const wordCountResult = document.querySelector("#word-count");
const characterCountResult = document.querySelector("#character-count");
const readingTimeResult = document.querySelector("#reading-time");
const summarizeButton = document.querySelector("#summarize-button");
const summaryResult = document.querySelector("#summary-result");
const paraphraseButton = document.querySelector("#paraphrase-button");
const paraphraseResult = document.querySelector("#paraphrase-result");

const WORDS_PER_MINUTE = 200;
const PARAPHRASE_RULES = [
  { pattern: /\bin\s+order\s+to\b/gi, replacement: "to" },
  { pattern: /\bat\s+this\s+point\s+in\s+time\b/gi, replacement: "now" },
  { pattern: /\bdue\s+to\s+the\s+fact\s+that\b/gi, replacement: "because" },
  { pattern: /\bin\s+the\s+event\s+that\b/gi, replacement: "if" },
  { pattern: /\bfor\s+the\s+purpose\s+of\b/gi, replacement: "for" }
];
const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "but", "by",
  "for", "from", "had", "has", "have", "he", "her", "him", "his",
  "i", "in", "is", "it", "its", "me", "my", "of", "on", "or", "our",
  "she", "that", "the", "their", "them", "there", "they", "this", "those",
  "to", "us", "was", "we", "were", "with", "you", "your"
]);

function updateCounts() {
  const text = textInput.value;
  const trimmedText = text.trim();
  const wordCount = trimmedText === "" ? 0 : trimmedText.split(/\s+/).length;
  const characterCount = text.length;
  const readingMinutes = Math.ceil(wordCount / WORDS_PER_MINUTE);

  wordCountResult.textContent = `Word count: ${wordCount}`;
  characterCountResult.textContent = `Character count: ${characterCount}`;
  readingTimeResult.textContent = `Estimated reading time: ${readingMinutes} min`;
  summaryResult.textContent = "Select Summarize to create a summary from the current text.";
  paraphraseResult.textContent = "Select Paraphrase to apply the local phrase rules.";
}

function getSentences(text) {
  const matches = text.match(/[^.!?]+[.!?]*/g) || [];
  return matches.map((sentence) => sentence.trim()).filter(Boolean);
}

function getMeaningfulWords(sentence) {
  const words = sentence.toLowerCase().match(/[a-z0-9']+/g) || [];
  return words.filter((word) => !STOP_WORDS.has(word));
}

function summarizeText() {
  const sentences = getSentences(textInput.value);

  if (sentences.length < 2) {
    summaryResult.textContent = "Enter at least two sentences to create a summary.";
    return;
  }

  const wordFrequencies = new Map();

  for (const sentence of sentences) {
    const words = getMeaningfulWords(sentence);

    for (const word of words) {
      const currentCount = wordFrequencies.get(word) || 0;
      wordFrequencies.set(word, currentCount + 1);
    }
  }

  const sentenceScores = sentences.map((sentence, index) => {
    const words = getMeaningfulWords(sentence);
    let totalScore = 0;

    for (const word of words) {
      totalScore += wordFrequencies.get(word) || 0;
    }

    const score = words.length === 0 ? 0 : totalScore / words.length;
    return { sentence, index, score };
  });

  const summarySentenceCount = Math.max(1, Math.ceil(sentences.length / 3));
  const selectedSentences = sentenceScores
    .sort((first, second) => second.score - first.score || first.index - second.index)
    .slice(0, summarySentenceCount)
    .sort((first, second) => first.index - second.index)
    .map((item) => item.sentence);

  summaryResult.textContent = selectedSentences.join(" ");
}

function preserveCapitalization(originalPhrase, replacement) {
  if (originalPhrase === originalPhrase.toUpperCase()) {
    return replacement.toUpperCase();
  }

  const startsWithCapital = originalPhrase[0] === originalPhrase[0].toUpperCase();
  return startsWithCapital
    ? replacement[0].toUpperCase() + replacement.slice(1)
    : replacement;
}

function paraphraseText() {
  const originalText = textInput.value;

  if (originalText.trim() === "") {
    paraphraseResult.textContent = "Enter some text to paraphrase.";
    return;
  }

  let paraphrasedText = originalText;

  for (const rule of PARAPHRASE_RULES) {
    paraphrasedText = paraphrasedText.replace(rule.pattern, (match) =>
      preserveCapitalization(match, rule.replacement)
    );
  }

  if (paraphrasedText === originalText) {
    paraphraseResult.textContent = "No supported phrases found. The original text is unchanged.";
    return;
  }

  paraphraseResult.textContent = paraphrasedText;
}

textInput.addEventListener("input", updateCounts);
summarizeButton.addEventListener("click", summarizeText);
paraphraseButton.addEventListener("click", paraphraseText);
updateCounts();
