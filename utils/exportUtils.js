
// --- Intelligent Filename Generation ---
export const generateFilename = (baseName, extension) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${baseName}_${year}-${month}-${day}.${extension}`;
};


// --- Generic Download Utility ---
export const downloadFile = (filename, content) => {
  const element = document.createElement('a');
  const file = new Blob([content], { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = filename;
  document.body.appendChild(element); // Required for Firefox
  element.click();
  document.body.removeChild(element);
};

// --- Text & Markdown Formatters ---

export const formatTimelineForExport = (events, format) => {
  return events
    .map(item => {
      if (item.type === 'era_header') {
        return format === 'md' ? `\n## ${item.title}\n` : `\n--- ${item.title.toUpperCase()} ---\n`;
      }
      const event = item;
      return `${event.year} ${event.era}: ${event.description}`;
    })
    .join('\n');
};

export const formatAnalysisForExport = (analysis, format) => {
  if (format === 'txt') {
    return analysis
      .replace(/## (.*?)/g, '\n--- $1 ---\n')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/[\*] (.*)/g, '- $1');
  }
  return analysis;
};

export const formatConversationForExport = (conversation, format) => {
    return conversation.map(msg => {
        const prefix = msg.sender === 'user' ? 'You' : 'AI';
        if (format === 'md') {
            return `**${prefix}:**\n${msg.text}\n`;
        }
        return `${prefix.toUpperCase()}:\n${msg.text}\n`;
    }).join('\n---\n\n');
};

const formatTable = (
  data,
  headers,
  format
) => {
  const headerStrings = headers;
  if (format === 'md') {
    const mdHeaders = `| ${headerStrings.join(' | ')} |`;
    const mdSeparator = `| ${headerStrings.map(() => '---').join(' | ')} |`;
    const mdRows = data.map(row => `| ${headers.map(h => row[h]).join(' | ')} |`).join('\n');
    return `${mdHeaders}\n${mdSeparator}\n${mdRows}`;
  } else {
    // Basic CSV for TXT
    const txtHeaders = headerStrings.join(', ');
    const txtRows = data.map(row => headers.map(h => `"${String(row[h]).replace(/"/g, '""')}"`).join(', ')).join('\n');
    return `${txtHeaders}\n${txtRows}`;
  }
};

export const formatLifeSpanForExport = (data, format) => {
    return formatTable(data, ['name', 'ageAtDeath', 'scripture'], format);
};

export const formatProcreationForExport = (data, format) => {
    return formatTable(data, ['father', 'son', 'fatherAgeAtBirth', 'scripture'], format);
};

export const formatKingsAndProphetsForExport = (data, format) => {
    const sanitizedData = data.map(d => ({
        name: d.name,
        type: d.type,
        kingdom: d.kingdom || 'N/A',
        startYearBCE: d.startYearBCE || '-',
        deathYearBCE: d.deathYearBCE || '-',
    }));
    return formatTable(sanitizedData, ['name', 'type', 'kingdom', 'startYearBCE', 'deathYearBCE'], format);
};

export const formatBibleBooksForExport = (data, format) => {
    const headers = ['name', 'writer', 'placeWritten', 'writingCompleted', 'timeCovered'];
    return formatTable(data, headers, format);
}

// --- Main Export Function ---

export const handleExport = (
  format,
  baseFilename,
  data,
  formatter
) => {
  const filename = generateFilename(baseFilename, format);
  const content = formatter(data, format);
  downloadFile(filename, content);
};
