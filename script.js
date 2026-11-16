const textInput = document.querySelector("#text-input");
const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const wordCountResult = document.querySelector("#word-count");
const characterCountResult = document.querySelector("#character-count");
const readingTimeResult = document.querySelector("#reading-time");
const sentenceCountResult = document.querySelector("#sentence-count");
const paragraphCountResult = document.querySelector("#paragraph-count");
const averageSentenceLengthResult = document.querySelector("#average-sentence-length");
const longestSentenceResult = document.querySelector("#longest-sentence");
const keywordsResult = document.querySelector("#keywords-result");
const hashtagsResult = document.querySelector("#hashtags-result");
const summaryLengthSelect = document.querySelector("#summary-length");
const summarizeButton = document.querySelector("#summarize-button");
const summaryResult = document.querySelector("#summary-result");
const paraphraseButton = document.querySelector("#paraphrase-button");
const paraphraseResult = document.querySelector("#paraphrase-result");
const copySummaryButton = document.querySelector("#copy-summary-button");
const copyParaphraseButton = document.querySelector("#copy-paraphrase-button");
const downloadResultsButton = document.querySelector("#download-results-button");
const actionStatus = document.querySelector("#action-status");
const draftStatus = document.querySelector("#draft-status");
const clearTextButton = document.querySelector("#clear-text-button");

const WORDS_PER_MINUTE = 200;
const DRAFT_STORAGE_KEY = "text-hashtag-analyzer-draft";
const SUMMARY_LENGTH_RATIOS = {
  short: 0.2,
  standard: 1 / 3,
  detailed: 0.5
};
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

let currentSummary = "";
let currentParaphrase = "";

function countWords(text) {
  const trimmedText = text.trim();
  return trimmedText === "" ? 0 : trimmedText.split(/\s+/).length;
}

function activateTab(selectedTab, moveFocus = false) {
  for (const tab of tabs) {
    const isSelected = tab === selectedTab;
    const panel = document.querySelector(`#${tab.getAttribute("aria-controls")}`);

    tab.setAttribute("aria-selected", String(isSelected));
    tab.tabIndex = isSelected ? 0 : -1;
    panel.hidden = !isSelected;
  }

  if (moveFocus) {
    selectedTab.focus();
  }
}

function handleTabKeydown(event, currentTab) {
  const currentIndex = tabs.indexOf(currentTab);
  let nextIndex;

  if (event.key === "ArrowRight") {
    nextIndex = (currentIndex + 1) % tabs.length;
  } else if (event.key === "ArrowLeft") {
    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  } else if (event.key === "Home") {
    nextIndex = 0;
  } else if (event.key === "End") {
    nextIndex = tabs.length - 1;
  } else {
    return;
  }

  event.preventDefault();
  activateTab(tabs[nextIndex], true);
}

function getSentences(text) {
  const matches = text.match(/[^.!?]+[.!?]*/g) || [];
  return matches.map((sentence) => sentence.trim()).filter(Boolean);
}

function getParagraphs(text) {
  const trimmedText = text.trim();
  if (trimmedText === "") {
    return [];
  }

  return trimmedText.split(/\n\s*\n/).filter((paragraph) => paragraph.trim() !== "");
}

function getMeaningfulWords(text) {
  const words = text.toLowerCase().match(/[a-z0-9']+/g) || [];
  return words.filter((word) => !STOP_WORDS.has(word));
}

function getKeywordCounts(text) {
  const counts = new Map();

  for (const word of getMeaningfulWords(text)) {
    const currentCount = counts.get(word) || 0;
    counts.set(word, currentCount + 1);
  }

  return Array.from(counts.entries())
    .sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0]))
    .slice(0, 5);
}

function getHashtagCounts(text) {
  const hashtags = text.match(/#[A-Za-z0-9_]+/g) || [];
  const counts = new Map();

  for (const hashtag of hashtags) {
    const normalizedHashtag = hashtag.toLowerCase();
    const existingEntry = counts.get(normalizedHashtag);

    if (existingEntry) {
      existingEntry.count += 1;
    } else {
      counts.set(normalizedHashtag, { label: hashtag, count: 1 });
    }
  }

  return Array.from(counts.values());
}

function updateTextAnalysis() {
  const text = textInput.value;
  const wordCount = countWords(text);
  const characterCount = text.length;
  const readingMinutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  const sentences = getSentences(text);
  const paragraphs = getParagraphs(text);
  const sentenceWordCounts = sentences.map((sentence) => countWords(sentence));
  const totalSentenceWords = sentenceWordCounts.reduce((total, count) => total + count, 0);
  const averageSentenceLength = sentences.length === 0
    ? 0
    : totalSentenceWords / sentences.length;
  const longestSentenceLength = sentenceWordCounts.reduce(
    (longest, count) => Math.max(longest, count),
    0
  );
  const topKeywords = getKeywordCounts(text);
  const hashtags = getHashtagCounts(text);

  wordCountResult.textContent = `Word count: ${wordCount}`;
  characterCountResult.textContent = `Character count: ${characterCount}`;
  readingTimeResult.textContent = `Estimated reading time: ${readingMinutes} min`;
  sentenceCountResult.textContent = `Sentence count: ${sentences.length}`;
  paragraphCountResult.textContent = `Paragraph count: ${paragraphs.length}`;
  averageSentenceLengthResult.textContent = `Average sentence length: ${averageSentenceLength.toFixed(1)} words`;
  longestSentenceResult.textContent = `Longest sentence: ${longestSentenceLength} words`;
  keywordsResult.textContent = topKeywords.length === 0
    ? "Top keywords: none"
    : `Top keywords: ${topKeywords.map(([word, count]) => `${word} (${count})`).join(", ")}`;
  hashtagsResult.textContent = hashtags.length === 0
    ? "Hashtags: none"
    : `Hashtags: ${hashtags.map(({ label, count }) => `${label} (${count})`).join(", ")}`;

  currentSummary = "";
  currentParaphrase = "";
  summaryResult.textContent = "Select Create summary to analyze the current text.";
  paraphraseResult.textContent = "Select Paraphrase to apply the local phrase rules.";
  actionStatus.textContent = "";
}

function getSummarySentenceCount(sentenceCount) {
  const selectedRatio = SUMMARY_LENGTH_RATIOS[summaryLengthSelect.value]
    || SUMMARY_LENGTH_RATIOS.standard;
  return Math.max(1, Math.ceil(sentenceCount * selectedRatio));
}

function summarizeText() {
  const sentences = getSentences(textInput.value);
  currentSummary = "";

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

  const summarySentenceCount = getSummarySentenceCount(sentences.length);
  const selectedSentences = sentenceScores
    .sort((first, second) => second.score - first.score || first.index - second.index)
    .slice(0, summarySentenceCount)
    .sort((first, second) => first.index - second.index)
    .map((item) => item.sentence);

  currentSummary = selectedSentences.join(" ");
  summaryResult.textContent = currentSummary;
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
  currentParaphrase = "";

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

  currentParaphrase = paraphrasedText;
  paraphraseResult.textContent = currentParaphrase;
}

async function copyResult(text, label) {
  if (text === "") {
    actionStatus.textContent = `Create a ${label.toLowerCase()} first.`;
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    actionStatus.textContent = `${label} copied to clipboard.`;
  } catch {
    actionStatus.textContent = `Clipboard access is unavailable. You can select and copy the displayed ${label.toLowerCase()} manually.`;
  }
}

function downloadGeneratedText() {
  const sections = [];

  if (currentSummary !== "") {
    sections.push(`Summary:\n${currentSummary}`);
  }
  if (currentParaphrase !== "") {
    sections.push(`Paraphrase:\n${currentParaphrase}`);
  }
  if (sections.length === 0) {
    actionStatus.textContent = "Create a summary or paraphrase before downloading.";
    return;
  }

  const file = new Blob([sections.join("\n\n")], { type: "text/plain" });
  const fileUrl = URL.createObjectURL(file);
  const downloadLink = document.createElement("a");
  downloadLink.href = fileUrl;
  downloadLink.download = "text-analyzer-results.txt";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
  actionStatus.textContent = "Downloaded generated text.";
}

function saveDraft() {
  try {
    localStorage.setItem(DRAFT_STORAGE_KEY, textInput.value);
    draftStatus.textContent = "Draft saved in this browser.";
  } catch {
    draftStatus.textContent = "Draft saving is unavailable in this browser.";
  }
}

function loadDraft() {
  try {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft !== null) {
      textInput.value = savedDraft;
      draftStatus.textContent = "Restored the draft saved in this browser.";
    }
  } catch {
    draftStatus.textContent = "Draft saving is unavailable in this browser.";
  }
}

function clearTextAndDraft() {
  textInput.value = "";

  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    draftStatus.textContent = "Text and saved draft cleared.";
  } catch {
    draftStatus.textContent = "Text cleared, but browser storage could not be changed.";
  }

  updateTextAnalysis();
}

textInput.addEventListener("input", () => {
  updateTextAnalysis();
  saveDraft();
});
for (const tab of tabs) {
  tab.addEventListener("click", () => activateTab(tab));
  tab.addEventListener("keydown", (event) => handleTabKeydown(event, tab));
}
summaryLengthSelect.addEventListener("change", () => {
  if (currentSummary !== "") {
    summarizeText();
  }
});
summarizeButton.addEventListener("click", summarizeText);
paraphraseButton.addEventListener("click", paraphraseText);
copySummaryButton.addEventListener("click", () => copyResult(currentSummary, "Summary"));
copyParaphraseButton.addEventListener("click", () => copyResult(currentParaphrase, "Paraphrase"));
downloadResultsButton.addEventListener("click", downloadGeneratedText);
clearTextButton.addEventListener("click", clearTextAndDraft);

loadDraft();
updateTextAnalysis();
activateTab(tabs[0]);
