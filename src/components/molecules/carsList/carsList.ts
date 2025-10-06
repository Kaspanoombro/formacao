import { DBConnector } from '../../../services/DBConnector/DBConnector.service.ts';
import type { Car, CarsListRefs, CarsListProps } from './carsList.interface.ts';
import htmlTemplate from './carsList.html?raw';
import './carsList.css';

/**
 * Custom web component that displays a list of cars fetched from the database
 * Extends HTMLElement to provide a molecule-level component for showing
 * car data with ID and name, including loading and error states
 * 
 * @example
 * ```html
 * <!-- Basic usage -->
 * <cars-list></cars-list>
 * 
 * <!-- With custom title -->
 * <cars-list title="My Cars"></cars-list>
 * ```
 * 
 * @example
 * ```javascript
 * const carsList = document.createElement('cars-list');
 * carsList.setAttribute('title', 'Available Cars');
 * document.body.appendChild(carsList);
 * ```
 */
class CarsList extends HTMLElement {
  private dbConnector: DBConnector;
  private loadingEl: HTMLElement | null = null;
  private errorEl: HTMLElement | null = null;
  private listEl: HTMLElement | null = null;
  private titleEl: HTMLElement | null = null;

  /**
   * Defines which attributes should trigger attributeChangedCallback when modified
   * @returns Array of attribute names to observe ('title')
   */
  static get observedAttributes() {
    return ['title'];
  }

  constructor() {
    super();
    this.dbConnector = new DBConnector();
  }

  /**
   * Lifecycle method called when the element is connected to the DOM
   * Triggers initial rendering and data fetching
   */
  connectedCallback() {
    this.render();
    this.fetchAndDisplayCars();
  }

  /**
   * Lifecycle method called when observed attributes change
   * Updates the title when the title attribute changes
   */
  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (name === 'title' && this.titleEl) {
      this.titleEl.textContent = newValue || 'Cars List';
    }
  }

  /**
   * Renders the component's HTML structure
   * Creates the DOM elements from the HTML template
   * @private
   */
  private render() {
    this.innerHTML = htmlTemplate;
    
    // Get references to important elements
    this.loadingEl = this.querySelector('.cars-list__loading');
    this.errorEl = this.querySelector('.cars-list__error');
    this.listEl = this.querySelector('.cars-list__list');
    this.titleEl = this.querySelector('.cars-list__title');
    
    // Set initial title
    const titleAttr = this.getAttribute('title');
    if (this.titleEl && titleAttr) {
      this.titleEl.textContent = titleAttr;
    }
  }

  /**
   * Fetches cars data from the database and displays it
   * Handles loading and error states
   * @private
   */
  private async fetchAndDisplayCars() {
    this.showLoading();
    
    try {
      const result = await this.dbConnector.fetchCars();
      
      if (result.error || !result.data) {
        this.showError('Failed to load cars data');
        return;
      }
      
      this.displayCars(result.data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      this.showError('An unexpected error occurred');
    }
  }

  /**
   * Shows the loading state
   * @private
   */
  private showLoading() {
    if (this.loadingEl) this.loadingEl.style.display = 'flex';
    if (this.errorEl) this.errorEl.style.display = 'none';
    if (this.listEl) this.listEl.style.display = 'none';
  }

  /**
   * Shows an error message
   * @param message - Error message to display
   * @private
   */
  private showError(message: string) {
    if (this.loadingEl) this.loadingEl.style.display = 'none';
    if (this.errorEl) {
      this.errorEl.style.display = 'block';
      const errorMessageEl = this.errorEl.querySelector('.cars-list__error-message');
      if (errorMessageEl) {
        errorMessageEl.textContent = message;
      }
    }
    if (this.listEl) this.listEl.style.display = 'none';
  }

  /**
   * Displays the cars data in the list
   * @param cars - Array of car objects to display
   * @private
   */
  private displayCars(cars: Car[]) {
    if (this.loadingEl) this.loadingEl.style.display = 'none';
    if (this.errorEl) this.errorEl.style.display = 'none';
    
    if (!this.listEl) return;
    
    this.listEl.style.display = 'block';
    this.listEl.innerHTML = '';
    
    if (cars.length === 0) {
      const emptyEl = document.createElement('li');
      emptyEl.className = 'cars-list--empty';
      emptyEl.textContent = 'No cars found';
      this.listEl.appendChild(emptyEl);
      return;
    }
    
    cars.forEach(car => {
      const listItem = this.createCarListItem(car);
      this.listEl!.appendChild(listItem);
    });
  }

  /**
   * Creates a list item element for a car
   * @param car - Car object to create list item for
   * @returns HTML list item element
   * @private
   */
  private createCarListItem(car: Car): HTMLLIElement {
    const listItem = document.createElement('li');
    listItem.className = 'cars-list__item';
    
    const idEl = document.createElement('span');
    idEl.className = 'cars-list__item-id';
    idEl.textContent = `#${car.id}`;
    
    const nameEl = document.createElement('span');
    nameEl.className = 'cars-list__item-name';
    nameEl.textContent = car.name;
    
    listItem.appendChild(idEl);
    listItem.appendChild(nameEl);
    
    return listItem;
  }

  /**
   * Public method to refresh the cars list
   */
  public refresh() {
    this.fetchAndDisplayCars();
  }
}

// Register the custom element if not already registered
if (!customElements.get('cars-list')) {
  customElements.define('cars-list', CarsList);
}

/**
 * Factory function to create a CarsList component instance
 * Creates and configures a cars-list custom element
 * 
 * @param props - Configuration props for the component
 * @returns Reference object containing handles to the component elements
 * 
 * @example
 * ```javascript
 * import { createCarsList } from './carsList.ts';
 * 
 * // Create with default settings
 * const refs = createCarsList();
 * document.body.appendChild(refs.root);
 * 
 * // Create with custom title
 * const refs2 = createCarsList({ title: 'My Cars' });
 * document.body.appendChild(refs2.root);
 * ```
 */
export function createCarsList(props: CarsListProps = {}): CarsListRefs {
  const el = document.createElement('cars-list') as CarsList;
  
  if (props.title) {
    el.setAttribute('title', props.title);
  }
  
  // Ensure the element is rendered
  if ('connectedCallback' in el && typeof el.connectedCallback === 'function') {
    el.connectedCallback();
  }
  
  const listEl = el.querySelector('.cars-list__list') as HTMLElement || document.createElement('ul');
  
  return { 
    root: el as unknown as HTMLElement, 
    listEl 
  };
}

/**
 * Updates the cars list with new data
 * @param refs - Reference object from createCarsList
 * @param cars - Array of car objects to display
 */
export function updateCarsList(refs: CarsListRefs, cars: Car[]) {
  const carsListEl = refs.root as any;
  if (carsListEl && typeof carsListEl.displayCars === 'function') {
    carsListEl.displayCars(cars);
  }
}