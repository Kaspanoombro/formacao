import htmlTemplate from './Chart.html?raw';
import cssStyles from './Chart.css?raw';
import type { ChartOptions, ChartSeries } from './Chart.interface.ts';
import ApexCharts from 'apexcharts';

/**
 * Custom web component that creates a reusable chart element using ApexCharts.
 * Extends HTMLElement to provide a custom chart with template loading,
 * configuration, and attribute observation capabilities.
 *
 * @example
 * ```HTML
 * <chart-box type="bar"></chart-box>
 * ```
 *
 * @example
 * ```JavaScript
 * const chart = document.createElement('chart-box');
 * chart.setAttribute('type', 'bar');
 * chart.setSeries([{ name: 'sales', data: [30, 40, 35, 50, 49, 60, 70, 91, 125] }]);
 * chart.setCategories([1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]);
 * document.body.appendChild(chart);
 * ```
 */
class ChartBox extends HTMLElement {
  /** The internal chart wrapper element */
  private chartWrapper!: HTMLElement;
  /** The ApexCharts instance */
  private chart?: ApexCharts;
  /** Chart series data */
  private seriesData: ChartSeries[] = [];
  /** X-axis categories */
  private categoriesData: (string | number)[] = [];
  /**
   * Defines which attributes should trigger attributeChangedCallback when modified
   * @returns Array of attribute names to observe
   */
  static get observedAttributes() {
    return ['type', 'width', 'height','series'];
  }

  /**
   * Lifecycle method called when the element is connected to the DOM
   * Loads the template and renders the chart
   */
  connectedCallback() {
    this.loadTemplate();
    this.renderChart();
  }

  /**
   * Lifecycle method called when the element is disconnected from the DOM
   * Destroys the chart instance to prevent memory leaks
   */
  disconnectedCallback() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  /**
   * Loads the chart template from an HTML file and applies styling
   * Falls back to inline HTML if template loading fails
   * @private
   */
  private loadTemplate() {
    try {
      // Inject CSS styles if not already injected
      if (!document.querySelector('style[data-component="chart-box"]')) {
        const style = document.createElement('style');
        style.setAttribute('data-component', 'chart-box');
        style.textContent = cssStyles;
        document.head.appendChild(style);
      }

      // Parse HTML template
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlTemplate;
      const template = tempDiv.querySelector('#chart-box-template') as HTMLTemplateElement;

      if (!template) {
        throw new Error('Template #chart-box-template not found');
      }

      // Clone template content
      const content = template.content.cloneNode(true) as DocumentFragment;
      this.chartWrapper = content.querySelector('.chart-wrapper') as HTMLElement;

      // Apply additional classes
      const className = this.getAttribute('class');
      if (className) {
        const container = content.querySelector('.chart-container');
        if (container) {
          container.classList.add(...className.split(' '));
        }
      }

      this.appendChild(content);
    } catch {
      this.renderFallback();
    }
  }

  /**
   * Creates a fallback chart container when template loading fails
   * @private
   */
  private renderFallback() {
    this.innerHTML = `
      <div class="chart-container">
        <div class="chart-wrapper"></div>
      </div>
    `;

    this.chartWrapper = this.querySelector('.chart-wrapper') as HTMLElement;

    // Apply additional classes
    const className = this.getAttribute('class');
    if (className) {
      const container = this.querySelector('.chart-container');
      if (container) {
        container.classList.add(...className.split(' '));
      }
    }
  }

  /**
   * Renders the ApexCharts chart with current configuration
   * @private
   */
  private renderChart() {
    if (!this.chartWrapper) return;

    // Default options
    const options = {
      chart: {
        type: this.getAttribute('type') || 'bar',
        width: this.getAttribute('width') || '100%',
        height: this.getAttribute('height') || '350'
      },
      series: this.seriesData.length > 0 ? this.seriesData : [
        {
          name: 'sales',
          data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
        }
      ],
      xaxis: {
        categories: this.categoriesData.length > 0 ? this.categoriesData : [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
      }
    };

    // Destroy previous chart if exists
    if (this.chart) {
      this.chart.destroy();
    }

    // Create and render new chart
    this.chart = new ApexCharts(this.chartWrapper, options);
    this.chart.render();
  }

  /**
   * Called when observed attributes change
   * Updates chart configuration based on attribute changes
   * @param name - The name of the changed attribute
   */
  attributeChangedCallback(name: string) {
    if (!this.chartWrapper || !this.chart) return;

    // Re-render chart when attributes change
    if (['type', 'width', 'height', 'series'].includes(name)) {
      this.renderChart();
    }
  }


  /**
   * Sets the chart series data
   * @param series - Array of series objects with name and data
   * @example
   * ```JavaScript
   * chart.setSeries([
   *   { name: 'sales', data: [30, 40, 35, 50, 49, 60, 70, 91, 125] }
   * ]);
   * ```
   */
  setSeries(series: ChartSeries[]): void {
    this.seriesData = series;
    if (this.chart) {
      this.renderChart();
    }
  }

  /**
   * Sets the x-axis categories
   * @param categories - Array of category labels
   * @example
   * ```JavaScript
   * chart.setCategories([1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]);
   * ```
   */
  setCategories(categories: (string | number)[]): void {
    this.categoriesData = categories;
    if (this.chart) {
      this.renderChart();
    }
  }

  /**
   * Updates the entire chart configuration
   * @param options - ApexCharts options object
   */
  updateOptions(options: ApexCharts.ApexOptions): void {
    if (this.chart) {
      this.chart.updateOptions(options);
    }
  }

  /**
   * Gets the underlying ApexCharts instance
   * @returns The ApexCharts instance
   */
  getChart(): ApexCharts | undefined {
    return this.chart;
  }
}

// Register the custom element
if (!customElements.get('chart-box')) {
  customElements.define('chart-box', ChartBox);
}

/**
 * Chart class for backwards compatibility and direct usage
 * Provides a convenient wrapper around the ChartBox web component
 *
 * @example
 * ```javascript
 * import { Chart } from './Chart.ts';
 *
 * const myChart = new Chart({
 *   type: 'bar',
 *   series: [{ name: 'sales', data: [30, 40, 35, 50, 49, 60, 70, 91, 125] }],
 *   categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
 *   className: 'my-custom-chart'
 * });
 *
 * myChart.appendTo(document.body);
 * ```
 */
export class Chart {
  /** The underlying ChartBox web component */
  private readonly element: ChartBox;

  /**
   * Creates a new Chart instance
   * @param options - Configuration options for the chart
   */
  constructor(options: ChartOptions) {
    this.element = document.createElement('chart-box') as ChartBox;

    if (options.type) {
      this.element.setAttribute('type', options.type);
    }

    if (options.width) {
      this.element.setAttribute('width', String(options.width));
    }

    if (options.height) {
      this.element.setAttribute('height', String(options.height));
    }

    if (options.className) {
      this.element.setAttribute('class', options.className);
    }

    if (options.series) {
      this.element.setSeries(options.series);
    }

    if (options.categories) {
      this.element.setCategories(options.categories);
    }
  }

  /**
   * Gets the underlying HTML element
   * @returns The ChartBox element
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Appends the chart to a parent element
   * @param parent - The parent element to append to
   */
  appendTo(parent: HTMLElement): void {
    parent.appendChild(this.element);
  }

  /**
   * Updates the chart series
   * @param series - New series data
   */
  setSeries(series: ChartSeries[]): void {
    this.element.setSeries(series);
  }

  /**
   * Updates the chart categories
   * @param categories - New categories
   */
  setCategories(categories: (string | number)[]): void {
    this.element.setCategories(categories);
  }

  /**
   * Updates chart options
   * @param options - ApexCharts options
   */
  updateOptions(options: ApexCharts.ApexOptions): void {
    this.element.updateOptions(options);
  }

  /**
   * Gets the ApexCharts instance
   * @returns The ApexCharts instance
   */
  getChart(): ApexCharts | undefined {
    return this.element.getChart();
  }

  /**
   * Removes the chart from the DOM
   */
  remove(): void {
    this.element.remove();
  }
}