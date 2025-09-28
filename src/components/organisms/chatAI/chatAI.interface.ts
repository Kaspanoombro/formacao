import type { LogEntry } from '../../atoms/TextLog/TextLog.interface.ts';

/**
 * Interface for TextLog element used in ChatAI component
 */
export interface TextLogElement extends HTMLElement {
  // Properties
  dataSource: LogEntry[];
  
  // Methods
  addEntry(entry: LogEntry): void;
  clear(): void;
  scrollToBottom(): void;
  scrollToTop(): void;
  exportLog(): LogEntry[];
  importLog(entries: LogEntry[]): void;
  setDataSource(source: LogEntry[]): void;
  setAttribute(name: string, value: string): void;
}

/**
 * Interface for UserPrompt element used in ChatAI component
 */
export interface UserPromptElement extends HTMLElement {
  // Properties
  inputValue: string;
  readonly isValid: boolean;
  
  // Methods
  focus(): void;
  clear(): void;
  setInputError(message: string): void;
  clearInputError(): void;
  setAttribute(name: string, value: string): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  
  // Setters
  set buttonOnClick(handler: (inputValue: string) => void);
}

/**
 * Interface for user-submit event detail
 */
export interface UserSubmitEventDetail {
  value: string;
  isValid: boolean;
}

/**
 * Interface for user-submit custom event
 */
export interface UserSubmitEvent extends CustomEvent {
  detail: UserSubmitEventDetail;
}