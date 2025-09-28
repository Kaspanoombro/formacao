import './styles/style.css';
import { createHeader } from './components/organisms/Header/Header.ts';
import './components/organisms/PortugalWeather/PortugalWeather.ts';
import type { MenuItem } from './components/organisms/Header/MenuItem.interface.ts';
import './components/atoms/Button/Button.ts';
import './components/atoms/Input/Input.ts';
import './components/atoms/TextLog/TextLog.ts';
import './components/molecules/userQuestionEntry/userQuestionEntry.ts';
import { createChatAI } from './components/organisms/chatAI/chatAI.ts';

const menuItems: MenuItem[] = [
  { label: 'Home', href: '#' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contacts', href: '#contacts' },
];

const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  app.innerHTML = '';
  const header = createHeader('Training', menuItems);
  app.appendChild(header);

  // Use the Web Component for the weather organism
  const weather = document.createElement('pt-weather');
  app.appendChild(weather);

  // Create the AI chat component
  const chatAI = createChatAI({
    title: "AI Assistant",
    placeholder: "Ask your question...",
    submitButtonText: "Send",
    maxHeight: "500px",
    showTimestamps: true,
  });
  app.appendChild(chatAI);

}
