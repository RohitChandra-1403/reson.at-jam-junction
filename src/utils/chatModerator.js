// Content Moderation & Anonymous Identity Engine for reson.at Jam Junction

// List of prohibited profanities, vulgarities, slurs, and inappropriate slogans
const BANNED_PATTERNS = [
  // English Profanities & Slurs
  'fuck', 'fuk', 'fck', 'f*ck', 'shit', 'sh*t', 'bitch', 'b*tch', 'bastard', 'asshole', 'a**hole',
  'dick', 'pussy', 'slut', 'whore', 'cunt', 'nigger', 'nigga', 'retard', 'faggot', 'fag', 'motherfucker',
  'bullshit', 'jackass', 'douchebag', 'cock', 'blowjob', 'porn', 'sex',

  // Hindi / Hinglish Cuss Words & Abusive Slangs
  'chutiya', 'chutiye', 'chootiya', 'bhenchod', 'behenchod', 'bhen ke lode', 'bkl', 'madarchod',
  'mc', 'bc', 'gandu', 'gaand', 'lodu', 'lauda', 'loda', 'lavde', 'harami', 'kamina', 'randi',
  'saala', 'kamina', 'bhosdike', 'bsdk', 'chut', 'jhaatu', 'jhatu', 'kutta', 'kutiya', 'chod',
  'chudwa', 'tatte', 'tatti', 'suar',

  // Offensive, Divisive or Inappropriate Political / Religious Slogans
  'murdabad', 'zindabad', 'vote for', 'go to hell', 'destroy', 'terrorist', 'kill all', 'boycott',
  'propaganda', 'hate', 'rioter', 'extremist', 'fascist', 'nazi'
];

// Fun anonymous musical identities
const ANONYMOUS_ADJECTIVES = [
  'Acoustic', 'Midnight', 'Velvet', 'Cosmic', 'Funky', 'Electric', 'Golden',
  'Mystic', 'Groovy', 'Harmonic', 'Starlight', 'Serenade', 'Rhythm', 'Echo',
  'Vintage', 'Soulful', 'Indie', 'Sunny', 'Neon', 'Chill'
];

const ANONYMOUS_ROLES = [
  { role: 'Strummer', icon: '🎸', color: 'from-amber-500 to-orange-500' },
  { role: 'Vocalist', icon: '🎙️', color: 'from-pink-500 to-rose-500' },
  { role: 'Beatmaker', icon: '🥁', color: 'from-violet-500 to-purple-600' },
  { role: 'Keys Maestro', icon: '🎹', color: 'from-cyan-400 to-blue-500' },
  { role: 'Violinist', icon: '🎻', color: 'from-emerald-400 to-teal-500' },
  { role: 'Harmonica Nomad', icon: '🎷', color: 'from-yellow-400 to-amber-600' },
  { role: 'Vinyl Drifter', icon: '🎧', color: 'from-fuchsia-500 to-pink-600' },
  { role: 'Chordsmith', icon: '🎼', color: 'from-indigo-400 to-violet-500' }
];

// Normalize text to detect leetspeak, disguised spaces and special characters
function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[@4]/g, 'a')
    .replace(/[3]/g, 'e')
    .replace(/[1!|]/g, 'i')
    .replace(/[0]/g, 'o')
    .replace(/[$5]/g, 's')
    .replace(/[*_#+~^`-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Checks whether the message contains any vulgar words, slurs, or restricted slogans.
 * @param {string} text - User message string
 * @returns {{ isBlocked: boolean, reason?: string, matched?: string }}
 */
export function validateContent(text) {
  if (!text || !text.trim()) {
    return { isBlocked: true, reason: 'Message cannot be empty.' };
  }

  const raw = text.toLowerCase();
  const normalized = normalizeText(text);

  // Check against banned patterns
  for (const banned of BANNED_PATTERNS) {
    const escaped = banned.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordRegex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');

    if (wordRegex.test(raw) || wordRegex.test(normalized) || raw.includes(banned)) {
      return {
        isBlocked: true,
        reason: 'Inappropriate language, slang, or offensive slogans are not permitted in the community jam lounge.',
        matched: banned
      };
    }
  }

  // Block links / spam
  if (/https?:\/\/|www\./i.test(raw)) {
    return {
      isBlocked: true,
      reason: 'External links are disabled in anonymous chat for security.',
      matched: 'link'
    };
  }

  // Block excessive caps shouting (more than 15 letters, >80% uppercase)
  if (text.length > 15 && text.replace(/[^A-Z]/g, '').length / text.replace(/[^A-Za-z]/g, '').length > 0.85) {
    return {
      isBlocked: true,
      reason: 'Please avoid typing in ALL CAPS shouting.',
      matched: 'caps'
    };
  }

  return { isBlocked: false };
}

/**
 * Generate a random musical anonymous identity
 */
export function generateAnonymousIdentity() {
  const adj = ANONYMOUS_ADJECTIVES[Math.floor(Math.random() * ANONYMOUS_ADJECTIVES.length)];
  const item = ANONYMOUS_ROLES[Math.floor(Math.random() * ANONYMOUS_ROLES.length)];
  const num = Math.floor(100 + Math.random() * 900);

  return {
    id: `anon-${num}-${Date.now()}`,
    name: `${adj} ${item.role} #${num}`,
    icon: item.icon,
    role: item.role,
    gradient: item.color
  };
}

// Storage Key
const CHAT_STORAGE_KEY = 'reson_jam_anonymous_chat';

// Pre-seeded authentic community discussions
const INITIAL_COMMUNITY_MESSAGES = [
  {
    id: 'msg-seed-1',
    sender: 'Midnight Strummer #384',
    icon: '🎸',
    gradient: 'from-amber-500 to-orange-500',
    text: 'Hey everyone! Is anyone bringing an acoustic 12-string guitar this weekend? 🎶',
    time: '12m ago',
    reactions: { '🎸': 5, '🔥': 3 }
  },
  {
    id: 'msg-seed-2',
    sender: 'Soulful Vocalist #712',
    icon: '🎙️',
    gradient: 'from-pink-500 to-rose-500',
    text: 'I am practicing "Kabira" and "Yellow" for the acoustic circle! Hope other vocalists join in harmonies.',
    time: '9m ago',
    reactions: { '❤️': 6, '👏': 4 }
  },
  {
    id: 'msg-seed-3',
    sender: 'Cosmic Beatmaker #901',
    icon: '🥁',
    gradient: 'from-violet-500 to-purple-600',
    text: 'Bringing two cajons and some shakers! Anyone wanting rhythmic backing, come find me near the gazebo stage.',
    time: '5m ago',
    reactions: { '🔥': 8, '🥁': 4 }
  },
  {
    id: 'msg-seed-4',
    sender: 'Vinyl Drifter #418',
    icon: '🎧',
    gradient: 'from-fuchsia-500 to-pink-600',
    text: 'First time coming to reson.at Jam Junction! Excited to just listen and absorb the acoustic energy. ✨',
    time: '2m ago',
    reactions: { '✨': 7, '❤️': 5 }
  }
];

export function getChatMessages() {
  try {
    const raw = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(INITIAL_COMMUNITY_MESSAGES));
      return INITIAL_COMMUNITY_MESSAGES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_COMMUNITY_MESSAGES;
  } catch {
    return INITIAL_COMMUNITY_MESSAGES;
  }
}

export function saveChatMessage(message) {
  try {
    const current = getChatMessages();
    const updated = [...current, message];
    // Keep max 50 recent messages
    const trimmed = updated.slice(-50);
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(trimmed));
    return trimmed;
  } catch (e) {
    console.error('Failed to save chat message', e);
    return [];
  }
}

export function updateMessageReaction(messageId, emoji) {
  try {
    const current = getChatMessages();
    const updated = current.map(m => {
      if (m.id === messageId) {
        const reactions = { ...(m.reactions || {}) };
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        return { ...m, reactions };
      }
      return m;
    });
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to update reaction', e);
    return getChatMessages();
  }
}
