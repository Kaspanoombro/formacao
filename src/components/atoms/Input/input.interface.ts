export interface InputOptions {
  pattern?: string;
  onChange?: (value: string, isValid: boolean) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  type?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined' | 'filled';
}

export interface GenericInputElement extends HTMLElement {
  value: string;
  isValid: boolean;
  focus(): void;
  blur(): void;
  setCustomError(message: string): void;
  clearCustomError(): void;
  // propriedade pública exposta pelo componente para registar handler
  onChange?: (value: string, isValid: boolean) => void;
}