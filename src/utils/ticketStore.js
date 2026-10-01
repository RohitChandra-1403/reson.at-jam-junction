// Ticket and Booking Storage Engine
const STORAGE_KEY = 'reson_jam_junction_tickets';

export function getAllTickets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
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
