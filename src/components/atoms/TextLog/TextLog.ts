import type { TextLogOptions, LogEntry } from './TextLog.interface.ts';
import htmlTemplate from './TextLog.html?raw';
import cssStyles from './TextLog.css?raw';

/**
 * Text Log Web Component <text-log>
 * Displays a log of text entries with questions and answers
 */
export function createTextLog(options: TextLogOptions): HTMLElement {
  const element = document.createElement('text-log');

  if (options.title) element.setAttribute('title', options.title);
  if (options.maxEntries) element.setAttribute('max-entries', options.maxEntries.toString());
  if (options.autoScroll !== undefined) element.setAttribute('auto-scroll', options.autoScroll.toString());
  if (options.showTimestamp !== undefined) element.setAttribute('show-timestamp', options.showTimestamp.toString());
  if (options.allowClear !== undefined) element.setAttribute('allow-clear', options.allowClear.toString());
  if (options.size) element.setAttribute('size', options.size);
  if (options.theme) element.setAttribute('theme', options.theme);

  // Set data source
  (element as TextLog).dataSource = options.dataSource;

  return element;
}

class TextLog extends HTMLElement {
  private containerEl!: HTMLDivElement;
  private messagesEl!: HTMLDivElement;
  private emptyStateEl!: HTMLDivElement;
  private clearBtn!: HTMLButtonElement;
  private scrollBtn!: HTMLButtonElement;
  private countEl!: HTMLSpanElement;
  private statusEl!: HTMLSpanElement;

  public dataSource: LogEntry[] = [];
  private lastKnownLength = 0;
  private checkInterval?: ReturnType<typeof setInterval>;

  static get observedAttributes() {
    return [
      'title', 'max-entries', 'auto-scroll', 'show-timestamp',
      'allow-clear', 'size', 'theme'
    ];
  }

  connectedCallback() {
    this.loadTemplate();
    this.setupEventListeners();
    this.startObserving();
    this.updateDisplay();
  }

  disconnectedCallback() {
    this.stopObserving();
    this.removeEventListeners();
  }

  private loadTemplate() {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlTemplate;
      const template = tempDiv.querySelector('#text-log-template') as HTMLTemplateElement;

      if (!template) {
        throw new Error('Template #text-log-template not found');
      }

      // Load CSS if not already loaded
      if (!document.querySelector('style[data-component="text-log"]')) {
        const style = document.createElement('style');
        style.setAttribute('data-component', 'text-log');
        style.textContent = cssStyles;
        document.head.appendChild(style);
      }

      const content = template.content.cloneNode(true) as DocumentFragment;
      this.containerEl = content.querySelector('.text-log') as HTMLDivElement;
      this.messagesEl = content.querySelector('.text-log__messages') as HTMLDivElement;
      this.emptyStateEl = content.querySelector('.text-log__empty-state') as HTMLDivElement;
      this.clearBtn = content.querySelector('.text-log__clear-btn') as HTMLButtonElement;
      this.scrollBtn = content.querySelector('.text-log__scroll-btn') as HTMLButtonElement;
      this.countEl = content.querySelector('.text-log__count') as HTMLSpanElement;
      this.statusEl = content.querySelector('.text-log__status') as HTMLSpanElement;

      this.appendChild(content);
      this.updateFromAttributes();

    } catch {
      this.renderFallback();
    }
  }

  private renderFallback() {
    this.innerHTML = `
      <div class="text-log">
        <div class="text-log__header">
          <h3 class="text-log__title">Log</h3>
          <div class="text-log__controls">
            <button class="text-log__clear-btn">🗑️</button>
            <button class="text-log__scroll-btn">⬇️</button>
          </div>
        </div>
        <div class="text-log__content">
          <div class="text-log__messages"></div>
          <div class="text-log__empty-state">
            <p>Empty</p>
          </div>
        </div>
        <div class="text-log__footer">
          <span class="text-log__count">0 mensagens</span>
          <span class="text-log__status"></span>
        </div>
      </div>
    `;

    this.containerEl = this.querySelector('.text-log') as HTMLDivElement;
    this.messagesEl = this.querySelector('.text-log__messages') as HTMLDivElement;
    this.emptyStateEl = this.querySelector('.text-log__empty-state') as HTMLDivElement;
    this.clearBtn = this.querySelector('.text-log__clear-btn') as HTMLButtonElement;
    this.scrollBtn = this.querySelector('.text-log__scroll-btn') as HTMLButtonElement;
    this.countEl = this.querySelector('.text-log__count') as HTMLSpanElement;
    this.statusEl = this.querySelector('.text-log__status') as HTMLSpanElement;

    this.updateFromAttributes();
  }

  private updateFromAttributes() {
    if (!this.containerEl) return;

    // Update title
    const title = this.getAttribute('title');
    if (title) {
      const titleEl = this.querySelector('.text-log__title');
      if (titleEl) titleEl.textContent = title;
    }

    // Update container classes
    const size = this.getAttribute('size');
    if (size) {
      this.containerEl.classList.remove('compact', 'large');
      if (size !== 'medium') {
        this.containerEl.classList.add(size);
      }
    }

    const theme = this.getAttribute('theme');
    if (theme) {
      this.containerEl.classList.remove('light', 'dark');
      if (theme !== 'light') {
        this.containerEl.classList.add(theme);
      }
    }

    // Update clear button visibility
    const allowClear = this.getAttribute('allow-clear') !== 'false';
    if (this.clearBtn) {
      this.clearBtn.style.display = allowClear ? 'flex' : 'none';
    }
  }

  private setupEventListeners() {
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', this.handleClear.bind(this));
    }

    if (this.scrollBtn) {
      this.scrollBtn.addEventListener('click', this.handleScrollToBottom.bind(this));
    }
  }

  private removeEventListeners() {
    if (this.clearBtn) {
      this.clearBtn.removeEventListener('click', this.handleClear.bind(this));
    }

    if (this.scrollBtn) {
      this.scrollBtn.removeEventListener('click', this.handleScrollToBottom.bind(this));
    }
  }

  private startObserving() {
    // Observa mudanças no array de dados
    this.checkForChanges();

    // Configura um intervalo para verificar mudanças
    this.checkInterval = setInterval(() => {
      this.checkForChanges();
    }, 100);
  }

  private stopObserving() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = undefined;
    }
  }

  private checkForChanges() {
    if (!this.dataSource || !Array.isArray(this.dataSource)) return;

    if (this.dataSource.length !== this.lastKnownLength) {
      this.lastKnownLength = this.dataSource.length;
      this.updateDisplay();

      // Auto scroll se habilitado
      const autoScroll = this.getAttribute('auto-scroll') !== 'false';
      if (autoScroll) {
        this.scrollToBottom();
      }
    }
  }

  private updateDisplay() {
    if (!this.messagesEl || !this.emptyStateEl) return;

    // Limpa mensagens existentes
    this.messagesEl.innerHTML = '';

    // Verifica se há mensagens
    if (!this.dataSource || this.dataSource.length === 0) {
      this.emptyStateEl.style.display = 'block';
      this.messagesEl.style.display = 'none';
    } else {
      this.emptyStateEl.style.display = 'none';
      this.messagesEl.style.display = 'flex';

      // Aplica limite máximo de entradas se especificado
      const maxEntries = parseInt(this.getAttribute('max-entries') || '0');
      let entriesToShow = this.dataSource;

      if (maxEntries > 0 && entriesToShow.length > maxEntries) {
        entriesToShow = entriesToShow.slice(-maxEntries);
      }

      // Renderiza cada entrada
      entriesToShow.forEach((entry) => {
        this.renderEntry(entry);
      });
    }

    this.updateFooter();
  }

  private renderEntry(entry: LogEntry) {
    const showTimestamp = this.getAttribute('show-timestamp') !== 'false';

    // Se a entrada contém tanto pergunta quanto resposta
    if (entry.question && entry.answer) {
      this.createMessageElement('question', entry.question, entry.timestamp, showTimestamp);
      this.createMessageElement('answer', entry.answer, entry.timestamp, showTimestamp);
    }
    // Se contém apenas pergunta ou resposta
    else if (entry.question) {
      this.createMessageElement('question', entry.question, entry.timestamp, showTimestamp);
    }
    else if (entry.answer) {
      this.createMessageElement('answer', entry.answer, entry.timestamp, showTimestamp);
    }
    // Handle entries with text and type (for chat messages)
    else if (entry.text && entry.type) {
      this.createMessageElement(entry.type, entry.text, entry.timestamp, showTimestamp);
    }
    // Handle entries with only type specified (info, error messages without question/answer)
    else if (entry.type) {
      this.createMessageElement(entry.type, '', entry.timestamp, showTimestamp);
    }
  }

  private createMessageElement(
    type: 'question' | 'answer' | 'info' | 'error' | 'user' | 'ai' | 'system',
    text: string,
    timestamp?: Date,
    showTimestamp = true
  ) {
    const messageEl = document.createElement('div');
    messageEl.className = `message-entry ${type}`;

    const headerEl = document.createElement('div');
    headerEl.className = 'message-header';

    const typeEl = document.createElement('span');
    typeEl.className = 'message-type';
    typeEl.textContent = this.getTypeLabel(type);

    headerEl.appendChild(typeEl);

    if (showTimestamp && timestamp) {
      const timestampEl = document.createElement('span');
      timestampEl.className = 'message-timestamp';
      timestampEl.textContent = this.formatTimestamp(timestamp);
      headerEl.appendChild(timestampEl);
    }

    const contentEl = document.createElement('div');
    contentEl.className = 'message-content';
    contentEl.textContent = text;

    messageEl.appendChild(headerEl);
    messageEl.appendChild(contentEl);

    this.messagesEl.appendChild(messageEl);
  }

  private getTypeLabel(type: string): string {
    const labels = {
      'question': 'Pergunta',
      'answer': 'Resposta',
      'info': 'Info',
      'error': 'Erro',
      'user': 'Utilizador',
      'ai': 'AI',
      'system': 'Sistema'
    };
    return labels[type as keyof typeof labels] || type;
  }

  private formatTimestamp(timestamp: Date): string {
    if (!timestamp) return '';

    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();

    // Se for hoje, mostra apenas hora
    if (diff < 24 * 60 * 60 * 1000) {
      return timestamp.toLocaleTimeString('pt-PT', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    // Se for mais antigo, mostra data
    return timestamp.toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private updateFooter() {
    if (!this.countEl) return;

    const count = this.dataSource ? this.dataSource.length : 0;
    this.countEl.textContent = `${count} ${count === 1 ? 'mensagem' : 'mensagens'}`;

    if (this.statusEl) {
      this.statusEl.textContent = count > 0 ? 'Atualizado agora' : '';
    }
  }

  private handleClear() {
    if (this.dataSource) {
      // Limpa o array de dados
      this.dataSource.length = 0;
      this.lastKnownLength = 0;
      this.updateDisplay();

      // Dispatch evento de limpeza
      this.dispatchEvent(new CustomEvent('log-cleared', {
        bubbles: true
      }));
    }
  }

  private handleScrollToBottom() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    const contentEl = this.querySelector('.text-log__content') as HTMLElement;
    if (contentEl) {
      contentEl.scrollTop = contentEl.scrollHeight;
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (oldValue === newValue) return;
    this.updateFromAttributes();

    if (name === 'max-entries' || name === 'show-timestamp') {
      this.updateDisplay();
    }
  }

  // Public API
  setDataSource(source: LogEntry[]) {
    this.dataSource = source || [];
    this.lastKnownLength = this.dataSource.length;
    this.updateDisplay();
  }

  addEntry(entry: LogEntry) {
    if (!entry.timestamp) {
      entry.timestamp = new Date();
    }

    if (!entry.id) {
      entry.id = `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    this.dataSource.push(entry);
    this.updateDisplay();

    const autoScroll = this.getAttribute('auto-scroll') !== 'false';
    if (autoScroll) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  clear() {
    this.handleClear();
  }

  scrollToTop() {
    const contentEl = this.querySelector('.text-log__content') as HTMLElement;
    if (contentEl) {
      contentEl.scrollTop = 0;
    }
  }

  exportLog(): LogEntry[] {
    return [...this.dataSource];
  }

  importLog(entries: LogEntry[]) {
    this.dataSource.length = 0;
    this.dataSource.push(...entries);
    this.updateDisplay();
  }
}

// Register the custom element
if (!customElements.get('text-log')) {
  customElements.define('text-log', TextLog);
}

/**
 * TextLog class for backwards compatibility and direct usage
 */
export class TextLogClass {
  private readonly element: TextLog;

  constructor(options: TextLogOptions) {
    this.element = createTextLog(options) as TextLog;
  }

  getElement(): HTMLElement {
    return this.element;
  }

  appendTo(parent: HTMLElement): void {
    parent.appendChild(this.element);
  }

  addEntry(entry: LogEntry): void {
    this.element.addEntry(entry);
  }

  clear(): void {
    this.element.clear();
  }

  scrollToBottom(): void {
    this.element.scrollToBottom();
  }

  scrollToTop(): void {
    this.element.scrollToTop();
  }

  exportLog(): LogEntry[] {
    return this.element.exportLog();
  }

  importLog(entries: LogEntry[]): void {
    this.element.importLog(entries);
  }

  set dataSource(source: LogEntry[]) {
    this.element.setDataSource(source);
  }

  get dataSource(): LogEntry[] {
    return this.element.dataSource;
  }
}