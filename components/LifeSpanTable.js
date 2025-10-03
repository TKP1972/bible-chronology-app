
import { createElement } from 'react';
import htm from 'htm';
import { lifeSpanData } from '../data/lifeSpanData.js';
import { CollapsibleSection } from './CollapsibleSection.js';
import { ExportButtons } from './ExportButtons.js';
import { handleExport, formatLifeSpanForExport } from '../utils/exportUtils.js';

const html = htm.bind(createElement);

export const LifeSpanTable = () => {
  const onExport = (format) => {
    handleExport(
      format,
      'Life_Span_Data',
      lifeSpanData,
      formatLifeSpanForExport
    );
  };
  
  const headerContent = html`<${ExportButtons} onExport=${onExport} />`;

  return (
    html`
    <${CollapsibleSection} title="Life Span" headerContent=${headerContent}>
      <p className="text-slate-400 mb-4 text-sm">
        Individuals whose age at death is recorded in the chronology.
      </p>
      <div className="overflow-x-auto max-h-80 rounded-lg border border-slate-700/50">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-teal-300 uppercase bg-slate-700/80 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-2">Name</th>
              <th scope="col" className="px-4 py-2">Age at Death</th>
              <th scope="col" className="px-4 py-2">Scripture</th>
            </tr>
          </thead>
          <tbody>
            ${lifeSpanData.map((person) => html`
              <tr key=${person.name} className="bg-slate-800/70 border-b border-slate-700 hover:bg-slate-700/50">
                <th scope="row" className="px-4 py-2 font-medium text-white whitespace-nowrap">${person.name}</th>
                <td className="px-4 py-2">${person.ageAtDeath}</td>
                <td className="px-4 py-2">${person.scripture}</td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    </${CollapsibleSection}>
    `
  );
};
