/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    // Allow BEM-style class names: block, block__element, block--modifier, block__element--modifier
    // Lowercase, digits, hyphen allowed; underscores only as BEM element separator
    // Also allow simple kebab-case like "is-open" used as state class
    'selector-class-pattern': [
      /^(?:[a-z][a-z0-9]*(?:-[a-z0-9]+)*)((?:__(?:[a-z0-9]+(?:-[a-z0-9]+)*))?)(?:--[a-z0-9]+(?:-[a-z0-9]+)*)?$|^(?:is|has)-(?:[a-z0-9]+(?:-[a-z0-9]+)*)$/,
      {
        message:
          'Expected class selector to follow BEM (block__element--modifier) or state (is-/has-) kebab-case',
      },
    ],
  },
};
