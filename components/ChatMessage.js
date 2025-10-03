
import { createElement } from 'react';
import htm from 'htm';
import { MarkdownRenderer } from './MarkdownRenderer.js';

const html = htm.bind(createElement);

export const ChatMessage = ({ message }) => {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      html`
      <div className="flex justify-end">
        <div className="bg-teal-800/70 p-3 rounded-lg max-w-sm">
          <p className="text-slate-200">${message.text}</p>
        </div>
      </div>
      `
    );
  }

  // AI message
  return (
    html`
    <div className="flex items-start space-x-2">
      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0" aria-hidden="true">
        <svg className="w-5 h-5 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth=${1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z" />
        </svg>
      </div>
      <div className="bg-slate-700/80 p-3 rounded-lg max-w-sm">
        <${MarkdownRenderer} content=${message.text} />
      </div>
    </div>
    `
  );
};
