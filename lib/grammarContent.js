/**
 * Grammar lesson content for the Grammar Guide story pager.
 * Each key matches a GrammarType returned by grammarTypeFromRow().
 */

export const ROLE_COLORS = {
  subject:   '#60a5fa',  // blue
  verb:      '#4ade80',  // green
  object:    '#c084fc',  // purple
  auxiliary: '#34d399',  // emerald
  time:      '#f87171',  // red
  connector: '#fbbf24',  // amber
  default:   '#94a3b8',  // slate
};

const GRAMMAR_CONTENT = {
  'Present Simple': {
    icon: 'sunny-outline',
    color: '#4ade80',
    hook: 'Describe facts, habits, and things that are always true.',
    ruleFormula: {
      label: 'Positive Statement',
      parts: [
        { text: 'Subject', role: 'subject', note: 'I / You / We / They / He / She / It' },
        { text: '+', role: 'connector' },
        { text: 'Verb (base)', role: 'verb', note: 'Add -s/-es for He / She / It' },
        { text: '+', role: 'connector' },
        { text: 'Object / Complement', role: 'object' },
      ],
    },
    examples: [
      {
        sentence: 'She drinks coffee every morning.',
        parts: [
          { word: 'She', role: 'subject' },
          { word: 'drinks', role: 'verb' },
          { word: 'coffee', role: 'object' },
          { word: 'every morning', role: 'time' },
        ],
      },
      {
        sentence: 'They do not watch TV.',
        parts: [
          { word: 'They', role: 'subject' },
          { word: 'do not', role: 'auxiliary' },
          { word: 'watch', role: 'verb' },
          { word: 'TV', role: 'object' },
        ],
      },
    ],
    tip: 'Add -s or -es to the verb only for He / She / It.',
    commonMistake: '"She go to school" ✗ → "She goes to school" ✓',
  },

  'Present Continuous': {
    icon: 'time-outline',
    color: '#60a5fa',
    hook: 'Describe actions happening right now or around this period.',
    ruleFormula: {
      label: 'Positive Statement',
      parts: [
        { text: 'Subject', role: 'subject', note: 'I / You / He / She / It / We / They' },
        { text: '+', role: 'connector' },
        { text: 'am / is / are', role: 'auxiliary', note: 'Use "am" for I, "is" for he/she/it, "are" for others' },
        { text: '+', role: 'connector' },
        { text: 'Verb + -ing', role: 'verb', note: 'Double the final consonant: run → running' },
      ],
    },
    examples: [
      {
        sentence: 'He is reading a book right now.',
        parts: [
          { word: 'He', role: 'subject' },
          { word: 'is', role: 'auxiliary' },
          { word: 'reading', role: 'verb' },
          { word: 'a book', role: 'object' },
          { word: 'right now', role: 'time' },
        ],
      },
      {
        sentence: 'We are not watching TV.',
        parts: [
          { word: 'We', role: 'subject' },
          { word: 'are not', role: 'auxiliary' },
          { word: 'watching', role: 'verb' },
          { word: 'TV', role: 'object' },
        ],
      },
    ],
    tip: 'Use Present Continuous for actions happening at the moment of speaking.',
    commonMistake: '"I am knowing the answer" ✗ → "I know the answer" ✓ (stative verbs don\'t use -ing)',
  },

  'Present Perfect': {
    icon: 'checkmark-circle-outline',
    color: '#34d399',
    hook: 'Connect past experiences to the present moment.',
    ruleFormula: {
      label: 'Positive Statement',
      parts: [
        { text: 'Subject', role: 'subject' },
        { text: '+', role: 'connector' },
        { text: 'have / has', role: 'auxiliary', note: 'Use "has" for He / She / It' },
        { text: '+', role: 'connector' },
        { text: 'Past Participle', role: 'verb', note: 'Regular: play→played  Irregular: go→gone' },
      ],
    },
    examples: [
      {
        sentence: 'She has lived here for ten years.',
        parts: [
          { word: 'She', role: 'subject' },
          { word: 'has', role: 'auxiliary' },
          { word: 'lived', role: 'verb' },
          { word: 'here', role: 'object' },
          { word: 'for ten years', role: 'time' },
        ],
      },
      {
        sentence: 'I have never eaten sushi.',
        parts: [
          { word: 'I', role: 'subject' },
          { word: 'have never', role: 'auxiliary' },
          { word: 'eaten', role: 'verb' },
          { word: 'sushi', role: 'object' },
        ],
      },
    ],
    tip: 'Use "for" with a duration and "since" with a starting point.',
    commonMistake: '"I have went there yesterday" ✗ → "I went there yesterday" ✓ (use Past Simple with specific past time)',
  },

  'Past Simple': {
    icon: 'calendar-outline',
    color: '#f87171',
    hook: 'Talk about completed actions at a specific time in the past.',
    ruleFormula: {
      label: 'Positive Statement',
      parts: [
        { text: 'Subject', role: 'subject' },
        { text: '+', role: 'connector' },
        { text: 'Verb (past form)', role: 'verb', note: 'Regular: add -ed  Irregular: go→went, see→saw' },
        { text: '+', role: 'connector' },
        { text: 'Object / Time', role: 'object' },
      ],
    },
    examples: [
      {
        sentence: 'They visited Paris last summer.',
        parts: [
          { word: 'They', role: 'subject' },
          { word: 'visited', role: 'verb' },
          { word: 'Paris', role: 'object' },
          { word: 'last summer', role: 'time' },
        ],
      },
      {
        sentence: 'She did not call me.',
        parts: [
          { word: 'She', role: 'subject' },
          { word: 'did not', role: 'auxiliary' },
          { word: 'call', role: 'verb' },
          { word: 'me', role: 'object' },
        ],
      },
    ],
    tip: 'Past Simple always uses the same form for all subjects (except "be": was/were).',
    commonMistake: '"Did she went?" ✗ → "Did she go?" ✓ (use base verb after did)',
  },

  'Modal Verbs': {
    icon: 'git-branch-outline',
    color: '#fbbf24',
    hook: 'Express ability, permission, possibility, and obligation.',
    ruleFormula: {
      label: 'Structure',
      parts: [
        { text: 'Subject', role: 'subject' },
        { text: '+', role: 'connector' },
        { text: 'Modal', role: 'auxiliary', note: 'can / could / may / might / must / should / will / would' },
        { text: '+', role: 'connector' },
        { text: 'Base Verb', role: 'verb', note: 'Never add -s or -ed to the base verb after a modal' },
      ],
    },
    examples: [
      {
        sentence: 'You should study more carefully.',
        parts: [
          { word: 'You', role: 'subject' },
          { word: 'should', role: 'auxiliary' },
          { word: 'study', role: 'verb' },
          { word: 'more carefully', role: 'object' },
        ],
      },
      {
        sentence: 'She can speak three languages.',
        parts: [
          { word: 'She', role: 'subject' },
          { word: 'can', role: 'auxiliary' },
          { word: 'speak', role: 'verb' },
          { word: 'three languages', role: 'object' },
        ],
      },
    ],
    tip: 'Modals never change form — no -s, -ed, or -ing endings.',
    commonMistake: '"She cans swim" ✗ → "She can swim" ✓',
  },

  'Conditionals': {
    icon: 'git-merge-outline',
    color: '#a78bfa',
    hook: 'Talk about real and imagined situations and their results.',
    ruleFormula: {
      label: 'Second Conditional (Unreal Present)',
      parts: [
        { text: 'If + Subject', role: 'subject', note: 'The condition clause' },
        { text: '+', role: 'connector' },
        { text: 'Past Simple', role: 'verb', note: 'Use "were" for all subjects in formal writing' },
        { text: ',', role: 'connector' },
        { text: 'Subject + would + base verb', role: 'object', note: 'The result clause' },
      ],
    },
    examples: [
      {
        sentence: 'If I had money, I would travel the world.',
        parts: [
          { word: 'If I had money', role: 'subject' },
          { word: ',', role: 'connector' },
          { word: 'I would', role: 'auxiliary' },
          { word: 'travel', role: 'verb' },
          { word: 'the world', role: 'object' },
        ],
      },
      {
        sentence: 'If it rains, we will stay inside.',
        parts: [
          { word: 'If it rains', role: 'subject' },
          { word: ',', role: 'connector' },
          { word: 'we will', role: 'auxiliary' },
          { word: 'stay', role: 'verb' },
          { word: 'inside', role: 'object' },
        ],
      },
    ],
    tip: 'First Conditional = real possibility (If + present, will + base). Second = unreal/hypothetical (If + past, would + base).',
    commonMistake: '"If I will go" ✗ → "If I go" ✓ (never use "will" in the if-clause)',
  },

  'Passive Voice': {
    icon: 'swap-horizontal-outline',
    color: '#f87171',
    hook: 'Focus on what happens to the object, not who does the action.',
    ruleFormula: {
      label: 'Present Passive',
      parts: [
        { text: 'Subject (receiver)', role: 'subject', note: 'The thing being acted upon' },
        { text: '+', role: 'connector' },
        { text: 'am / is / are', role: 'auxiliary' },
        { text: '+', role: 'connector' },
        { text: 'Past Participle', role: 'verb', note: 'played, built, eaten, written…' },
        { text: '(by + agent)', role: 'object', note: 'Optional — omit when agent is unknown or obvious' },
      ],
    },
    examples: [
      {
        sentence: 'The report is written by the manager.',
        parts: [
          { word: 'The report', role: 'subject' },
          { word: 'is', role: 'auxiliary' },
          { word: 'written', role: 'verb' },
          { word: 'by the manager', role: 'object' },
        ],
      },
      {
        sentence: 'English is spoken all over the world.',
        parts: [
          { word: 'English', role: 'subject' },
          { word: 'is', role: 'auxiliary' },
          { word: 'spoken', role: 'verb' },
          { word: 'all over the world', role: 'time' },
        ],
      },
    ],
    tip: 'Use passive when the doer is unknown, unimportant, or obvious from context.',
    commonMistake: '"The cake was ate" ✗ → "The cake was eaten" ✓ (use past participle, not past simple)',
  },

  'Articles': {
    icon: 'text-outline',
    color: '#60a5fa',
    hook: 'Master "a", "an", and "the" — the three most common words in English.',
    ruleFormula: {
      label: 'Article Usage',
      parts: [
        { text: 'a / an', role: 'auxiliary', note: 'Indefinite — use for any one of a group. "a" before consonant sounds, "an" before vowel sounds' },
        { text: '/', role: 'connector' },
        { text: 'the', role: 'verb', note: 'Definite — use when both speaker and listener know which one' },
        { text: '+', role: 'connector' },
        { text: 'Noun', role: 'object' },
      ],
    },
    examples: [
      {
        sentence: 'I saw a dog. The dog was brown.',
        parts: [
          { word: 'a dog', role: 'object' },
          { word: '→', role: 'connector' },
          { word: 'The dog', role: 'subject' },
          { word: 'was brown', role: 'verb' },
        ],
      },
      {
        sentence: 'An apple a day keeps the doctor away.',
        parts: [
          { word: 'An apple', role: 'subject' },
          { word: 'keeps', role: 'verb' },
          { word: 'the doctor', role: 'object' },
          { word: 'away', role: 'time' },
        ],
      },
    ],
    tip: '"a/an" introduces something new; "the" refers to something already known.',
    commonMistake: '"She is the teacher" (first mention) ✗ → "She is a teacher" ✓',
  },

  'Prepositions': {
    icon: 'location-outline',
    color: '#fbbf24',
    hook: 'Show relationships of time, place, and direction.',
    ruleFormula: {
      label: 'Common Preposition Groups',
      parts: [
        { text: 'Time', role: 'time', note: 'at (exact time), on (day/date), in (month/year/period)' },
        { text: '|', role: 'connector' },
        { text: 'Place', role: 'object', note: 'at (point), on (surface), in (enclosed space)' },
        { text: '|', role: 'connector' },
        { text: 'Movement', role: 'verb', note: 'to (direction), from (origin), through (via)' },
      ],
    },
    examples: [
      {
        sentence: 'The meeting is at 3pm on Monday.',
        parts: [
          { word: 'The meeting', role: 'subject' },
          { word: 'is', role: 'verb' },
          { word: 'at 3pm', role: 'time' },
          { word: 'on Monday', role: 'time' },
        ],
      },
      {
        sentence: 'She put the book on the table.',
        parts: [
          { word: 'She', role: 'subject' },
          { word: 'put', role: 'verb' },
          { word: 'the book', role: 'object' },
          { word: 'on the table', role: 'time' },
        ],
      },
    ],
    tip: 'Remember: AT noon / ON Tuesday / IN July. AT = exact point, ON = surface or day, IN = inside or period.',
    commonMistake: '"in Monday" ✗ → "on Monday" ✓  |  "on the morning" ✗ → "in the morning" ✓',
  },

  'Reported Speech': {
    icon: 'chatbubbles-outline',
    color: '#c084fc',
    hook: 'Report what someone said without quoting them directly.',
    ruleFormula: {
      label: 'Statement Backshift',
      parts: [
        { text: 'Subject', role: 'subject', note: 'The person reporting' },
        { text: '+', role: 'connector' },
        { text: 'said (that)', role: 'auxiliary' },
        { text: '+', role: 'connector' },
        { text: 'Reported clause', role: 'verb', note: 'Tense shifts back: present→past, will→would, can→could' },
      ],
    },
    examples: [
      {
        sentence: 'He said that he was tired.',
        parts: [
          { word: 'He', role: 'subject' },
          { word: 'said that', role: 'auxiliary' },
          { word: 'he was tired', role: 'verb' },
        ],
      },
      {
        sentence: 'She told me she would call later.',
        parts: [
          { word: 'She', role: 'subject' },
          { word: 'told me', role: 'auxiliary' },
          { word: 'she would call', role: 'verb' },
          { word: 'later', role: 'time' },
        ],
      },
    ],
    tip: 'Pronouns change too: "I am happy" → She said she was happy.',
    commonMistake: '"He said he will come" ✗ → "He said he would come" ✓ (backshift will→would)',
  },

  'Comparatives': {
    icon: 'stats-chart-outline',
    color: '#34d399',
    hook: 'Compare people, things, and ideas using adjectives and adverbs.',
    ruleFormula: {
      label: 'Comparative vs. Superlative',
      parts: [
        { text: 'Comparative', role: 'verb', note: 'Short adj: add -er (taller). Long adj: more + adj (more beautiful)' },
        { text: '|', role: 'connector' },
        { text: 'Superlative', role: 'auxiliary', note: 'Short adj: the + -est (the tallest). Long adj: the most + adj' },
        { text: '+', role: 'connector' },
        { text: 'than / in / of', role: 'object', note: 'Use "than" for comparatives, "in/of" for superlatives' },
      ],
    },
    examples: [
      {
        sentence: 'She is taller than her brother.',
        parts: [
          { word: 'She', role: 'subject' },
          { word: 'is', role: 'auxiliary' },
          { word: 'taller', role: 'verb' },
          { word: 'than her brother', role: 'object' },
        ],
      },
      {
        sentence: 'It is the most interesting book in the library.',
        parts: [
          { word: 'It', role: 'subject' },
          { word: 'is', role: 'auxiliary' },
          { word: 'the most interesting', role: 'verb' },
          { word: 'book', role: 'object' },
          { word: 'in the library', role: 'time' },
        ],
      },
    ],
    tip: 'Irregular forms: good→better→best, bad→worse→worst, far→farther→farthest.',
    commonMistake: '"more taller" ✗ → "taller" ✓ (never double-compare)',
  },
};

/**
 * Returns lesson content for a grammar type.
 * Falls back to a minimal generated object if the type is not in the map.
 */
export function getLessonContent(type) {
  if (GRAMMAR_CONTENT[type]) return GRAMMAR_CONTENT[type];
  return buildFallbackContent(type);
}

/**
 * Builds a minimal fallback lesson for unknown grammar types.
 * @param {string} type - The GrammarType string
 * @param {object[]} [questions] - Optional Supabase question rows for example generation
 */
export function buildFallbackContent(type, questions = []) {
  const firstQ = questions[0];
  return {
    icon: 'book-outline',
    color: '#818cf8',
    hook: `Learn and practice ${type} in English.`,
    ruleFormula: {
      label: 'General Structure',
      parts: [
        { text: 'Subject', role: 'subject' },
        { text: '+', role: 'connector' },
        { text: 'Verb', role: 'verb' },
        { text: '+', role: 'connector' },
        { text: 'Object / Complement', role: 'object' },
      ],
    },
    examples: firstQ
      ? [
          {
            sentence: firstQ.questiontext || `Example of ${type}.`,
            parts: [{ word: firstQ.questiontext || type, role: 'verb' }],
          },
        ]
      : [
          {
            sentence: `Practice ${type} with real questions.`,
            parts: [{ word: `Practice ${type}`, role: 'verb' }, { word: 'with real questions', role: 'object' }],
          },
        ],
    tip: `Focus on the key patterns in ${type}.`,
    commonMistake: 'Pay attention to verb forms and sentence structure.',
  };
}

export default GRAMMAR_CONTENT;
