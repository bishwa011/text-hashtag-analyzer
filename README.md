# Text & Hashtag Analyzer

A small browser app built with plain HTML, CSS, and JavaScript. It analyzes text locally in the browser and does not use a framework, database, or API.

## Features

- Live word count. Words are separated by whitespace.
- Live character count, including spaces and line breaks.
- Estimated reading time at 200 words per minute, rounded up to whole minutes.
- A simple extractive summarizer. Enter at least two sentences and select **Summarize** to see selected sentences from the original text.
- A rule-based paraphraser that rewrites a small set of predefined phrases locally, without an API.

## Run the app

Open `index.html` in a browser. No build or installation step is needed.

The hosted version is available at <https://bishwa011.github.io/text-hashtag-analyzer/>.

## How the summarizer works

1. Split the input into sentences at `.`, `!`, and `?` punctuation.
2. Lowercase each sentence and find words, ignoring a short list of common English words such as “the” and “and.”
3. Count how often meaningful words appear in the text.
4. Score each sentence by the average frequency of its meaningful words.
5. Select about one-third of the sentences with the highest scores, then display them in their original order.

This is a small educational heuristic. It selects existing sentences; it does not understand or rewrite their meaning like an AI summarizer. Sentence splitting is punctuation-based and works best with ordinary English sentences.

The summary is cleared when the input changes. Select **Summarize** again to analyze the updated text.

## How paraphrasing works

Select **Paraphrase** to apply these case-insensitive phrase substitutions to a separate result, leaving the input unchanged:

- “in order to” → “to”
- “at this point in time” → “now”
- “due to the fact that” → “because”
- “in the event that” → “if”
- “for the purpose of” → “for”

The tool preserves initial capitalization. Text with none of these phrases is left unchanged and reported as such. This is a limited rule-based rewriter, not a context-aware paraphraser.
