# Molécula: Menu

Rende um menu de navegação responsivo com botão hambúrguer em ecrãs pequenos.

- Ficheiro: `src/components/molecules/Menu.ts`
- Função principal: `createMenu(items: MenuItem[]): HTMLElement`

## API

Parâmetros:

- `items`: Array de `MenuItem` (ver `src/interfaces/MenuItem.interface.ts`), cada item com:
  - `label`: texto apresentado.
  - `href`: destino do link.

Retorna:

- `HTMLElement` (`<nav class="menu">`) contendo o botão de toggle e a lista de itens.

## Marcação gerada

Estrutura base inserida no DOM:

```html
<nav class="menu">
  <button class="menu__toggle" aria-label="Abrir menu" aria-expanded="false">
    <span class="menu__bar"></span><span class="menu__bar"></span><span class="menu__bar"></span>
  </button>
  <ul class="menu__list">
    <li class="menu__item"><a class="menu__link" href="#">Início</a></li>
    <!-- ... restantes itens -->
  </ul>
</nav>
```

## Exemplo de utilização

```ts
import { createMenu } from '@/components/molecules/Menu';
import type { MenuItem } from '@/interfaces/MenuItem.interface';

const items: MenuItem[] = [
  { label: 'Início', href: '#' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contacto', href: '#contacto' },
];

const menu = createMenu(items);
document.body.appendChild(menu);
```

## Acessibilidade

- O botão de abrir/fechar controla o estado através de `aria-expanded` e da classe `is-open` no
  `<nav>`.
- Use rótulos de link descritivos.
- A navegação é semântica: `<nav>` + `<ul>/<li>/<a>`.

## Comportamento responsivo

- Desktop: lista horizontal (`.menu__list`) visível.
- Mobile (`max-width: 768px`):
  - `.menu__toggle` fica visível.
  - A lista é escondida por omissão e mostrada verticalmente quando `.menu.is-open` é aplicada.
- Os estilos estão definidos em `src/style.css`.

## Testes

- Testes unitários em `src/components/molecules/Menu.test.ts`:
  - Verifica a renderização de 5 itens.
  - Verifica o comportamento de toggle (abrir/fechar) e `aria-expanded`.
