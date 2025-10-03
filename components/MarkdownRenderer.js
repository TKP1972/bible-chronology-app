
import { createElement } from 'react';
import htm from 'htm';

const html = htm.bind(createElement);

const renderLine = (line, index) => {
  // Bold text: **text**
  const bolded = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-teal-300">$1</strong>');
  
  return html`<span dangerouslySetInnerHTML=${{ __html: bolded }} />`;
};

export const MarkdownRenderer = ({ content }) => {
  const lines = content.split('\n');
  const elements = [];
  let listItems = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        html`
        <ul key=${`ul-${elements.length}`} className="list-disc list-inside space-y-2 my-4 pl-4">
          ${listItems.map((item, i) => html`
            <li key=${i} className="text-slate-300">${renderLine(item, i)}</li>
          `)}
        </ul>
        `
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // Headings
    if (trimmedLine.startsWith('## ')) {
      flushList();
      elements.push(html`<h4 key=${index} className="text-xl font-bold text-teal-300 mt-6 mb-3">${trimmedLine.substring(3)}</h4>`);
      return;
    }
    if (trimmedLine.startsWith('# ')) {
        flushList();
        elements.push(html`<h3 key=${index} className="text-2xl font-bold text-teal-300 mt-8 mb-4">${trimmedLine.substring(2)}</h3>`);
        return;
    }
    
    // List items
    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      listItems.push(trimmedLine.substring(2));
      return;
    }

    // Paragraphs
    flushList();
    if (trimmedLine) {
        elements.push(html`<p key=${index} className="my-3 text-slate-300 leading-relaxed">${renderLine(trimmedLine, index)}</p>`);
    }
  });

  flushList(); // Make sure the last list is rendered

  return html`<div>${elements}</div>`;
};
