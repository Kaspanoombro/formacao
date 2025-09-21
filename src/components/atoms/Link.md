# Átomo: Link (Web Component)

Componente Web reutilizável para navegação interna e externa. Expõe o elemento personalizado
`<app-link>`, que renderiza um `<a>` no light DOM para que os estilos globais (ex.: `.menu__link`)
continuem a aplicar-se.

- Ficheiro: `src/components/atoms/Link.ts`
- Função principal: `createLink(text: string, href: string, options?: LinkOptions): HTMLElement`

## API

Parâmetros:

- `text`: Texto visível do link.
- `href`: URL ou hash de destino.
- `options` (opcional) do tipo `LinkOptions` (ver `src/interfaces/LinkOptions.interface.ts`):
  - `target`: por omissão `_self`. Se `_blank`, o `rel` seguro é aplicado automaticamente.
  - `rel`: relação do link. Se `target === '_blank'` e não for fornecido, usa
    `"noopener noreferrer"`.
  - `classes`: lista adicional de classes CSS para estilização (aplicadas ao `<a>` interno).

Atributos do `<app-link>`:

- `href`: destino do link (refletido no `<a>` interno).
- `target`: alvo do link.
- `rel`: relação do link (ajustado automaticamente quando `target="_blank"`).
- `text`: conteúdo textual a apresentar no `<a>` interno.
- `data-classes`: classes a aplicar ao `<a>` interno (separadas por espaço).

Retorna:

- `HTMLElement` (`<app-link>`) pronto a ser inserido no DOM.

## Marcação gerada

Exemplo de resultado no DOM:

```html
<app-link href="https://example.com/docs" target="_blank" data-classes="menu__link">
  <a href="https://example.com/docs" target="_blank" rel="noopener noreferrer" class="menu__link"
    >Documentação</a
  >
</app-link>
```

## Exemplo de utilização

```ts
import { createLink } from '@/components/atoms/Link';

const link = createLink('Documentação', 'https://example.com/docs', {
  target: '_blank',
  classes: ['menu__link'],
});

document.body.appendChild(link);
```

## Acessibilidade

- Mantém um `<a>` semântico no DOM, garantindo comportamento e acessibilidade nativos.
- Quando `target="_blank"` é usado, aplica `rel="noopener noreferrer"` por segurança.
- Garanta que o texto do link descreve o destino (evitar “clique aqui”).

## Estilos

- As classes passadas em `options.classes` (ou via `data-classes`) são aplicadas ao `<a>` interno,
  permitindo reutilizar estilos existentes como `.menu__link`.

## Testes

- Testes unitários em `src/components/atoms/Link.test.ts`:
  - Verifica que o elemento personalizado (`APP-LINK`) é criado e que o `<a>` interno recebe `href`,
    `target`, `rel` e classes adicionais.
