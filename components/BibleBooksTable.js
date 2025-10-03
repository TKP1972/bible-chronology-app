import { useState, useMemo, createElement } from 'react';
import htm from 'htm';
import { bibleBooksData } from '../data/bibleBooksData.js';
import { CollapsibleSection } from './CollapsibleSection.js';
import { ExportButtons } from './ExportButtons.js';
import { handleExport, formatBibleBooksForExport } from '../utils/exportUtils.js';

const html = htm.bind(createElement);

export const BibleBooksTable = () => {
  const [sortOrder, setSortOrder] = useState('canonical');
  const [scriptureFilter, setScriptureFilter] = useState('all');

  const processedData = useMemo(() => {
    let data = [...bibleBooksData];

    if (scriptureFilter === 'hebrew') {
        data = data.filter(book => book.canonicalOrder <= 39);
    } else if (scriptureFilter === 'greek') {
        data = data.filter(book => book.canonicalOrder > 39);
    }

    if (sortOrder === 'canonical') {
      return data.sort((a, b) => a.canonicalOrder - b.canonicalOrder);
    }
    
    return data.sort((a, b) => a.chronologicalOrder - b.chronologicalOrder);
  }, [sortOrder, scriptureFilter]);

  const onExport = (format) => {
    handleExport(
      format,
      `Bible_Books_(${sortOrder}_${scriptureFilter})`,
      processedData,
      formatBibleBooksForExport
    );
  };

  const headerContent = (
    html`
    <div className="flex items-center space-x-4 flex-wrap gap-2">
      <div className="flex items-center space-x-1 bg-slate-700/80 p-1 rounded-md">
        <button
          onClick=${() => setScriptureFilter('all')}
          className=${`px-2 py-0.5 text-xs rounded ${scriptureFilter === 'all' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-600'}`}
        >
          All
        </button>
        <button
          onClick=${() => setScriptureFilter('hebrew')}
          className=${`px-2 py-0.5 text-xs rounded ${scriptureFilter === 'hebrew' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-600'}`}
        >
          Hebrew
        </button>
        <button
          onClick=${() => setScriptureFilter('greek')}
          className=${`px-2 py-0.5 text-xs rounded ${scriptureFilter === 'greek' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-600'}`}
        >
          Greek
        </button>
      </div>
      <div className="flex items-center space-x-1 bg-slate-700/80 p-1 rounded-md">
        <button
          onClick=${() => setSortOrder('canonical')}
          className=${`px-2 py-0.5 text-xs rounded ${sortOrder === 'canonical' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-600'}`}
        >
          Canonical
        </button>
        <button
          onClick=${() => setSortOrder('chronological')}
          className=${`px-2 py-0.5 text-xs rounded ${sortOrder === 'chronological' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-600'}`}
        >
          Chronological
        </button>
      </div>
      <${ExportButtons} onExport=${onExport} disabled=${processedData.length === 0} />
    </div>
    `
  );

  return (
    html`
    <${CollapsibleSection} title="Books of the Bible" headerContent=${headerContent} initiallyOpen>
      <p className="text-slate-400 mb-4 text-sm">
        Details about each book of the Bible. Filter by scripture and toggle between canonical and chronological order.
      </p>
      <div className="overflow-x-auto max-h-96 rounded-lg border border-slate-700/50">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-teal-300 uppercase bg-slate-700/80 sticky top-0 backdrop-blur-sm">
            <tr>
              <th scope="col" className="px-4 py-2">Book Name</th>
              <th scope="col" className="px-4 py-2">Writer</th>
              <th scope="col" className="px-4 py-2">Completed</th>
              <th scope="col" className="px-4 py-2">Time Covered</th>
            </tr>
          </thead>
          <tbody>
            ${processedData.map((book) => (
              html`<tr key=${book.name} className="bg-slate-800/70 border-b border-slate-700 hover:bg-slate-700/50">
                <th scope="row" className="px-4 py-2 font-medium text-white whitespace-nowrap">${book.name}</th>
                <td className="px-4 py-2">${book.writer}</td>
                <td className="px-4 py-2 whitespace-nowrap">${book.writingCompleted}</td>
                <td className="px-4 py-2">${book.timeCovered}</td>
              </tr>`
            ))}
            ${processedData.length === 0 && (
                html`<tr>
                    <td colSpan=${4} className="text-center py-6 text-slate-400">No books match the current filter.</td>
                </tr>`
            )}
          </tbody>
        </table>
      </div>
    </${CollapsibleSection}>
    `
  );
};
