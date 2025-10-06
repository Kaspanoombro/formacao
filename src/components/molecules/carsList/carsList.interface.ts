/**
 * Interface for car data structure
 */
export interface Car {
  /** Unique identifier for the car */
  id: number;
  /** Name/model of the car */
  name: string;
}

/**
 * Reference object for accessing carsList component elements
 * Provides handles to the root element and internal list element
 * for external manipulation and updates
 */
export interface CarsListRefs {
  /** The root HTML element of the cars list component */
  root: HTMLElement;
  /** The internal list container element */
  listEl: HTMLElement;
}

/**
 * Props interface for carsList component configuration
 */
export interface CarsListProps {
  /** Title to display above the cars list */
  title?: string;
  /** Array of car objects to display */
  cars?: Car[];
  /** Whether to show loading state */
  loading?: boolean;
}