



import React, { useMemo } from 'react';
// Fixed import path to use .js extension for ES module compatibility.
import { reignsAndProphetsVisData } from '../data/reignsAndProphetsVisData.js';
// Fixed import path to use .js extension for ES module compatibility.
import { ReignAndProphetVisEntry } from '../types.js';

const MIN_YEAR = 420; // Malachi ends c. 423
const MAX_YEAR = 1120; // Saul starts 1117
const YEAR_SPAN = MAX_YEAR - MIN_YEAR;

const yearToPercent = (year: number) => {
  return ((MAX_YEAR - year) / YEAR_SPAN) * 100;
};

interface KingLabelProps {
  king: ReignAndProphetVisEntry & { labelTopPercent: number };
  isJudah: boolean;
}

const KingLabel: React.FC<KingLabelProps> = ({ king, isJudah }) => {
    const connectorTopPercent = yearToPercent(king.startYearBCE);
    const labelTopPercent = king.labelTopPercent;

    const isShifted = Math.abs(labelTopPercent - connectorTopPercent) > 0.1;
    
    const reignDuration = king.startYearBCE - king.endYearBCE;
    let reignText = '';
    if (king.name === 'Zimri') reignText = '7 days';
    else if (king.name === 'Shallum') reignText = '1 month';
    else if (reignDuration >= 1) reignText = `${reignDuration} year${reignDuration > 1 ? 's' : ''}`;

    const labelContent = (
        <p className="text-sm whitespace-nowrap">
            <span className="font-bold">{king.name}:</span>
            {reignText && <span className="text-slate-300 ml-1.5">{reignText}</span>}
        </p>
    );

    const horizontalLineBaseClass = `absolute top-0 h-px bg-slate-500`;
    const connectorContainerStyle = {
        top: `${connectorTopPercent}%`,
        width: '40%',
        right: isJudah ? '60%' : undefined,
        left: !isJudah ? '60%' : undefined
    };
    
    const labelContainerStyle = {
        top: `${labelTopPercent}%`,
        width: '40%',
        right: isJudah ? '60%' : undefined,
        left: !isJudah ? '60%' : undefined
    };

    return (
        <>
            {/* The label text part, positioned at its calculated non-overlapping spot */}
            <div className="absolute h-0" style={labelContainerStyle}>
                <div className={`absolute top-0 -translate-y-1/2 w-48 ${isJudah ? 'right-0 pr-10 text-right' : 'left-0 pl-10 text-left'}`}>
                    {labelContent}
                </div>
            </div>
            
            {/* The connector part, which handles simple and complex lines */}
            <div className="absolute h-0" style={connectorContainerStyle}>
                {/* Horizontal line from timeline, only if not shifted, or it's the anchor */}
                {!isShifted && <div className={`${horizontalLineBaseClass} w-10 ${isJudah ? 'right-0' : 'left-0'}`} />}

                {isShifted && (
                    <>
                        {/* Vertical Connector Line */}
                        <div
                            className={`absolute w-px bg-slate-500 ${isJudah ? 'right-10' : 'left-10'}`}
                            style={{
                                top: `${Math.min(0, labelTopPercent - connectorTopPercent)}%`,
                                height: `${Math.abs(labelTopPercent - connectorTopPercent)}%`,
                            }}
                        />
                        {/* Horizontal line from label's vertical position */}
                        <div
                            className={`${horizontalLineBaseClass} w-10 ${isJudah ? 'right-0' : 'left-0'}`}
                            style={{ top: `${labelTopPercent - connectorTopPercent}%`}}
                        />
                         {/* Horizontal line from timeline's vertical position */}
                        <div className={`${horizontalLineBaseClass} w-10 ${isJudah ? 'right-10' : 'left-10'}`} />
                    </>
                )}
            </div>
        </>
    );
};


export const NWTAppendixChart: React.FC = () => {
    const allEntries = [...reignsAndProphetsVisData];
    const embeddedProphetsToAdd: ReignAndProphetVisEntry[] = [];

    reignsAndProphetsVisData.forEach(entry => {
        if (entry.embeddedProphets && (entry.type.startsWith('King') || entry.type.startsWith('United'))) {
            entry.embeddedProphets.forEach(prophetName => {
                if (!allEntries.some(p => p.name === prophetName && p.type === 'Prophet')) {
                    embeddedProphetsToAdd.push({
                        name: prophetName,
                        type: 'Prophet',
                        startYearBCE: entry.startYearBCE,
                        endYearBCE: entry.endYearBCE,
                    });
                }
            });
        }
    });

    const data = [...allEntries, ...embeddedProphetsToAdd];

    const judahKings = data.filter(d => d.kingdom === 'Judah').sort((a,b) => b.startYearBCE - a.startYearBCE);
    const israelKings = data.filter(d => d.kingdom === 'Israel').sort((a,b) => b.startYearBCE - a.startYearBCE);
    const prophets = data.filter(d => d.type === 'Prophet');

    const dateMarkers = [];
    for (let year = Math.floor(MAX_YEAR / 50) * 50; year >= MIN_YEAR; year -= 50) {
        dateMarkers.push(year);
    }
    
    const layoutLabels = (kings: ReignAndProphetVisEntry[]) => {
      let lastLabelBottomPercent = -1000;
      const labelHeightPercent = 0.8; 
      const laidOut: (ReignAndProphetVisEntry & { labelTopPercent: number })[] = [];
      for (const king of kings) {
        const idealTopPercent = yearToPercent(king.startYearBCE);
        const actualTopPercent = Math.max(idealTopPercent, lastLabelBottomPercent + (labelHeightPercent / 2));
        lastLabelBottomPercent = actualTopPercent + (labelHeightPercent / 2);
        laidOut.push({ ...king, labelTopPercent: actualTopPercent });
      }
      return laidOut;
    };

    const laidOutJudahKings = useMemo(() => layoutLabels(judahKings), [judahKings]);
    const laidOutIsraelKings = useMemo(() => layoutLabels(israelKings), [israelKings]);

    const laidOutProphets = useMemo(() => {
        const sortedProphets = [...prophets].sort((a, b) => b.startYearBCE - a.startYearBCE || a.name.localeCompare(b.name));
        const groupedByYear: Record<number, ReignAndProphetVisEntry[]> = {};
        sortedProphets.forEach(p => {
            if (!groupedByYear[p.startYearBCE]) groupedByYear[p.startYearBCE] = [];
            groupedByYear[p.startYearBCE].push(p);
        });

        const finalLayout: (ReignAndProphetVisEntry & { xOffset: number })[] = [];
        const barWidth = 16; // w-4 in tailwind
        const spacing = 4;

        Object.values(groupedByYear).forEach(group => {
            const groupSize = group.length;
            const totalWidth = groupSize * barWidth + (groupSize - 1) * spacing;
            const startOffset = -totalWidth / 2 + barWidth / 2;
            group.forEach((prophet, index) => {
                const xOffset = startOffset + index * (barWidth + spacing);
                finalLayout.push({ ...prophet, xOffset });
            });
        });
        return finalLayout;
    }, [prophets]);

    return (
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 text-slate-200 overflow-x-auto">
            <div className="relative mx-auto" style={{ height: '2500px', width: '700px' }}>
                {/* Titles */}
                <div className="absolute top-0 left-0 w-[40%] text-center font-semibold text-teal-300 font-serif">
                    Kings of Southern Two-Tribe<br/>Kingdom of Judah
                </div>
                 <div className="absolute top-0 right-0 w-[40%] text-center font-semibold text-teal-300 font-serif">
                    Kings of Northern Ten-Tribe<br/>Kingdom of Israel
                </div>

                {/* Date markers */}
                {dateMarkers.map(year => (
                    <div key={year} className="absolute w-full h-0" style={{ top: `${yearToPercent(year)}%` }}>
                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 w-[20%]">
                            <div className="flex-1 h-px bg-slate-700/50" />
                            <span className="text-xs text-slate-500">{year} B.C.E.</span>
                            <div className="flex-1 h-px bg-slate-700/50" />
                        </div>
                    </div>
                ))}
                
                {/* Judah Timeline */}
                <div className="absolute top-0 left-[40%] -translate-x-full h-full w-8 mr-2">
                    {judahKings.map((king, index) => {
                        const top = yearToPercent(king.startYearBCE);
                        const end = yearToPercent(king.endYearBCE);
                        const height = Math.max(0.2, end - top);
                        const color = index % 2 === 0 ? 'bg-red-800' : 'bg-rose-900/80';
                        return <div key={`${king.name}-${king.startYearBCE}`} className={`absolute w-full ${color}`} style={{ top: `${top}%`, height: `${height}%` }} />;
                    })}
                    {laidOutJudahKings.map((king) => <KingLabel key={`label-${king.name}-${king.startYearBCE}`} king={king} isJudah={true} />)}
                    {judahKings.map((king) => (
                        <div key={`marker-${king.name}-${king.startYearBCE}`} className="absolute w-full h-px bg-slate-400" style={{top: `${yearToPercent(king.startYearBCE)}%`}}>
                             <span className="absolute left-full ml-1 text-xs text-slate-500 -translate-y-1/2">{king.startYearBCE}</span>
                        </div>
                    ))}
                </div>

                {/* Israel Timeline */}
                <div className="absolute top-0 right-[40%] translate-x-full h-full w-8 ml-2">
                     {israelKings.map((king, index) => {
                        const top = yearToPercent(king.startYearBCE);
                        const end = yearToPercent(king.endYearBCE);
                        const height = Math.max(0.2, end - top);
                        const color = index % 2 === 0 ? 'bg-red-800' : 'bg-rose-900/80';
                        return <div key={`${king.name}-${king.startYearBCE}`} className={`absolute w-full ${color}`} style={{ top: `${top}%`, height: `${height}%` }} />;
                    })}
                    {laidOutIsraelKings.map((king) => <KingLabel key={`label-${king.name}-${king.startYearBCE}`} king={king} isJudah={false} />)}
                     {israelKings.map((king) => (
                        <div key={`marker-${king.name}-${king.startYearBCE}`} className="absolute w-full h-px bg-slate-400" style={{top: `${yearToPercent(king.startYearBCE)}%`}}>
                            <span className="absolute right-full mr-1 text-xs text-slate-500 -translate-y-1/2">{king.startYearBCE}</span>
                        </div>
                    ))}
                </div>

                {/* Prophets */}
                <div className="absolute top-0 left-0 w-full h-full">
                    {laidOutProphets.map(prophet => {
                        const top = yearToPercent(prophet.startYearBCE);
                        const end = yearToPercent(prophet.endYearBCE);
                        const height = Math.max(0.2, end - top);
                        return (
                            <div key={prophet.name} 
                                className="absolute"
                                style={{ 
                                    top: `${top}%`, 
                                    height: `${height}%`,
                                    left: '50%',
                                    transform: `translateX(calc(-50% + ${prophet.xOffset}px))`,
                                }}
                            >
                                <div className="relative h-full w-4 bg-amber-800/80 rounded">
                                    <span className="absolute -right-1 top-0 -translate-y-full translate-x-full text-sm font-semibold whitespace-nowrap [writing-mode:vertical-rl] rotate-180">
                                        {prophet.name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};