export interface OrthographyResponse {
  is_correct: boolean;
  corrected_text: string;
  errors: string[];
  suggestions: string[];
  correct_label: string;
  uncorrect_label: string;
  suggestions_label: string;
  mistakes_label: string;
}
