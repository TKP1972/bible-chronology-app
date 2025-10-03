import { createElement, useState, useEffect } from 'react';
import htm from 'htm';
import { CollapsibleSection } from './CollapsibleSection.js';

const html = htm.bind(createElement);

export const ApiKeyManager = () => {
  const [apiKey, setApiKey] = useState('');
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setIsKeySaved(true);
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('gemini_api_key', apiKey);
    setIsKeySaved(true);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000); // Hide message after 3 seconds
  };
  
  const handleClear = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setIsKeySaved(false);
  }

  const headerContent = (
    html`<span className=${`text-xs font-semibold px-2 py-1 rounded-md ${isKeySaved ? 'bg-green-800 text-green-300' : 'bg-yellow-800 text-yellow-300'}`}>
      ${isKeySaved ? 'Key Saved' : 'Key Not Set'}
    </span>`
  );

  return (
    html`
    <${CollapsibleSection} title="Gemini API Key" headerContent=${headerContent}>
      <div className="space-y-3 text-sm">
        <p className="text-slate-400">
          The AI features of this app require a Google Gemini API key. You can get a free key from Google AI Studio. The key is stored securely in your browser's local storage and is never sent anywhere else.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 items-start">
            <div className="relative flex-grow w-full">
                <label htmlFor="api-key-input" className="sr-only">Gemini API Key</label>
                <input
                    id="api-key-input"
                    type="password"
                    value=${apiKey}
                    onChange=${(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Gemini API Key"
                    className="w-full bg-slate-800 border border-slate-600 rounded-md py-1.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
            </div>
            <div className="flex gap-2">
                <button
                    onClick=${handleSave}
                    disabled=${!apiKey.trim()}
                    className="bg-teal-600 hover:bg-teal-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-1.5 px-4 rounded-md transition-colors"
                >
                    Save
                </button>
                 <button
                    onClick=${handleClear}
                    disabled=${!isKeySaved}
                    className="bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-200 font-bold py-1.5 px-4 rounded-md transition-colors"
                >
                    Clear
                </button>
            </div>
        </div>
        ${showSuccess && html`
            <p className="text-green-400 text-xs mt-1">API Key saved successfully!</p>
        `}
      </div>
    </${CollapsibleSection}>
    `
  );
};
