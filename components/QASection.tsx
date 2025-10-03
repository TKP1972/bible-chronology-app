



import React, { useState } from 'react';
// Fixed import path to use .js extension for ES module compatibility.
import { qaData } from '../data/qaData.js';
// Fixed import path to use .js extension for ES module compatibility.
import { QAEntry } from '../types.js';
// Fixed import path to use .js extension for ES module compatibility.
import { CollapsibleSection } from './CollapsibleSection.js';

const QAItem: React.FC<{ question: string; answer: string; isOpen: boolean; onClick: () => void; }> = ({
  question,
  answer,
  isOpen,
  onClick,
}) => {
  return (
    <div className="border-b border-slate-700/50">
      <h3>
        <button
          type="button"
          className="flex justify-between items-center w-full py-3 px-2 text-left font-semibold text-sm text-slate-200 hover:bg-slate-700/30"
          onClick={onClick}
          aria-expanded={isOpen}
        >
          <span>{question}</span>
          <svg
            className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </h3>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-1 pb-3 px-2 text-slate-300 text-sm">
            <p>{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const EraQAGroup: React.FC<{ era: string, questions: QAEntry[] }> = ({ era, questions }) => {
    const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(null);

    const handleToggle = (index: number) => {
        setOpenQuestionIndex(openQuestionIndex === index ? null : index);
    };

    return (
        <CollapsibleSection title={era}>
            <div className="space-y-1">
                {questions.map((item, index) => (
                    <QAItem
                        key={index}
                        question={item.question}
                        answer={item.answer}
                        isOpen={openQuestionIndex === index}
                        onClick={() => handleToggle(index)}
                    />
                ))}
            </div>
        </CollapsibleSection>
    )
}

export const QASection: React.FC = () => {
  return (
    <div className="space-y-6">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-teal-300">Frequently Asked Questions</h2>
            <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
                Quick answers to key questions based on the chronological data, organized by historical era.
            </p>
        </div>
        <div className="space-y-4">
            {qaData.map((eraData) => (
                <EraQAGroup
                    key={eraData.era}
                    era={eraData.era}
                    questions={eraData.questions}
                />
            ))}
        </div>
    </div>
  );
};