
const CACHE_NAME = 'biblical-chronology-v4'; // <-- Incremented cache version
const urlsToCache = [
  './',
  './index.html',
  './index.js',
  './metadata.json',
  './App.js',
  './manifest.json',
  './icon.svg',
  './components/AnalysisSection.js',
  './components/ApostolicPeriodChart.js',
  './components/BeliefsClarifiedTimelineChart.js',
  './components/BibleBooksTable.js',
  './components/ChatMessage.js',
  './components/ChronologyMethodology.js',
  './components/CollapsibleSection.js',
  './components/EraHeader.js',
  './components/ExportButtons.js',
  './components/Header.js',
  './components/KingdomEraTimelineChart.js',
  './components/LifeSpanTable.js',
  './components/LifespanOverlapChart.js',
  './components/MarkdownRenderer.js',
  './components/MinistryTimelineChart.js',
  './components/ModernTimelineChart.js',
  './components/NWTAppendixChart.js',
  './components/ProcreationTable.js',
  './components/PropheticTimelineChart.js',
  './components/QASection.js',
  './components/QuerySection.js',
  './components/ReignsAndProphetsChart.js',
  './components/Spinner.js',
  './components/Tabs.js',
  './components/Timeline.js',
  './components/TimelineItem.js',
  './data/apostolicEventsData.js',
  './data/beliefsClarifiedData.js',
  './data/bibleBooksData.js',
  './data/chronology.js',
  './data/erasData.js',
  './data/kingdomEraEventsData.js',
  './data/lifeSpanData.js',
  './data/lifespanOverlapData.js',
  './data/ministryEventsData.js',
  './data/modernEventsData.js',
  './data/procreationData.js',
  './data/propheticEventsData.js',
  './data/qaData.js',
  './data/reignsAndProphetsVisData.js',
  './data/significantEventsData.js',
  './data/sourceStudyNumber3.js',
  './data/sourceChronologyIt1.js',
  './data/sourceDatesRs.js',
  './data/sourceYearIt2.js',
  './data/sourceCalendarIt1.js',
  './data/sourceWatchtower20111101.js',
  './services/geminiService.js',
  './utils/exportUtils.js',
  './utils/parser.js',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Open+Sans:wght@400;600&display=swap',
  'https://aistudiocdn.com/react@^19.1.1',
  'https://aistudiocdn.com/react-dom@^19.1.1/client',
  'https://aistudiocdn.com/htm@^3.1.1',
  'https://aistudiocdn.com/@google/genai@^1.20.0'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // <-- Tell the new service worker to activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        const promises = urlsToCache.map(url => {
            return cache.add(url).catch(err => {
                if (url.startsWith('http')) {
                    const request = new Request(url, { mode: 'no-cors' });
                    return fetch(request).then(response => cache.put(request, response));
                }
                console.warn(`Failed to cache ${url}: ${err}`);
            });
        });
        return Promise.all(promises);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response; // Cache hit
        }
        return fetch(event.request).then(
          (response) => {
            if (!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'opaque')) {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    }).then(() => self.clients.claim()) // <-- Take control of all open pages
  );
});
