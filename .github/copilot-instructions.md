# AI Assistant Instructions for Component Development

## Project Architecture
- Follow Atomic Design principles: atoms → molecules → organisms
- Location: All components under `src/components/`
- Use pure JavaScript/TypeScript without frameworks
- Implement Web Components standard
- All services code are under `src/services/`
- Global CSS in `src/styles/`
- Global interfaces are under `src/interfaces/`

## Component File Structure
Each component should have its own folder with:
- `ComponentName.ts` - Main TypeScript logic
- `ComponentName.html` - HTML template
- `ComponentName.css` - Styles
- `ComponentName.interface.ts` - TypeScript interfaces
- `ComponentName.test.ts` - Unit tests

## Code Standards
- Use TypeScript for type safety
- Follow existing naming conventions
- Include comprehensive unit tests with Vitest
- Use ESLint and Prettier configurations
- Follow Stylelint rules for CSS

## Current Project Structure Reference
src/components/ 
    ├── atoms/ (basic UI elements) 
    ├── molecules/ (combinations of atoms)
    └── organisms/ (complex components)
src/interfaces
src/services
src/styles
public (not compiled files)