
import { createElement } from 'react';
import htm from 'htm';

const html = htm.bind(createElement);

export const Spinner = () => (
  html`<div className="ml-4 animate-spin rounded-full h-6 w-6 border-b-2 border-teal-400"></div>`
);
