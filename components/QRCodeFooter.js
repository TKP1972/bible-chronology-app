
import { createElement, useState, useEffect } from 'react';
import htm from 'htm';
import QRCode from 'qrcode';

const html = htm.bind(createElement);

export const QRCodeFooter = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const appUrl = 'https://TKP1972.github.io/bible-chronology-app/';

  useEffect(() => {
    QRCode.toDataURL(appUrl, { 
        width: 128, 
        margin: 1, 
        color: { 
            dark: '#e2e8f0', // slate-200
            light: '#0f172a' // slate-900
        } 
    })
      .then(url => {
        setQrCodeUrl(url);
      })
      .catch(err => {
        console.error('Failed to generate QR code:', err);
      });
  }, [appUrl]);

  return html`
    <footer className="text-center py-8 px-4 bg-slate-900/50 border-t border-slate-800 mt-12">
      <div className="max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-teal-300">Scan to Open on Your Phone</h3>
        <div className="mt-4 p-2 bg-slate-800 rounded-lg inline-block border border-slate-700 shadow-lg">
          ${qrCodeUrl
            ? html`<img src=${qrCodeUrl} alt="QR code to open the app" width="128" height="128" className="rounded-sm" />`
            : html`<div className="w-32 h-32 bg-slate-700 flex items-center justify-center rounded text-xs text-slate-400">Generating...</div>`
          }
        </div>
        <p className="text-slate-500 text-sm mt-6">
          Enhanced by a world-class senior frontend engineer.
        </p>
      </div>
    </footer>
  `;
};