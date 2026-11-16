# Text & Hashtag Analyzer

A small browser app built with plain HTML, CSS, and JavaScript. It analyzes text locally in the browser and does not use a framework, database, or API.

The tools are organized into keyboard-accessible **Analyze**, **Summarize**, and **Paraphrase** tabs.

## Features

- Live word count. Words are separated by whitespace.
- Live character count, including spaces and line breaks.
- Estimated reading time at 200 words per minute, rounded up to whole minutes.
- Sentence and paragraph counts, average sentence length, and longest sentence length.
- The five most frequent meaningful English words.
- Hashtag extraction and case-insensitive occurrence counts for tags made from letters, digits, and underscores.
- A simple extractive summarizer. Enter at least two sentences and select **Summarize** to see selected sentences from the original text.
- Short, standard, and detailed summary lengths.
- A rule-based paraphraser that rewrites a small set of predefined phrases locally, without an API.
- Copy buttons and a text file download for generated summaries and paraphrases.
- Automatic draft saving in this browser, with a control to clear the text and saved draft.

## Run the app

Open `index.html` in a browser. No build or installation step is needed.

The hosted version is available at <https://bishwa011.github.io/text-hashtag-analyzer/>.

Use the tab buttons to switch tools. The left/right arrow keys move between tabs; Home and End move to the first and last tab.

## How the summarizer works

1. Split the input into sentences at `.`, `!`, and `?` punctuation.
2. Lowercase each sentence and find words, ignoring a short list of common English words such as “the” and “and.”
3. Count how often meaningful words appear in the text.
4. Score each sentence by the average frequency of its meaningful words.
5. Select about one-third of the sentences with the highest scores, then display them in their original order.

This is a small educational heuristic. It selects existing sentences; it does not understand or rewrite their meaning like an AI summarizer. Sentence splitting is punctuation-based and works best with ordinary English sentences.

The summary is cleared when the input changes. Select **Summarize** again to analyze the updated text.
The summary length menu selects approximately 20%, 33%, or 50% of the input sentences, rounding up and keeping the selected sentences in their original order.

## How paraphrasing works

Select **Paraphrase** to apply these case-insensitive phrase substitutions to a separate result, leaving the input unchanged:

- “in order to” → “to”
- “at this point in time” → “now”
- “due to the fact that” → “because”
- “in the event that” → “if”
- “for the purpose of” → “for”

The tool preserves initial capitalization. Text with none of these phrases is left unchanged and reported as such. This is a limited rule-based rewriter, not a context-aware paraphraser.

## Other local analysis and storage

Sentence splitting uses `.`, `!`, and `?`, and paragraph counting uses blank lines. These simple rules work best with ordinary English text. Keyword counts omit a short list of common English words. Hashtags are matched as `#` followed by one or more English letters, digits, or underscores; casing is ignored when counting.

The current draft is automatically stored in this browser's local storage and restored on the next visit to this site. It does not sync to another browser or device. **Clear text and saved draft** removes it from this browser. Copying uses the browser clipboard and may be unavailable when opening the files directly; it is supported on the hosted HTTPS page.

## Current limits

This is a single-user static app. It has no real account login or shared profile. Real accounts and cross-device data would need a backend or authentication service.
