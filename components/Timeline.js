
import { createElement } from 'react';
import htm from 'htm';
import { TimelineItem } from './TimelineItem.js';
import { EraHeader } from './EraHeader.js';
import { ExportButtons } from './ExportButtons.js';
import { handleExport, formatTimelineForExport } from '../utils/exportUtils.js';

const html = htm.bind(createElement);

export const Timeline = ({ events, eventsToExport, searchTerm, onSearchChange, collapsedEras, onToggleEra }) => {
  const onExport = (format) => {
    handleExport(
      format, 
      'Biblical_Chronology_Timeline', 
      eventsToExport, 
      formatTimelineForExport
    );
  };

  const elementsToRender = [];
  let currentEraIsCollapsed = false;
  let eventCounter = 0;

  events.forEach((item, index) => {
    if (item.type === 'era_header') {
      currentEraIsCollapsed = collapsedEras.has(item.id);
      elementsToRender.push(
        html`
        <${EraHeader}
          key=${item.id}
          id=${item.id}
          title=${item.title}
          isCollapsed=${currentEraIsCollapsed}
          onToggle=${() => onToggleEra(item.id)}
        />
        `
      );
    } else { // It's a BibleEvent
      if (!currentEraIsCollapsed) {
        elementsToRender.push(
          html`
          <${TimelineItem}
            key=${`${item.year}-${item.era}-${item.description.slice(0, 10)}-${index}`}
            event=${item}
            index=${eventCounter}
          />
          `
        );
        eventCounter++;
      }
    }
  });

  return (
    html`
    <div className="relative bg-slate-800/60 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-700">
      <div className="bg-slate-800/80 -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 px-4 sm:px-6 py-4 rounded-t-xl mb-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 justify-between sm:items-center">
            <h2 className="text-2xl font-bold text-teal-300">Browse Chronology</h2>
            <${ExportButtons} onExport=${onExport} disabled=${eventsToExport.length === 0} />
        </div>
        <div className="relative mt-4">
            <label htmlFor="timeline-search" className="sr-only">Search Events</label>
            <input
                id="timeline-search"
                type="text"
                placeholder="Search events (e.g., David, Temple, Exodus)"
                value=${searchTerm}
                onChange=${e => onSearchChange(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>
      </div>
      
      ${events.length === 0 && !searchTerm && html`
        <div className="text-center py-10 text-slate-400">Loading timeline data...</div>
      `}
      
      <div className="relative mt-4">
        ${elementsToRender}
      </div>
      
      ${events.length > 0 && elementsToRender.filter(el => el.type === TimelineItem).length === 0 && searchTerm && html`
        <div className="text-center py-10 text-slate-400">
          <p>No events found for "${searchTerm}".</p>
        </div>
      `}
    </div>
    `
  );
};
