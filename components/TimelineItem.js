
import { useState, createElement } from 'react';
import htm from 'htm';

const html = htm.bind(createElement);

export const TimelineItem = ({ event, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailsId = `details-${event.year}-${event.era}-${index}`;
  
  return (
    html`
    <div
      className=${`relative flex items-start mb-6 timeline-item-animate pl-8`}
      style=${{ animationDelay: `${Math.min(index * 20, 500)}ms` }}
    >
      <!-- Vertical line connector -->
      <div className="absolute left-[3.75rem] top-0 h-full w-0.5 bg-slate-700" aria-hidden="true"></div>
      
      <!-- Date Column -->
      <div className="w-20 text-right pr-6 flex-shrink-0 relative">
        <h3 className="font-bold text-md text-teal-300">${event.year}</h3>
        <p className="text-xs text-slate-400">${event.era}</p>
      </div>

      <!-- Event Column -->
      <div className=${`w-full bg-slate-800/70 rounded-lg shadow-lg shadow-slate-900/50 transition-all duration-300 border border-slate-700/50 p-3`}>
        <p className="text-slate-300 text-sm leading-relaxed">${event.description}</p>
        <button 
          onClick=${() => setIsExpanded(!isExpanded)} 
          className="mt-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
          aria-expanded=${isExpanded}
          aria-controls=${detailsId}
        >
            ${isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
        ${isExpanded && html`
            <div id=${detailsId} className="mt-2 text-left text-xs bg-slate-900/50 p-2 rounded max-h-40 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans text-slate-400">${event.fullText}</pre>
            </div>
        `}
      </div>
    </div>
    `
  );
};
