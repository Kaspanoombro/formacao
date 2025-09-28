import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createTextLog } from './TextLog.ts';
import type { LogEntry, TextLogOptions } from './TextLog.interface.ts';

describe('Atom: TextLog (Log Display Component)', () => {
  beforeEach(() => {
    // Clean up any existing text logs
    document.body.innerHTML = '';
  });

  const mockLogEntries: LogEntry[] = [
    {
      id: '1',
      type: 'question',
      text: 'What is the weather like?',
      timestamp: new Date('2023-01-01T10:00:00Z')
    },
    {
      id: '2',
      type: 'answer',
      text: 'The weather is sunny today.',
      timestamp: new Date('2023-01-01T10:01:00Z')
    },
    {
      id: '3',
      type: 'error',
      text: 'Failed to fetch data',
      timestamp: new Date('2023-01-01T10:02:00Z')
    }
  ];

  describe('createTextLog function', () => {
    it('creates a text-log element with basic options', () => {
      const options: TextLogOptions = {
        dataSource: mockLogEntries
      };
      
      const textLog = createTextLog(options);
      
      expect(textLog.tagName).toBe('TEXT-LOG');
      expect(textLog).toBeInstanceOf(HTMLElement);
    });

    it('creates text log with title', () => {
      const options: TextLogOptions = {
        dataSource: mockLogEntries,
        title: 'Chat Log'
      };
      
      const textLog = createTextLog(options);
      expect(textLog.getAttribute('title')).toBe('Chat Log');
    });

    it('creates text log with max entries limit', () => {
      const options: TextLogOptions = {
        dataSource: mockLogEntries,
        maxEntries: 10
      };
      
      const textLog = createTextLog(options);
      expect(textLog.getAttribute('max-entries')).toBe('10');
    });

    it('creates text log with auto scroll enabled', () => {
      const options: TextLogOptions = {
        dataSource: mockLogEntries,
        autoScroll: true
      };
      
      const textLog = createTextLog(options);
      expect(textLog.hasAttribute('auto-scroll')).toBe(true);
    });

    it('creates text log with timestamp display', () => {
      const options: TextLogOptions = {
        dataSource: mockLogEntries,
        showTimestamp: true
      };
      
      const textLog = createTextLog(options);
      expect(textLog.hasAttribute('show-timestamp')).toBe(true);
    });

    it('creates text log with clear functionality', () => {
      const options: TextLogOptions = {
        dataSource: mockLogEntries,
        allowClear: true
      };
      
      const textLog = createTextLog(options);
      expect(textLog.hasAttribute('allow-clear')).toBe(true);
    });

    it('creates text log with size variant', () => {
      const options: TextLogOptions = {
        dataSource: mockLogEntries,
        size: 'large'
      };
      
      const textLog = createTextLog(options);
      expect(textLog.getAttribute('size')).toBe('large');
    });

    it('creates text log with theme', () => {
      const options: TextLogOptions = {
        dataSource: mockLogEntries,
        theme: 'dark'
      };
      
      const textLog = createTextLog(options);
      expect(textLog.getAttribute('theme')).toBe('dark');
    });
  });

  describe('TextLog Web Component', () => {
    it('observes all necessary attributes', () => {
      const TextLogComponent = customElements.get('text-log');
      const expectedAttributes = [
        'title', 'max-entries', 'auto-scroll', 
        'show-timestamp', 'allow-clear', 'size', 'theme'
      ];
      
      expect(TextLogComponent?.observedAttributes).toEqual(expectedAttributes);
    });

    it('sets and updates data source', () => {
      const textLog = createTextLog({ dataSource: [] });
      document.body.appendChild(textLog);

      textLog.setDataSource(mockLogEntries);
      expect(() => textLog.setDataSource(mockLogEntries)).not.toThrow();
    });

    it('adds individual log entries', () => {
      const textLog = createTextLog({ dataSource: [] });
      document.body.appendChild(textLog);

      const newEntry: LogEntry = {
        id: '4',
        type: 'info',
        text: 'New log entry',
        timestamp: new Date()
      };

      textLog.addEntry(newEntry);
      expect(() => textLog.addEntry(newEntry)).not.toThrow();
    });

    it('clears all log entries', () => {
      const textLog = createTextLog({ dataSource: mockLogEntries });
      document.body.appendChild(textLog);

      textLog.clear();
      expect(() => textLog.clear()).not.toThrow();
    });

    it('scrolls to bottom', () => {
      const textLog = createTextLog({ dataSource: mockLogEntries });
      document.body.appendChild(textLog);

      expect(() => textLog.scrollToBottom()).not.toThrow();
    });

    it('scrolls to top', () => {
      const textLog = createTextLog({ dataSource: mockLogEntries });
      document.body.appendChild(textLog);

      expect(() => textLog.scrollToTop()).not.toThrow();
    });

    it('exports log entries', () => {
      const textLog = createTextLog({ dataSource: mockLogEntries });
      document.body.appendChild(textLog);

      const exported = textLog.exportLog();
      expect(Array.isArray(exported)).toBe(true);
    });

    it('imports log entries', () => {
      const textLog = createTextLog({ dataSource: [] });
      document.body.appendChild(textLog);

      textLog.importLog(mockLogEntries);
      expect(() => textLog.importLog(mockLogEntries)).not.toThrow();
    });

    it('handles different log entry types', () => {
      const entries: LogEntry[] = [
        { type: 'question', text: 'Question text' },
        { type: 'answer', text: 'Answer text' },
        { type: 'info', text: 'Info text' },
        { type: 'error', text: 'Error text' },
        { type: 'user', text: 'User text' },
        { type: 'ai', text: 'AI text' },
        { type: 'system', text: 'System text' }
      ];

      const textLog = createTextLog({ dataSource: entries });
      document.body.appendChild(textLog);

      expect(textLog).toBeInstanceOf(HTMLElement);
    });

    it('handles entries with question and answer fields', () => {
      const qaEntries: LogEntry[] = [
        {
          id: '1',
          question: 'What is 2+2?',
          answer: '4',
          type: 'question',
          timestamp: new Date()
        }
      ];

      const textLog = createTextLog({ dataSource: qaEntries });
      document.body.appendChild(textLog);

      expect(textLog).toBeInstanceOf(HTMLElement);
    });

    it('formats timestamps correctly', () => {
      const entryWithTimestamp: LogEntry = {
        id: '1',
        type: 'info',
        text: 'Test with timestamp',
        timestamp: new Date('2023-01-01T10:00:00Z')
      };

      const textLog = createTextLog({ 
        dataSource: [entryWithTimestamp],
        showTimestamp: true
      });
      document.body.appendChild(textLog);

      expect(textLog).toBeInstanceOf(HTMLElement);
    });

    it('respects max entries limit', () => {
      const manyEntries: LogEntry[] = Array.from({ length: 20 }, (_, i) => ({
        id: i.toString(),
        type: 'info' as const,
        text: `Entry ${i}`,
        timestamp: new Date()
      }));

      const textLog = createTextLog({ 
        dataSource: manyEntries,
        maxEntries: 5
      });
      document.body.appendChild(textLog);

      expect(textLog).toBeInstanceOf(HTMLElement);
    });

    it('updates display when attributes change', () => {
      const textLog = createTextLog({ dataSource: mockLogEntries });
      document.body.appendChild(textLog);

      textLog.setAttribute('title', 'Updated Title');
      expect(textLog.getAttribute('title')).toBe('Updated Title');

      textLog.setAttribute('show-timestamp', '');
      expect(textLog.hasAttribute('show-timestamp')).toBe(true);

      textLog.removeAttribute('show-timestamp');
      expect(textLog.hasAttribute('show-timestamp')).toBe(false);
    });

    it('handles size variants', () => {
      const compactLog = createTextLog({ dataSource: [], size: 'compact' });
      expect(compactLog.getAttribute('size')).toBe('compact');

      const mediumLog = createTextLog({ dataSource: [], size: 'medium' });
      expect(mediumLog.getAttribute('size')).toBe('medium');

      const largeLog = createTextLog({ dataSource: [], size: 'large' });
      expect(largeLog.getAttribute('size')).toBe('large');
    });

    it('handles theme variants', () => {
      const lightLog = createTextLog({ dataSource: [], theme: 'light' });
      expect(lightLog.getAttribute('theme')).toBe('light');

      const darkLog = createTextLog({ dataSource: [], theme: 'dark' });
      expect(darkLog.getAttribute('theme')).toBe('dark');
    });
  });
});