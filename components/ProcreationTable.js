
import { createElement } from 'react';
import htm from 'htm';
import { procreationData } from '../data/procreationData.js';
import { CollapsibleSection } from './CollapsibleSection.js';
import { ExportButtons } from './ExportButtons.js';
import { handleExport, formatProcreationForExport } from '../utils/exportUtils.js';

const html = htm.bind(createElement);

export const ProcreationTable = () => {
  const onExport = (format) => {
    handleExport(
      format,
      'Procreation_Data',
      procreationData,
      formatProcreationForExport
    );
  };
  
  const headerContent = html`<${ExportButtons} onExport=${onExport} />`;

  return (
    html`
    <${CollapsibleSection} title="Procreation" headerContent=${headerContent}>
      <p className="text-slate-400 mb-4 text-sm">
        When key individuals fathered sons, based on the chronology.
      </p>
      <div className="overflow-x-auto max-h-80 rounded-lg border border-slate-700/50">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-teal-300 uppercase bg-slate-700/80 sticky top-0">
            <tr>
              <th scope="col" className="px-4 py-2">Father</th>
              <th scope="col" className="px-4 py-2">Son</th>
              <th scope="col" className="px-4 py-2">Father's Age</th>
              <th scope="col" className="px-4 py-2">Scripture</th>
            </tr>
          </thead>
          <tbody>
            ${procreationData.map((entry) => html`
              <tr key=${`${entry.father}-${entry.son}`} className="bg-slate-800/70 border-b border-slate-700 hover:bg-slate-700/50">
                <th scope="row" className="px-4 py-2 font-medium text-white whitespace-nowrap">${entry.father}</th>
                <td className="px-4 py-2">${entry.son}</td>
                <td className="px-4 py-2">${entry.fatherAgeAtBirth}</td>
                <td className="px-4 py-2">${entry.scripture}</td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    </${CollapsibleSection}>
    `
  );
};
