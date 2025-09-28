export interface InputElement extends HTMLElement {
  value: string;
  isValid: boolean;
  focus(): void;
  blur(): void;
  setError(message: string): void;
  clearError(): void;
  onChange: (value: string, isValid: boolean) => void;
}

export interface ButtonElement extends HTMLElement {
  setDisabled(disabled: boolean): void;
  setText(text: string): void;
  onClick: () => void;
}
