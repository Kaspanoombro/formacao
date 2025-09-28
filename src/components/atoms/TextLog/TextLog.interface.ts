export interface LogEntry {
  question?: string;
  answer?: string;
  text?: string;
  type?: 'question' | 'answer' | 'info' | 'error' | 'user' | 'ai' | 'system';
  timestamp?: Date;
  id?: string;
}

export interface TextLogOptions {
  dataSource: LogEntry[];
  title?: string;
  maxEntries?: number;
  autoScroll?: boolean;
  showTimestamp?: boolean;
  allowClear?: boolean;
  size?: 'compact' | 'medium' | 'large';
  theme?: 'light' | 'dark';
}
