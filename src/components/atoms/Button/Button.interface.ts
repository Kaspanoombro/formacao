/**
 * Configuration options for creating a Button instance
 */
export interface ButtonOptions {
  /** The text to display on the button */
  text: string;
  /** Callback function to execute when the button is clicked */
  onClick: () => void;
  /** Optional CSS classes to apply to the button */
  className?: string;
}
