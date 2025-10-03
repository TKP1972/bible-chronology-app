import { createElement } from 'react';
import htm from 'htm';

const html = htm.bind(createElement);

export const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    html`
    <div className="border-b border-slate-700 overflow-x-auto">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        ${tabs.map((tab) => (
          html`<button
            key=${tab}
            onClick=${() => setActiveTab(tab)}
            className=${`${
              activeTab === tab
                ? 'border-teal-400 text-teal-300'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 focus:outline-none`}
            aria-current=${activeTab === tab ? 'page' : undefined}
          >
            ${tab}
          </button>`
        ))}
      </nav>
    </div>
    `
  );
};
