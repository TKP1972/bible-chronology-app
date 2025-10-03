
import { useState, useEffect, createElement } from 'react';
import htm from 'htm';

const html = htm.bind(createElement);

export const CollapsibleSection = ({ 
  title, 
  children, 
  initiallyOpen = false, 
  headerContent, 
  isOpen: controlledIsOpen, 
  onToggle,
  fullscreenOnOpen = false,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(initiallyOpen);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  useEffect(() => {
    const isModalOpen = isOpen && fullscreenOnOpen;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    }
    // Cleanup function runs when component unmounts or deps change
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, fullscreenOnOpen]);

  const handleToggle = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalIsOpen(prev => !prev);
    }
  };

  const renderChildren = (isFullScreen) => {
    return typeof children === 'function' ? children({ isFullScreen }) : children;
  };

  const header = (
    html`
    <div className="flex justify-between items-center p-4 hover:bg-slate-700/50 rounded-t-xl transition-colors duration-200">
      <button
        onClick=${handleToggle}
        aria-expanded=${isOpen}
        className="flex-grow flex items-center text-left font-bold text-lg text-teal-300"
      >
        <span>${title}</span>
      </button>
      <div className="flex items-center space-x-4">
        ${headerContent}
        <button onClick=${handleToggle} aria-label=${isOpen ? 'Collapse section' : 'Expand section'}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className=${`w-5 h-5 transition-transform duration-300 ease-in-out text-slate-400 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
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
    </div>
    `
  );

  if (fullscreenOnOpen) {
    return (
      html`
      <div className="bg-slate-800/60 rounded-xl shadow-lg border border-slate-700">
        ${header}
        ${isOpen && html`
            <div 
              className="fixed inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex flex-col p-4 sm:p-6 md:p-8" 
              role="dialog" 
              aria-modal="true" 
              aria-labelledby=${`fullscreen-title-${title.replace(/\s+/g, '-')}`}
            >
              <header className="flex justify-between items-center mb-6 flex-shrink-0">
                <h2 id=${`fullscreen-title-${title.replace(/\s+/g, '-')}`} className="text-2xl font-bold text-teal-300">${title}</h2>
                <div className="flex items-center space-x-4">
                  ${headerContent}
                  <button onClick=${handleToggle} aria-label="Close" className="text-slate-400 hover:text-white p-2 -mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth=${2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </header>
              <div className="flex-grow overflow-y-auto relative min-h-0">
                ${renderChildren(true)}
              </div>
            </div>
        `}
      </div>
      `
    );
  }

  return (
    html`
    <div className="bg-slate-800/60 rounded-xl shadow-lg border border-slate-700">
      ${header}
      ${isOpen && html`
        <div className="p-4 border-t border-slate-700">
          ${renderChildren(false)}
        </div>
      `}
    </div>
    `
  );
};
