/**
 * Series data for the chart
 */
export interface ChartSeries {
  /** Name of the series */
  name: string;
  /** Data points for the series */
  data: number[];
}

/**
 * Configuration options for creating a Chart instance
 */
export interface ChartOptions {
  /** Type of chart (bar, line, area, etc.) */
  type?: 'bar' | 'line' | 'area' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick';
  /** Series data for the chart */
  series: ChartSeries[];
  /** Categories for x-axis */
  categories?: (string | number)[];
  /** Width of the chart */
  width?: string | number;
  /** Height of the chart */
  height?: string | number;
  /** Optional CSS classes to apply to the chart container */
  className?: string;
}