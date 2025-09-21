import './style.css';
import { createHeader } from './components/organisms/Header';
import './components/organisms/PortugalWeather';
import type { MenuItem } from './interfaces/MenuItem.interface';

const menuItems: MenuItem[] = [
  { label: 'Início', href: '#' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contacto', href: '#contacto' },
];

const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  app.innerHTML = '';
  const header = createHeader('Formação', menuItems);
  app.appendChild(header);

  // Use the Web Component for the weather organism
  const weather = document.createElement('pt-weather');
  app.appendChild(weather);
}
