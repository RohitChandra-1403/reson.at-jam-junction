// Ticket and Booking Storage Engine
const STORAGE_KEY = 'reson_jam_junction_tickets';

const INITIAL_DEMO_TICKETS = [
  {
    ticketId: 'TKT-RESON-2026-9041',
    transactionId: 'TXN-JJ-8419203',
    utrNumber: 'UTR-HDFC-993810294812',
    mainPerson: 'Aryan Sharma',
    otherMembers: ['Rohan Mehta', 'Sneha Kapoor'],
    memberCount: 3,
    audienceCategory: 'Artist',
    instrument: 'Artist (Instrumentalist)',
    recommendedSong: 'Yellow - Coldplay (Acoustic)',
    handle: '@aryan_chords',
    email: 'aryan.sharma@gmail.com',
    phone: '+91 98201 44521',
    paymentScreenshot: null,
    bookedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    bookedAtFormatted: new Date(Date.now() - 3600000 * 5).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }),
    status: 'Checked In',
    checkedInAt: new Date(Date.now() - 3600000 * 2).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  },
  {
    ticketId: 'TKT-RESON-2026-8812',
    transactionId: 'TXN-JJ-6721904',
    utrNumber: 'UTR-UPI-481920394812',
    mainPerson: 'Priya Nair',
    otherMembers: ['Tanvi Kulkarni'],
    memberCount: 2,
    audienceCategory: 'Singers or Vocals',
    instrument: 'Singers or Vocals',
    recommendedSong: 'Kabira / Raabta Medley',
    handle: '@priya.melodies',
    email: 'priya.nair22@gmail.com',
    phone: '+91 98450 11920',
    paymentScreenshot: null,
    bookedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    bookedAtFormatted: new Date(Date.now() - 3600000 * 12).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }),
    status: 'Confirmed',
    checkedInAt: null
  },
  {
    ticketId: 'TKT-RESON-2026-7450',
    transactionId: 'TXN-JJ-5109283',
    utrNumber: 'UTR-ICICI-718293847102',
    mainPerson: 'Kabir & The Groove Tribe',
    otherMembers: ['Devansh', 'Kunal', 'Simran'],
    memberCount: 4,
    audienceCategory: 'Artist',
    instrument: 'Artist (Instrumentalist)',
    recommendedSong: 'Hotel California Cajon Jam',
    handle: '@kabir_beats',
    email: 'kabir.groove@outlook.com',
    phone: '+91 97110 88234',
    paymentScreenshot: null,
    bookedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    bookedAtFormatted: new Date(Date.now() - 3600000 * 24).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }),
    status: 'Checked In',
    checkedInAt: new Date(Date.now() - 3600000 * 1).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  },
  {
    ticketId: 'TKT-RESON-2026-6192',
    transactionId: 'TXN-JJ-3918274',
    utrNumber: 'UTR-GPAY-910283746192',
    mainPerson: 'Ananya Roy',
    otherMembers: [],
    memberCount: 1,
    audienceCategory: 'Listener',
    instrument: 'Listener (Audience)',
    recommendedSong: 'Experience - Ludovico Einaudi',
    handle: '@ananya_vibes',
    email: 'ananya.roy@gmail.com',
    phone: '+91 99302 77102',
    paymentScreenshot: null,
    bookedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    bookedAtFormatted: new Date(Date.now() - 3600000 * 36).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }),
    status: 'Confirmed',
    checkedInAt: null
  }
];

export function getAllTickets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_TICKETS));
      return INITIAL_DEMO_TICKETS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEMO_TICKETS;
  } catch {
    return INITIAL_DEMO_TICKETS;
  }
}

export function saveTicket(ticketData) {
  try {
    const current = getAllTickets();
    const updated = [ticketData, ...current.filter(t => t.transactionId !== ticketData.transactionId)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return ticketData;
  } catch (e) {
    console.error('Failed to save ticket', e);
    return ticketData;
  }
}

export function updateTicketStatus(transactionId, status) {
  try {
    const current = getAllTickets();
    const now = new Date();
    const updated = current.map(t => {
      if (t.transactionId === transactionId || t.utrNumber === transactionId) {
        return {
          ...t,
          status,
          checkedInAt: status === 'Checked In' 
            ? (t.checkedInAt || now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })) 
            : null
        };
      }
      return t;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update ticket status', e);
    return getAllTickets();
  }
}

export function deleteTicket(transactionId) {
  try {
    const current = getAllTickets();
    const updated = current.filter(t => t.transactionId !== transactionId && t.utrNumber !== transactionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete ticket', e);
    return getAllTickets();
  }
}

export function clearAllTickets() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    return [];
  } catch {
    return [];
  }
}

export function resetDemoTickets() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_TICKETS));
    return INITIAL_DEMO_TICKETS;
  } catch {
    return INITIAL_DEMO_TICKETS;
  }
}

export function getTicketByTxnOrId(idOrTxn) {
  if (!idOrTxn) return null;
  const tickets = getAllTickets();
  const query = idOrTxn.trim().toUpperCase();
  return tickets.find(
    t => t.transactionId?.toUpperCase() === query || 
         t.utrNumber?.toUpperCase() === query ||
         t.ticketId?.toUpperCase() === query ||
         t.transactionId?.toUpperCase().includes(query) ||
         t.utrNumber?.toUpperCase().includes(query)
  ) || null;
}

export function generateVerificationUrl(transactionId, extraData = {}) {
  const origin = window.location.origin;
  const path = window.location.pathname;
  
  // Compact encoded parameters in case scanned from another device without shared localStorage
  const payload = {
    txn: transactionId,
    utr: extraData.utrNumber || transactionId,
    name: extraData.mainPerson || 'Jammer',
    others: extraData.otherMembers || [],
    count: extraData.memberCount || 1,
    cat: extraData.audienceCategory || extraData.instrument || 'Artist',
    song: extraData.recommendedSong || extraData.songRequest || '',
    email: extraData.email || '',
    phone: extraData.phone || '',
    ig: extraData.handle || '',
    time: extraData.bookedAtFormatted || new Date().toLocaleString(),
    status: extraData.status || 'Confirmed'
  };

  try {
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
    return `${origin}${path}?verify=${transactionId}&data=${encoded}`;
  } catch {
    return `${origin}${path}?verify=${transactionId}`;
  }
}

export function decodeVerificationPayload(encodedString) {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(encodedString)))));
  } catch {
    return null;
  }
}

export function exportTicketsToCSV(tickets) {
  const headers = [
    'Transaction ID', 
    'UTR Number',
    'Ticket ID', 
    'Main Person', 
    'Other Members',
    'Total Members', 
    'Audience Category', 
    'Recommended Song', 
    'Email ID',
    'Phone Number',
    'Instagram Handle', 
    'Has Payment Screenshot',
    'Status', 
    'Booked At', 
    'Checked In At'
  ];

  const rows = tickets.map(t => [
    `"${t.transactionId || ''}"`,
    `"${t.utrNumber || ''}"`,
    `"${t.ticketId || ''}"`,
    `"${(t.mainPerson || '').replace(/"/g, '""')}"`,
    `"${(Array.isArray(t.otherMembers) ? t.otherMembers.join('; ') : '').replace(/"/g, '""')}"`,
    t.memberCount || 1,
    `"${t.audienceCategory || t.instrument || 'Artist'}"`,
    `"${(t.recommendedSong || t.songRequest || '').replace(/"/g, '""')}"`,
    `"${t.email || ''}"`,
    `"${t.phone || ''}"`,
    `"${(t.handle || '').replace(/"/g, '""')}"`,
    t.paymentScreenshot ? 'Yes (Uploaded)' : 'No',
    `"${t.status || 'Confirmed'}"`,
    `"${t.bookedAtFormatted || t.bookedAt || ''}"`,
    `"${t.checkedInAt || 'N/A'}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `reson_jam_junction_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


