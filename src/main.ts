import './styles/style.css';
import { createHeader } from './components/organisms/Header/Header.ts';
import './components/organisms/PortugalWeather/PortugalWeather.ts';
import type { MenuItem } from './components/organisms/Header/MenuItem.interface.ts';
import './components/atoms/Chart/Chart.ts';
import './components/atoms/Button/Button.ts';
import './components/atoms/Input/Input.ts';
import './components/atoms/TextLog/TextLog.ts';
import './components/molecules/userQuestionEntry/userQuestionEntry.ts';
import './components/molecules/carsList/carsList.ts';
import { createChatAI } from './components/organisms/chatAI/chatAI.ts';
import { DBConnector } from './services/DBConnector/DBConnector.service.ts';

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
  const chart = document.createElement('chart-box');
  chart.setAttribute('series', [
    {
      name: 'sales',
      data: [130, 40, 35, 50, 49, 60, 70, 91, 125]
    }
  ]
  )
  app.appendChild(chart);

  // Create the cars list component
  const carsList = document.createElement('cars-list');
  carsList.setAttribute('title', 'Available Cars');
  app.appendChild(carsList);
  
  // Create the AI chat component
  const chatAI = createChatAI({
    title: "AI Assistant",
    placeholder: "Ask your question here...",
    submitButtonText: "Send",
    maxHeight: "500px",
    showTimestamps: true,
  });
  app.appendChild(chatAI);

}
