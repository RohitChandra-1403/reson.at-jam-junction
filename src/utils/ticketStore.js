// Ticket and Booking Storage Engine
const STORAGE_KEY = 'reson_jam_junction_tickets';

const INITIAL_DEMO_TICKETS = [
  {
    ticketId: 'TKT-RESON-2026-9041',
    transactionId: 'TXN-JJ-8419203',
    mainPerson: 'Aryan Sharma',
    memberCount: 3,
    instrument: 'Guitarist',
    songRequest: 'Yellow - Coldplay',
    handle: '@aryan_chords',
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
    mainPerson: 'Priya Nair',
    memberCount: 2,
    instrument: 'Vocalist',
    songRequest: 'Kabira / Raabta Acoustic',
    handle: '@priya.melodies',
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
    mainPerson: 'Kabir & The Groove Tribe',
    memberCount: 4,
    instrument: 'Percussionist',
    songRequest: 'Hotel California Cajon Jam',
    handle: '@kabir_beats',
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
    mainPerson: 'Sneha Deshmukh',
    memberCount: 1,
    instrument: 'Keyboardist',
    songRequest: 'Experience - Ludovico Einaudi',
    handle: '@sneha.keys',
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
      // Seed with initial realistic demo registrations so the panel has data immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_TICKETS));
      return INITIAL_DEMO_TICKETS;
    }
    return JSON.parse(raw);
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
      if (t.transactionId === transactionId) {
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
    const updated = current.filter(t => t.transactionId !== transactionId);
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
         t.ticketId?.toUpperCase() === query ||
         t.transactionId?.toUpperCase().includes(query)
  ) || null;
}

export function generateVerificationUrl(transactionId, extraData = {}) {
  const origin = window.location.origin;
  const path = window.location.pathname;
  
  // Compact encoded parameters in case scanned from another device without shared localStorage
  const encoded = encodeURIComponent(btoa(JSON.stringify({
    txn: transactionId,
    name: extraData.mainPerson || 'Jammer',
    count: extraData.memberCount || 1,
    time: extraData.bookedAtFormatted || new Date().toLocaleString(),
    role: extraData.instrument || 'Acoustic Jammer'
  })));

  return `${origin}${path}?verify=${transactionId}&data=${encoded}`;
}

export function decodeVerificationPayload(encodedString) {
  try {
    return JSON.parse(atob(decodeURIComponent(encodedString)));
  } catch {
    return null;
  }
}

export function exportTicketsToCSV(tickets) {
  const headers = ['Transaction ID', 'Ticket ID', 'Main Person', 'Members Count', 'Instrument', 'Song Request', 'Instagram Handle', 'Status', 'Booked At', 'Checked In At'];
  const rows = tickets.map(t => [
    `"${t.transactionId || ''}"`,
    `"${t.ticketId || ''}"`,
    `"${(t.mainPerson || '').replace(/"/g, '""')}"`,
    t.memberCount || 1,
    `"${(t.instrument || '').replace(/"/g, '""')}"`,
    `"${(t.songRequest || '').replace(/"/g, '""')}"`,
    `"${(t.handle || '').replace(/"/g, '""')}"`,
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

