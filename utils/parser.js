
export const parseBibleChronology = (text) => {
  const lines = text.trim().split('\n');
  const events = [];
  let currentEra = 'BCE';
  let lastYear = null;
  let lastEra = null;

  for (const line of lines) {
    if (line.trim().toUpperCase() === 'B.C.E.') {
      currentEra = 'BCE';
      continue;
    }
    if (line.trim().toUpperCase() === 'C.E.') {
      currentEra = 'CE';
      continue;
    }
    if (line.includes('Important Events in Bible Chronology')) {
      continue;
    }

    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const yearMatch = trimmedLine.match(/^(?:[a-c]\.\s*)?(\d{1,4}(?:-\d{1,4})?),?/);
    
    if (yearMatch && yearMatch[1]) {
      const yearStr = yearMatch[1].split('-')[0]; // Take the first year in a range
      const year = parseInt(yearStr, 10);
      
      if (!isNaN(year)) {
        lastYear = year;
        lastEra = currentEra;
        const descriptionMatch = trimmedLine.match(/^\s*(?:[a-c]\.\s*)?(?:\d{1,4}(?:-\d{1,4})?),?\s*(.*)/);
        const description = descriptionMatch ? descriptionMatch[1].split(':')[0].trim() : 'Event details missing';

        events.push({
          type: 'event',
          year,
          era: currentEra,
          description,
          fullText: trimmedLine,
        });
      }
    } else if (lastYear !== null && lastEra !== null) {
      // This is a continuation of the previous event
      const existingEvent = events[events.length - 1];
      if (existingEvent) {
          existingEvent.fullText += `\n${trimmedLine}`;
      }
    }
  }
  
  return events;
};
