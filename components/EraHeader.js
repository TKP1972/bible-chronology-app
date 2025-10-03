
import { createElement } from 'react';
import htm from 'htm';

const html = htm.bind(createElement);

export const EraHeader = ({ id, title, isCollapsed, onToggle }) => {
  return (
    html`
    <div className="flex justify-center my-6 timeline-item-animate">
      <button
        onClick=${onToggle}
        aria-expanded=${!isCollapsed}
        aria-controls=${`era-content-${id}`}
        className="z-10 bg-slate-700/80 hover:bg-slate-600/80 backdrop-blur-sm text-teal-300 font-bold text-center text-sm md:text-base px-6 py-3 rounded-lg shadow-lg flex items-center w-full max-w-xl justify-between transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75"
      >
        <span>${title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className=${`w-5 h-5 transition-transform duration-300 ease-in-out ${!isCollapsed ? 'rotate-180' : 'rotate-0'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth=${2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
    `
  );
};
