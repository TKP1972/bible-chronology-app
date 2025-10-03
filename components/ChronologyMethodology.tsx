import React from 'react';
// Fixed import path to use .js extension for ES module compatibility.
import { CollapsibleSection } from './CollapsibleSection.js';

export const ChronologyMethodology: React.FC = () => {
  return (
    <CollapsibleSection title="Chronology Methodology Notes">
      <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
        <p>
          Understanding ancient timelines, especially those involving the reigns of kings, requires more than simple mathematical subtraction. Here are some key principles that affect how dates and durations are calculated:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4">
          <li>
            <strong className="font-semibold text-teal-300">Accession Year vs. Regnal Year:</strong> Many ancient kingdoms, including Israel and Judah, used an "accession year" system. When a king died or was deposed, the remainder of that year was credited to the deceased king's reign. The new king's first official "regnal year" did not begin until the start of the next calendar year (e.g., on the month of Nisan or Tishri). This means a simple subtraction of start and end dates can often result in a figure that is off by one year compared to the officially stated reign length.
          </li>
          <li>
            <strong className="font-semibold text-teal-300">Calendar Differences:</strong> The kingdoms of Israel and Judah sometimes started their calendar years at different times (Nisan in the spring vs. Tishri in the autumn). This can affect the synchronization of events and reigns between the two kingdoms.
          </li>
          <li>
            <strong className="font-semibold text-teal-300">Coregencies:</strong> It was common for a king to make his son a coregent, sharing the throne for a period of time before the father's death. The son's reign might be counted from the start of the coregency or from the start of his sole rule, leading to potential overlaps and dating complexities.
          </li>
          <li>
            <strong className="font-semibold text-teal-300">Example - Athaliah's Reign:</strong> The timeline shows Athaliah usurping the throne in c. 905 BCE and the next king, Jehoash, beginning his rule in 898 BCE. A simple calculation (905 - 898) suggests a 7-year reign. However, the Bible explicitly states that Jehoash was hidden for <strong className="text-white">six years</strong> while she was ruling (2 Chronicles 22:12). In such cases, the explicit statement from the source text is considered more accurate than a simple mathematical deduction from timeline start/end points.
          </li>
        </ul>
        <p>
          For these reasons, this application prioritizes explicit statements of duration from the source material and avoids displaying automatically calculated reign lengths that could be misleading.
        </p>
      </div>
    </CollapsibleSection>
  );
};