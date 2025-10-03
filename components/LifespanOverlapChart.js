
import { useMemo, useState, useRef, createElement } from 'react';
import htm from 'htm';

const html = htm.bind(createElement);

const getNiceInterval = (yearRange) => {
    if (yearRange <= 0) return 1;
    const targetTicks = 10;
    const rawInterval = yearRange / targetTicks;
    const intervals = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500, 1000];

    for (const interval of intervals) {
        if (interval >= rawInterval) {
            return interval;
        }
    }
    return intervals[intervals.length - 1];
};


export const LifespanOverlapChart = ({ data, significantEvents, initialRange }) => {
  const [tooltip, setTooltip] = useState(null);
  const chartRef = useRef(null);
  const [currentRange, setCurrentRange] = useState(initialRange);
  const [selection, setSelection] = useState({ start: null, end: null });
  const [isDragging, setIsDragging] = useState(false);

  const { timelineStart, timelineEnd, yearRange } = useMemo(() => {
    const start = currentRange.start;
    const end = currentRange.end;
    return {
      timelineStart: start,
      timelineEnd: end,
      yearRange: start - end,
    };
  }, [currentRange]);

  const isZoomed = currentRange.start !== initialRange.start || currentRange.end !== initialRange.end;

  const handleResetZoom = () => {
    setCurrentRange(initialRange);
  };
  
  const pixelToYear = (pixelX) => {
    if (!chartRef.current) return 0;
    const chartWidth = chartRef.current.offsetWidth;
    const year = timelineStart - (pixelX / chartWidth) * yearRange;
    return Math.round(year);
  };

  const handleMouseDown = (e) => {
    if (!chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setIsDragging(true);
    setSelection({ start: x, end: x });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !chartRef.current) return;
    const rect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setSelection(prev => ({ ...prev, end: x }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (selection.start !== null && selection.end !== null && Math.abs(selection.start - selection.end) > 10) {
      const year1 = pixelToYear(selection.start);
      const year2 = pixelToYear(selection.end);
      const newStart = Math.max(year1, year2);
      const newEnd = Math.min(year1, year2);
      if (newStart > newEnd) {
        setCurrentRange({ start: newStart, end: newEnd });
      }
    }
    setSelection({ start: null, end: null });
  };
  
  const showTooltip = (event, content) => {
    setTooltip({ content, x: event.clientX, y: event.clientY });
  };
  const hideTooltip = () => setTooltip(null);
  
  const yearMarkers = useMemo(() => {
    if (yearRange <= 0) return [];
    const markers = [];
    
    const interval = getNiceInterval(yearRange);
    const startMarker = Math.ceil(currentRange.start / interval) * interval;

    for (let year = startMarker; year >= currentRange.end; year -= interval) {
        markers.push(year);
    }
    return markers;
  }, [currentRange, yearRange]);

  const filteredEvents = useMemo(() => significantEvents.filter(event => event.year >= currentRange.end && event.year <= currentRange.start), [significantEvents, currentRange]);

  const processedEvents = useMemo(() => {
    const sortedEvents = [...filteredEvents].sort((a, b) => b.year - a.year);
    const labelLayout = [];
    const levelEnds = []; 
    
    const avgCharHeightInYears = (yearRange / (chartRef.current?.offsetWidth || 1200)) * 7; 
    const yearPadding = yearRange * 0.01;

    for (const event of sortedEvents) {
        let placed = false;
        let level = 0;
        
        const labelHeightInYears = (event.description.length + 7) * avgCharHeightInYears;

        while (!placed) {
            if (levelEnds[level] === undefined || event.year < levelEnds[level] - yearPadding) {
                labelLayout.push({ event, level });
                levelEnds[level] = event.year - labelHeightInYears;
                placed = true;
            } else {
                level++;
            }
        }
    }
    return labelLayout;
  }, [filteredEvents, yearRange, currentRange.start]);

  const YearMarkersComponent = ({ position }) => (
    html`
    <div className=${`relative h-8 ${position === 'top' ? 'mb-2' : 'mt-2'}`}>
      ${yearMarkers.map(year => {
        const percent = ((timelineStart - year) / yearRange) * 100;
        if (percent < 0 || percent > 100) return null;
        return (
          html`
          <div key=${`${position}-${year}`} className="absolute h-full" style=${{ left: `${percent}%`, top: 0 }}>
            <span className=${`absolute -translate-x-1/2 text-xs text-slate-500 ${position === 'top' ? 'top-0' : 'bottom-0'}`}>\${year}</span>
            <div className=${`absolute w-px bg-slate-700/50 ${position === 'top' ? 'top-6 h-2' : 'bottom-6 h-2'}`}></div>
          </div>
          `
        );
      })}
    </div>
    `
  );

  return (
    html`
    <div className="relative w-full overflow-x-auto bg-slate-900/50 p-4 rounded-lg border border-slate-700">
      ${isZoomed && html`
        <button
          onClick=${handleResetZoom}
          className="absolute top-2 right-2 z-30 bg-slate-700 hover:bg-slate-600 text-teal-300 text-xs font-semibold py-1 px-3 rounded-full"
        >
          Reset Zoom
        </button>
      `}
      <div 
        ref=${chartRef}
        className=${`relative cursor-crosshair ${isDragging ? 'select-none' : ''}`}
        style=${{ width: `1200px`, minWidth: '100%', padding: '0 40px' }}
        onMouseDown=${handleMouseDown}
        onMouseMove=${handleMouseMove}
        onMouseUp=${handleMouseUp}
        onMouseLeave=${() => { isDragging && handleMouseUp() }}
      >
        <${YearMarkersComponent} position="top" />
        
         <div className="absolute top-8 left-0 w-full h-[calc(100%-64px)] pointer-events-none z-0">
          ${yearMarkers.map(year => {
            const percent = ((timelineStart - year) / yearRange) * 100;
            if (percent < 0 || percent > 100) return null;
            return (
              html`
              <div key=${`line-${year}`} className="absolute h-full" style=${{ left: `${percent}%` }}>
                <div className="h-full w-px bg-slate-800"></div>
              </div>
              `
            );
          })}
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
            ${processedEvents.map(({ event, level }) => {
                const percent = ((timelineStart - event.year) / yearRange) * 100;
                if (percent < 0 || percent > 100) return null;
                const topOffset = 8 + level * 18;
                return (
                    html`
                    <div key=${event.description} className="absolute top-0 h-full" style=${{ left: `${percent}%`}}>
                        <div className="absolute w-px h-full border-l-2 border-red-500/70 border-dashed"></div>
                        <div 
                            className="absolute text-white text-xs font-semibold"
                            style=${{
                                transform: `translateX(-100%) translateY(${topOffset}px) rotate(-90deg)`,
                                transformOrigin: 'bottom right', whiteSpace: 'nowrap', paddingRight: '5px'
                            }}
                        >
                            ${`${event.description} (${event.year})`}
                        </div>
                    </div>
                    `
                );
            })}
        </div>

        <div className="relative space-y-2 z-20 py-2">
          ${data.map((person, index) => {
            const leftPercent = ((timelineStart - person.birthYearBCE) / yearRange) * 100;
            const rightPercent = ((timelineStart - person.deathYearBCE) / yearRange) * 100;
            let widthPercent = Math.max(0, rightPercent - leftPercent);
            
            let needsVisualGap = false;
            significantEvents.forEach(event => {
                if (person.deathYearBCE >= event.year && person.deathYearBCE < event.year + 5) {
                    needsVisualGap = true;
                }
            });

            if (needsVisualGap) {
                const gapInYears = (yearRange / (chartRef.current?.offsetWidth || 1200)) * 4;
                const gapPercent = (gapInYears / yearRange) * 100;
                widthPercent = Math.max(0.1, widthPercent - gapPercent);
            }

            const barColor = index % 2 === 0 ? 'bg-teal-500/70' : 'bg-sky-500/70';

            return (
              html`
              <div key=${person.name} className="flex items-center h-8 group">
                <div className="w-32 pr-4 text-xs text-right text-slate-300 flex-shrink-0">${person.name}</div>
                <div
                    className=${`h-5 rounded-sm ${barColor} hover:opacity-100 opacity-90 transition-opacity duration-200 relative`}
                    style=${{
                        position: 'absolute',
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                    }}
                    onMouseMove=${(e) => showTooltip(e, html`
                        <>
                        <div className="font-bold text-teal-300">${person.name}</div>
                        <div>Lived: ${person.birthYearBCE} - ${person.deathYearBCE} BCE</div>
                        <div>Age: ${person.ageAtDeath} years</div>
                        </>
                    `)}
                    onMouseLeave=${hideTooltip}
                />
              </div>
              `
            );
          })}
        </div>
        
        <${YearMarkersComponent} position="bottom" />
        
        ${isDragging && selection.start !== null && selection.end !== null && html`
          <div className="absolute top-0 h-full bg-teal-500/20 border-2 border-teal-400 pointer-events-none" style=${{
            left: Math.min(selection.start, selection.end),
            width: Math.abs(selection.end - selection.start),
          }} />
        `}

      </div>
      
      ${tooltip && html`
        <div
          className="fixed z-50 p-2 text-xs text-white bg-slate-800 border border-slate-600 rounded-md shadow-lg pointer-events-none"
          style=${{ 
            left: tooltip.x, top: tooltip.y, transform: 'translate(15px, 15px)'
          }}
        >
          ${tooltip.content}
        </div>
      `}
    </div>
    `
  );
};
