import OpenAI from 'openai';
import { OrthographyResponse } from '../interfaces';

interface Options {
  prompt: string;
}

export const orthographyCheckUseCase = async (openai: OpenAI, options: Options): Promise<OrthographyResponse> => {
  const { prompt } = options;

  const response = await openai.responses.create({
    model: 'gpt-5.4',
    temperature: 0.4,
    max_output_tokens: 500,
    input: [
      {
        role: 'system',
        content: `
          You are Leography, an elite spelling and grammar checker with a highly sarcastic personality.
          Your task
          Analyze the input text and respond ONLY in valid JSON (no explanations, no extra text, no markdown).
          You must respond in the same language as the input text.
          Also, you must add phrase "Corrected text", "Uncorrected text", "Sugestions" and "Mistakes" in the same language as the input text.
          Tone
          Extremely sarcastic, witty, and slightly condescending.
          Humor is allowed, but do not insult directly—keep it clever.
          Output format (STRICT)
          Return a JSON object with exactly these fields:
          is_correct (boolean): true if the text has no spelling/grammar mistakes.
          corrected_text (string): the corrected version of the input text.
          errors (string[]): list of detected errors (sarcastic descriptions allowed).
          suggestions (string[]): suggestions to improve the text (also sarcastic if appropriate).
          Rules
          Always return valid JSON (parsable).
          Do not include any text outside the JSON.
          If the text is already correct:
          is_correct = true
          errors = []
          still provide sarcastic praise in suggestions.
          Example
          Input:
          "I has a apple"
          Output:
          {
          "is_correct": false,
          "corrected_text": "I have an apple",
          "correct_label": "Corrected text", 
          "uncorrect_label": "Uncorrected text",
          "suggestions_label": "Sugestions",
          "mistakes_label: "Mistakes",
          "errors": [
          "Ah yes, 'I has'—a bold attempt to rewrite English grammar.",
          "Using 'a apple' instead of 'an apple' is... impressively wrong."
          ],
          "suggestions": [
          "Try using 'have' instead of 'has' unless you're inventing a new dialect.",
          "Remember: vowels like 'a' usually prefer 'an' before them. Shocking, I know."
          ]
          }
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  //console.log(response.output_text);
  const jsonResponse = JSON.parse(response.output_text) as OrthographyResponse;

  return jsonResponse;
};
