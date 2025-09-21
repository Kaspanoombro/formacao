# Organismo: Header

Combina a marca (título) com o componente `Menu` para formar o cabeçalho do site.

- Ficheiro: `src/components/organisms/Header.ts`
- Função principal: `createHeader(title: string, items: MenuItem[]): HTMLElement`

## API

Parâmetros:

- `title`: Texto do título/branding apresentado no cabeçalho.
- `items`: Array de `MenuItem` (ver `src/interfaces/MenuItem.interface.ts`) para construir o menu.

Retorna:

- `HTMLElement` (`<header class="site-header">`) com a marca e o menu.

## Marcação gerada

```html
<header class="site-header">
  <div class="site-header__brand">
    <h1 class="site-header__title">Formação</h1>
  </div>
  <!-- componente Menu aqui -->
</header>
```

## Exemplo de utilização

```ts
import { createHeader } from '@/components/organisms/Header';
import type { MenuItem } from '@/interfaces/MenuItem.interface';

const items: MenuItem[] = [
  { label: 'Início', href: '#' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contacto', href: '#contacto' },
];

const header = createHeader('Formação', items);
document.body.appendChild(header);
```

## Estilos

- Estilização em `src/style.css`:
  - `.site-header` para o layout do cabeçalho.
  - `.site-header__title`/`.site-header__brand` para a marca.
  - O menu herda os estilos definidos para `.menu` e elementos internos.

## Acessibilidade

- Estrutura semântica com `<header>` e `<h1>`.
- O componente `Menu` interno trata o comportamento do botão e `aria-expanded`.

## Testes

- Testes unitários em `src/components/organisms/Header.test.ts`:
  - Verifica que o título é renderizado.
  - Garante que o menu é incluído e que contém 5 itens.
