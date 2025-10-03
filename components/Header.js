
import { createElement } from 'react';
import htm from 'htm';

const html = htm.bind(createElement);

export const Header = () => (
  html`
  <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-lg shadow-slate-900/50">
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-teal-400">Biblical Chronology Visualizer</h1>
      <p className="text-slate-400 mt-1">An Interactive Biblical & Historical Timeline</p>
    </div>
  </header>
  `
);
