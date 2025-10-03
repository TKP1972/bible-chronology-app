import { createElement } from 'react';
import htm from 'htm';

const html = htm.bind(createElement);

const ExportButton = ({ onClick, disabled, format }) => (
  html`<button 
    onClick=${onClick} 
    disabled=${disabled}
    className="bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-200 text-xs font-semibold py-1 px-2.5 rounded-md transition-colors"
  >
    ${format}
  </button>`
);


export const ExportButtons = ({ onExport, disabled = false }) => {
  return (
    html`
    <div className="flex items-center space-x-2">
      <span className="text-xs font-semibold text-slate-400">Export:</span>
      <${ExportButton} onClick=${() => onExport('txt')} disabled=${disabled} format="TXT" />
      <${ExportButton} onClick=${() => onExport('md')} disabled=${disabled} format="MD" />
    </div>
    `
  );
};
