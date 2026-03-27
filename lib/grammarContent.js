/**
 * Grammar lesson content for the Grammar Guide story pager.
 * Each key matches a GrammarType returned by grammarTypeFromRow().
 */

export const ROLE_COLORS = {
  subject:   '#60a5fa',  // blue-400
  verb:      '#16a34a',  // green-600  (was #4ade80 — too light)
  object:    '#c084fc',  // purple-400
  auxiliary: '#0d9488',  // teal-600   (was #34d399 — too light)
  time:      '#f87171',  // red-400
  connector: '#fbbf24',  // amber-400
  default:   '#94a3b8',  // slate-400
};

const GRAMMAR_CONTENT = {
  'Present Simple': {
    icon: 'sunny-outline',
    color: '#16a34a',
    hook: 'Describe facts, habits, and things that are always true.',
    quickLesson: {
      steps: [
        {
          title: 'Hook',
          text: 'Use it for facts, routines, and permanent states.',
        },
        {
          title: 'Rule in 10 seconds',
          text: 'Subject + base verb (add -s/-es for He/She/It).',
        },
        {
          title: 'Try it now',
          text: 'Make a sentence about your daily routine.',
        },
      ],
    },
    structureNote: 'Negative: Subject + do not / does not + base verb.',
    structureNoteTone: 'accent',
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
    whenToUse: [
      'Habits and routines (She works every day).',
      'Facts and general truths (Water boils at 100°C).',
      'Schedules and timetables (The train leaves at 7).',
    ],
    whenNotToUse: [
      'Actions happening right now (use Present Continuous).',
      'Single finished actions in the past (use Past Simple).',
    ],
    signalWords: ['always', 'usually', 'often', 'every day', 'on Mondays', 'never'],
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
    extraExamples: [
      { sentence: 'Ali reads his story every night.', note: 'Routine action.' },
      { sentence: 'Sara does not like cold weather.', note: 'Negative form with does not.' },
      { sentence: 'The sun rises in the east.', note: 'General truth.' },
      { sentence: 'Do they play football on Fridays?', note: 'Question with do.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'He go to school every day.',
        right: 'He goes to school every day.',
        why: 'Add -s/-es for He/She/It in Present Simple.',
      },
    },
    contrast: {
      title: 'Present Simple vs Present Continuous',
      note: 'Simple = routine or fact. Continuous = happening now or around now.',
      pair: [
        'I work from home. (routine)',
        'I am working from home today. (now/temporary)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Use base verb for I / You / We / They.' },
      { tone: 'success', text: 'Add -s or -es for He / She / It.' },
      { tone: 'error', text: 'Never add -s after do not / does not.' },
    ],
    tip: 'Add -s or -es to the verb only for He / She / It.',
    commonMistake: '"She go to school" ✗ → "She goes to school" ✓',
  },

  'Present Continuous': {
    icon: 'time-outline',
    color: '#60a5fa',
    hook: 'Describe actions happening right now or around this period.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use it for actions happening now or temporarily.' },
        { title: 'Rule in 10 seconds', text: 'Subject + am/is/are + verb-ing.' },
        { title: 'Try it now', text: 'Say what you are doing at this moment.' },
      ],
    },
    structureNote: 'Negative: am/is/are not + verb-ing.',
    structureNoteTone: 'accent',
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
    whenToUse: [
      'Actions happening now (She is talking).',
      'Temporary situations (I am living with my cousin).',
      'Trends/changes (Prices are rising).',
    ],
    whenNotToUse: [
      'Stative verbs (know, like, believe) - use Present Simple.',
      'Fixed routines (use Present Simple).',
    ],
    signalWords: ['now', 'right now', 'at the moment', 'currently', 'today'],
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
    extraExamples: [
      { sentence: 'They are studying for the exam this week.', note: 'Temporary action.' },
      { sentence: 'I am not working today.', note: 'Negative form with am not.' },
      { sentence: 'Is she waiting for the bus?', note: 'Question form with is.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'He are playing football.',
        right: 'He is playing football.',
        why: 'Use is with he/she/it in Present Continuous.',
      },
    },
    contrast: {
      title: 'Present Continuous vs Present Simple',
      note: 'Continuous = happening now. Simple = routine or fact.',
      pair: [
        'She is cooking now. (now)',
        'She cooks every night. (routine)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Use am/is/are + verb-ing.' },
      { tone: 'success', text: 'Great for actions happening now.' },
      { tone: 'error', text: 'Avoid stative verbs with -ing.' },
    ],
    tip: 'Use Present Continuous for actions happening at the moment of speaking.',
    commonMistake: '"I am knowing the answer" ✗ → "I know the answer" ✓ (stative verbs don\'t use -ing)',
  },

  'Present Perfect': {
    icon: 'checkmark-circle-outline',
    color: '#0d9488',
    hook: 'Connect past experiences to the present moment.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use it for experiences or results connected to now.' },
        { title: 'Rule in 10 seconds', text: 'Subject + have/has + past participle.' },
        { title: 'Try it now', text: 'Say something you have done this year.' },
      ],
    },
    structureNote: 'Negative: have/has not + past participle.',
    structureNoteTone: 'accent',
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
    whenToUse: [
      'Life experience (I have been to Japan).',
      'Recent result (She has finished her homework).',
      'Unfinished time period (We have met twice this month).',
    ],
    whenNotToUse: [
      'Finished past time (yesterday, last year) - use Past Simple.',
    ],
    signalWords: ['already', 'just', 'yet', 'ever', 'never', 'since', 'for'],
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
    extraExamples: [
      { sentence: 'I have just eaten lunch.', note: 'Recent result with just.' },
      { sentence: 'Have you ever visited London?', note: 'Question with ever.' },
      { sentence: 'They have not finished yet.', note: 'Negative with yet.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'I have went there.',
        right: 'I have gone there.',
        why: 'Use the past participle after have/has.',
      },
    },
    contrast: {
      title: 'Present Perfect vs Past Simple',
      note: 'Perfect = no specific time. Past Simple = specific finished time.',
      pair: [
        'I have seen that movie. (no time)',
        'I saw that movie last night. (specific time)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Use have/has + past participle.' },
      { tone: 'success', text: 'Use for experiences or recent results.' },
      { tone: 'error', text: 'Avoid with specific past time words.' },
    ],
    tip: 'Use "for" with a duration and "since" with a starting point.',
    commonMistake: '"I have went there yesterday" ✗ → "I went there yesterday" ✓ (use Past Simple with specific past time)',
  },

  'Past Simple': {
    icon: 'calendar-outline',
    color: '#f87171',
    hook: 'Talk about completed actions at a specific time in the past.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use it for finished actions in the past.' },
        { title: 'Rule in 10 seconds', text: 'Subject + verb (past form).' },
        { title: 'Try it now', text: 'Say what you did yesterday.' },
      ],
    },
    structureNote: 'Negative: did not + base verb.',
    structureNoteTone: 'accent',
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
    whenToUse: [
      'Finished actions (She called me).',
      'A series of past events (He woke up, ate, and left).',
      'Specific past time (in 2019, yesterday).',
    ],
    whenNotToUse: [
      'Unspecified time with present connection (use Present Perfect).',
    ],
    signalWords: ['yesterday', 'last week', 'ago', 'in 2010', 'when I was a child'],
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
    extraExamples: [
      { sentence: 'I watched a movie yesterday.', note: 'Finished action with time.' },
      { sentence: 'Did you see Anna last night?', note: 'Question with did.' },
      { sentence: 'We did not go to school on Monday.', note: 'Negative with did not.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'Did she went home?',
        right: 'Did she go home?',
        why: 'Use base verb after did.',
      },
    },
    contrast: {
      title: 'Past Simple vs Present Perfect',
      note: 'Past Simple = finished time. Present Perfect = no specific time.',
      pair: [
        'I visited Cairo last year. (finished)',
        'I have visited Cairo. (experience)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Use past form for finished actions.' },
      { tone: 'success', text: 'Add time words like yesterday or last week.' },
      { tone: 'error', text: 'Use base verb after did/did not.' },
    ],
    tip: 'Past Simple always uses the same form for all subjects (except "be": was/were).',
    commonMistake: '"Did she went?" ✗ → "Did she go?" ✓ (use base verb after did)',
  },

  'Modal Verbs': {
    icon: 'git-branch-outline',
    color: '#fbbf24',
    hook: 'Express ability, permission, possibility, and obligation.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use modals to show ability, permission, or obligation.' },
        { title: 'Rule in 10 seconds', text: 'Subject + modal + base verb.' },
        { title: 'Try it now', text: 'Make a sentence with should or can.' },
      ],
    },
    structureNote: 'Modals do not change form (no -s, -ed, or -ing).',
    structureNoteTone: 'warning',
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
    whenToUse: [
      'Ability (can), possibility (might), advice (should).',
      'Permission (may/can) and obligation (must).',
    ],
    whenNotToUse: [
      'Do not add -s, -ed, or -ing after a modal.',
    ],
    signalWords: ['can', 'could', 'may', 'might', 'must', 'should', 'will', 'would'],
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
    extraExamples: [
      { sentence: 'I can speak French.', note: 'Ability.' },
      { sentence: 'You must wear a seatbelt.', note: 'Obligation.' },
      { sentence: 'She might come later.', note: 'Possibility.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'She cans swim.',
        right: 'She can swim.',
        why: 'Modal verbs never change form.',
      },
    },
    contrast: {
      title: 'Modal vs Main Verb',
      note: 'Modals need a base verb. Main verbs can change form.',
      pair: [
        'She can drive. (modal + base)',
        'She drives. (main verb + -s)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Modal + base verb (no endings).' },
      { tone: 'success', text: 'Use for ability, permission, advice, obligation.' },
      { tone: 'error', text: 'Never add -s/-ed/-ing after a modal.' },
    ],
    tip: 'Modals never change form — no -s, -ed, or -ing endings.',
    commonMistake: '"She cans swim" ✗ → "She can swim" ✓',
  },

  'Conditionals': {
    icon: 'git-merge-outline',
    color: '#a78bfa',
    hook: 'Talk about real and imagined situations and their results.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use conditionals to talk about possible or unreal results.' },
        { title: 'Rule in 10 seconds', text: 'If + condition, result clause.' },
        { title: 'Try it now', text: 'Make a sentence with If + present, will + base.' },
      ],
    },
    structureNote: 'Never use "will" in the if-clause.',
    structureNoteTone: 'warning',
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
    whenToUse: [
      'First conditional: real future possibility.',
      'Second conditional: unreal or hypothetical present.',
    ],
    whenNotToUse: [
      'Do not use will in the if-clause.',
    ],
    signalWords: ['if', 'unless', 'would', 'could', 'will'],
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
    extraExamples: [
      { sentence: 'If it rains, we will stay inside.', note: 'First conditional.' },
      { sentence: 'If I were you, I would study more.', note: 'Second conditional.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'If I will go, I will call you.',
        right: 'If I go, I will call you.',
        why: 'No will in the if-clause.',
      },
    },
    contrast: {
      title: 'First vs Second Conditional',
      note: 'First = real possibility. Second = unreal/hypothetical.',
      pair: [
        'If I study, I will pass. (real)',
        'If I studied, I would pass. (hypothetical)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'If + condition, result clause.' },
      { tone: 'success', text: 'Choose First (real) or Second (hypothetical).' },
      { tone: 'error', text: 'Do not use will in the if-clause.' },
    ],
    tip: 'First Conditional = real possibility (If + present, will + base). Second = unreal/hypothetical (If + past, would + base).',
    commonMistake: '"If I will go" ✗ → "If I go" ✓ (never use "will" in the if-clause)',
  },

  'Passive Voice': {
    icon: 'swap-horizontal-outline',
    color: '#f87171',
    hook: 'Focus on what happens to the object, not who does the action.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use passive to focus on the receiver of the action.' },
        { title: 'Rule in 10 seconds', text: 'Subject (receiver) + be + past participle.' },
        { title: 'Try it now', text: 'Change an active sentence into passive.' },
      ],
    },
    structureNote: 'Agent (by + doer) is optional and often omitted.',
    structureNoteTone: 'accent',
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
    whenToUse: [
      'When the doer is unknown or unimportant.',
      'When the result/action is more important than the doer.',
    ],
    whenNotToUse: [
      'Avoid passive if it makes sentences unclear or too long.',
    ],
    signalWords: ['is/are', 'was/were', 'by', 'made', 'built', 'written'],
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
    extraExamples: [
      { sentence: 'The cake was eaten quickly.', note: 'Past passive.' },
      { sentence: 'The email was sent yesterday.', note: 'Passive with past time.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'The cake was ate.',
        right: 'The cake was eaten.',
        why: 'Use the past participle after be.',
      },
    },
    contrast: {
      title: 'Passive vs Active',
      note: 'Passive focuses on the receiver. Active focuses on the doer.',
      pair: [
        'The window was broken. (passive)',
        'Someone broke the window. (active)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Use be + past participle.' },
      { tone: 'success', text: 'Agent (by + doer) is optional.' },
      { tone: 'error', text: 'Do not use simple past after be.' },
    ],
    tip: 'Use passive when the doer is unknown, unimportant, or obvious from context.',
    commonMistake: '"The cake was ate" ✗ → "The cake was eaten" ✓ (use past participle, not past simple)',
  },

  'Articles': {
    icon: 'text-outline',
    color: '#60a5fa',
    hook: 'Master "a", "an", and "the" — the three most common words in English.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use articles to show specific or non-specific nouns.' },
        { title: 'Rule in 10 seconds', text: 'a/an = one of many, the = specific.' },
        { title: 'Try it now', text: 'Say: I saw __ dog. __ dog was big.' },
      ],
    },
    structureNote: 'Use a/an for first mention, the for second mention.',
    structureNoteTone: 'accent',
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
    whenToUse: [
      'a/an for one non-specific item.',
      'the for a specific or known item.',
    ],
    whenNotToUse: [
      'Do not use an before consonant sounds.',
      'Do not use a/an with uncountable nouns (use some).',
    ],
    signalWords: ['a', 'an', 'the', 'some', 'one'],
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
    extraExamples: [
      { sentence: 'She is  a teacher.', note: 'First mention, non-specific.' },
      { sentence: 'The teacher is in room 2.', note: 'Specific, known.' },
      { sentence: 'An hour is 60 minutes.', note: 'Vowel sound.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'She is the teacher. (first mention)',
        right: 'She is a teacher.',
        why: 'Use a/an for first mention.',
      },
    },
    contrast: {
      title: 'a/an vs the',
      note: 'a/an = any one, the = specific one.',
      pair: [
        'I need a pen. (any pen)',
        'The pen is on the desk. (specific pen)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'a/an = one of many.' },
      { tone: 'success', text: 'the = specific or known.' },
      { tone: 'error', text: 'Match a/an to sound, not letter.' },
    ],
    tip: '"a/an" introduces something new; "the" refers to something already known.',
    commonMistake: '"She is the teacher" (first mention) ✗ → "She is a teacher" ✓',
  },

  'Prepositions': {
    icon: 'location-outline',
    color: '#fbbf24',
    hook: 'Show relationships of time, place, and direction.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use prepositions to show time, place, or movement.' },
        { title: 'Rule in 10 seconds', text: 'Choose at/on/in based on the type of time/place.' },
        { title: 'Try it now', text: 'Say: at 3pm, on Monday, in July.' },
      ],
    },
    structureNote: 'At = point, On = surface/day, In = inside/period.',
    structureNoteTone: 'accent',
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
    whenToUse: [
      'Time: at/on/in for time expressions.',
      'Place: at/on/in for locations.',
      'Movement: to/from/through for direction.',
    ],
    whenNotToUse: [
      'Do not say in Monday (use on Monday).',
    ],
    signalWords: ['at', 'on', 'in', 'to', 'from', 'through'],
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
    extraExamples: [
      { sentence: 'We meet in July.', note: 'In + month.' },
      { sentence: 'The keys are on the table.', note: 'On + surface.' },
      { sentence: 'She walked to the park.', note: 'To + movement.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'I will see you in Monday.',
        right: 'I will see you on Monday.',
        why: 'Use on for days.',
      },
    },
    contrast: {
      title: 'At vs On vs In',
      note: 'At = point, On = surface/day, In = inside/period.',
      pair: [
        'at 7pm / on Friday / in June',
        'at the door / on the desk / in the room',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'At = exact time or point.' },
      { tone: 'success', text: 'On = day/date or surface.' },
      { tone: 'success', text: 'In = month/year/inside.' },
    ],
    tip: 'Remember: AT noon / ON Tuesday / IN July. AT = exact point, ON = surface or day, IN = inside or period.',
    commonMistake: '"in Monday" ✗ → "on Monday" ✓  |  "on the morning" ✗ → "in the morning" ✓',
  },

  'Reported Speech': {
    icon: 'chatbubbles-outline',
    color: '#c084fc',
    hook: 'Report what someone said without quoting them directly.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use it to report speech without quotes.' },
        { title: 'Rule in 10 seconds', text: 'Tense shifts back (present to past).' },
        { title: 'Try it now', text: 'Change: "I am tired" to reported speech.' },
      ],
    },
    structureNote: 'Backshift tense and pronouns when reporting.',
    structureNoteTone: 'accent',
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
    whenToUse: [
      'To report statements without quotes.',
      'When the reporting verb is in the past (said/told).',
      'To express future in the past with would or was/were going to.',
    ],
    whenNotToUse: [
      'No tense change if the reporting verb is present.',
    ],
    signalWords: ['said', 'told', 'asked', 'that', 'if', 'would', 'was going to'],
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
    extraExamples: [
      { sentence: 'She said she was happy.', note: 'I am happy -> she was happy.' },
      { sentence: 'They told me they would arrive late.', note: 'will -> would.' },
      { sentence: 'He said he was going to travel.', note: 'going to -> was going to.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'He said he will come.',
        right: 'He said he would come.',
        why: 'Backshift will to would.',
      },
    },
    contrast: {
      title: 'Direct vs Reported',
      note: 'Direct uses quotes. Reported removes quotes and backshifts tense.',
      pair: [
        'He said, "I am tired." (direct)',
        'He said he was tired. (reported)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Backshift tense after said/told.' },
      { tone: 'success', text: 'Change pronouns to match the reporter.' },
      { tone: 'error', text: 'Do not keep will after said.' },
    ],
    tip: 'Pronouns change too: "I am happy" → She said she was happy.',
    commonMistake: '"He said he will come" ✗ → "He said he would come" ✓ (backshift will→would)',
  },

  'Present Perfect Continuous': {
    icon: 'reload-circle-outline',
    color: '#38bdf8',
    hook: 'Describe an action that started in the past and is still continuing or just stopped — with a visible result now.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use it for actions that started before now and continue.' },
        { title: 'Rule in 10 seconds', text: 'Subject + have/has been + verb-ing.' },
        { title: 'Try it now', text: 'Say how long you have been doing something.' },
      ],
    },
    structureNote: 'Negative: have/has not been + verb-ing.',
    structureNoteTone: 'accent',
    ruleFormula: {
      label: 'Positive Statement',
      parts: [
        { text: 'Subject', role: 'subject', note: 'I / You / We / They / He / She / It' },
        { text: '+', role: 'connector' },
        { text: 'have / has been', role: 'auxiliary', note: '"has been" for He / She / It' },
        { text: '+', role: 'connector' },
        { text: 'Verb + -ing', role: 'verb', note: 'e.g. running, studying, waiting' },
      ],
    },
    whenToUse: [
      'Action started in past and still continuing.',
      'Recent activity with visible result (tired, wet).',
    ],
    whenNotToUse: [
      'Use Present Perfect for completed results without focus on duration.',
    ],
    signalWords: ['for', 'since', 'all day', 'lately', 'recently'],
    examples: [
      {
        sentence: 'She has been studying for three hours.',
        parts: [
          { word: 'She', role: 'subject' },
          { word: 'has been', role: 'auxiliary' },
          { word: 'studying', role: 'verb' },
          { word: 'for three hours', role: 'time' },
        ],
      },
      {
        sentence: 'They have been waiting since morning.',
        parts: [
          { word: 'They', role: 'subject' },
          { word: 'have been', role: 'auxiliary' },
          { word: 'waiting', role: 'verb' },
          { word: 'since morning', role: 'time' },
        ],
      },
    ],
    extraExamples: [
      { sentence: 'I have been working here since 2020.', note: 'Since + starting point.' },
      { sentence: 'They have been running, so they are tired.', note: 'Visible result.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'I am studying since morning.',
        right: 'I have been studying since morning.',
        why: 'Use have/has been for duration up to now.',
      },
    },
    contrast: {
      title: 'Present Perfect vs Present Perfect Continuous',
      note: 'Perfect = result. Perfect continuous = duration.',
      pair: [
        'I have finished my homework. (result)',
        'I have been doing my homework. (duration)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Use have/has been + verb-ing.' },
      { tone: 'success', text: 'Use for duration up to now.' },
      { tone: 'error', text: 'Do not use am/is/are for long actions since past.' },
    ],
    tip: 'Use "for" with a duration (for two hours) and "since" with a starting point (since 2020).',
    commonMistake: '"I am studying since morning." ✗ → "I have been studying since morning." ✓',
  },

  'Past Continuous': {
    icon: 'refresh-circle-outline',
    color: '#a78bfa',
    hook: 'Describe an action that was in progress at a specific moment in the past.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use it for actions in progress in the past.' },
        { title: 'Rule in 10 seconds', text: 'Subject + was/were + verb-ing.' },
        { title: 'Try it now', text: 'Say what you were doing at 5 pm yesterday.' },
      ],
    },
    structureNote: 'Negative: was/were not + verb-ing.',
    structureNoteTone: 'accent',
    ruleFormula: {
      label: 'Positive Statement',
      parts: [
        { text: 'Subject', role: 'subject', note: 'I / He / She / It / We / You / They' },
        { text: '+', role: 'connector' },
        { text: 'was / were', role: 'auxiliary', note: '"was" for I/He/She/It, "were" for We/You/They' },
        { text: '+', role: 'connector' },
        { text: 'Verb + -ing', role: 'verb', note: 'e.g. sleeping, eating, reading' },
      ],
    },
    whenToUse: [
      'Action in progress at a specific time in the past.',
      'Interrupted action (when + past simple).',
    ],
    whenNotToUse: [
      'Use Past Simple for short, completed actions.',
    ],
    signalWords: ['while', 'when', 'at 5 pm', 'yesterday at'],
    examples: [
      {
        sentence: 'Ali was reading when Sara called.',
        parts: [
          { word: 'Ali', role: 'subject' },
          { word: 'was', role: 'auxiliary' },
          { word: 'reading', role: 'verb' },
          { word: 'when Sara called', role: 'time' },
        ],
      },
      {
        sentence: 'They were playing football at 5 pm.',
        parts: [
          { word: 'They', role: 'subject' },
          { word: 'were', role: 'auxiliary' },
          { word: 'playing', role: 'verb' },
          { word: 'football', role: 'object' },
          { word: 'at 5 pm', role: 'time' },
        ],
      },
    ],
    extraExamples: [
      { sentence: 'We were watching TV at 8 pm.', note: 'Specific past time.' },
      { sentence: 'She was not listening.', note: 'Negative form.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'I was go to school.',
        right: 'I was going to school.',
        why: 'Use verb-ing with was/were.',
      },
    },
    contrast: {
      title: 'Past Continuous vs Past Simple',
      note: 'Continuous = background action. Simple = interrupting action.',
      pair: [
        'I was cooking when he arrived. (background)',
        'He arrived at 7 pm. (interrupt)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Use was/were + verb-ing.' },
      { tone: 'success', text: 'Use with when/while for background actions.' },
      { tone: 'error', text: 'Do not use base verb after was/were.' },
    ],
    tip: 'Often paired with Past Simple: "I was cooking when he arrived." The continuous action was interrupted.',
    commonMistake: '"I was go to school." ✗ → "I was going to school." ✓ (must add -ing)',
  },

  'Past Perfect': {
    icon: 'arrow-undo-circle-outline',
    color: '#f472b6',
    hook: 'Describe an action that was completed before another action in the past — the "earlier past".',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use it for an action before another past action.' },
        { title: 'Rule in 10 seconds', text: 'Subject + had + past participle.' },
        { title: 'Try it now', text: 'Say what you had done before you arrived.' },
      ],
    },
    structureNote: 'Negative: had not + past participle.',
    structureNoteTone: 'accent',
    ruleFormula: {
      label: 'Positive Statement',
      parts: [
        { text: 'Subject', role: 'subject', note: 'Any subject' },
        { text: '+', role: 'connector' },
        { text: 'had', role: 'auxiliary', note: 'Same for all subjects' },
        { text: '+', role: 'connector' },
        { text: 'Past Participle', role: 'verb', note: 'e.g. eaten, gone, finished, seen' },
      ],
    },
    whenToUse: [
      'Earlier past action before another past action.',
      'With before/after/by the time.',
    ],
    whenNotToUse: [
      'Use Past Simple if there is only one past action.',
    ],
    signalWords: ['before', 'after', 'by the time', 'already'],
    examples: [
      {
        sentence: 'She had left before I arrived.',
        parts: [
          { word: 'She', role: 'subject' },
          { word: 'had left', role: 'auxiliary' },
          { word: 'before I arrived', role: 'time' },
        ],
      },
      {
        sentence: 'They had already eaten when we came.',
        parts: [
          { word: 'They', role: 'subject' },
          { word: 'had already eaten', role: 'verb' },
          { word: 'when we came', role: 'time' },
        ],
      },
    ],
    extraExamples: [
      { sentence: 'By the time we came, they had finished dinner.', note: 'Earlier past.' },
      { sentence: 'He had not seen the movie before.', note: 'Negative form.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'I had went home.',
        right: 'I had gone home.',
        why: 'Use past participle after had.',
      },
    },
    contrast: {
      title: 'Past Perfect vs Past Simple',
      note: 'Past perfect = earlier past. Past simple = later past.',
      pair: [
        'She had left before I arrived. (earlier)',
        'I arrived at 6. (later)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Use had + past participle.' },
      { tone: 'success', text: 'Shows earlier past action.' },
      { tone: 'error', text: 'Do not use simple past after had.' },
    ],
    tip: 'Think of it as the "flashback tense" — it goes further back in time than Past Simple.',
    commonMistake: '"I had went" ✗ → "I had gone" ✓ (use past participle, not simple past)',
  },

  'Past Perfect Continuous': {
    icon: 'stopwatch-outline',
    color: '#22c55e',
    hook: 'Describe an action that was ongoing up to a point in the past — often with a duration.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use it for past actions that continued for some time.' },
        { title: 'Rule in 10 seconds', text: 'Subject + had been + verb-ing.' },
        { title: 'Try it now', text: 'Say what you had been doing before something happened.' },
      ],
    },
    structureNote: 'Negative: had not been + verb-ing.',
    structureNoteTone: 'accent',
    ruleFormula: {
      label: 'Positive Statement',
      parts: [
        { text: 'Subject', role: 'subject' },
        { text: '+', role: 'connector' },
        { text: 'had been', role: 'auxiliary' },
        { text: '+', role: 'connector' },
        { text: 'Verb + -ing', role: 'verb', note: 'e.g. working, studying, waiting' },
      ],
    },
    whenToUse: [
      'Ongoing past action before another past action.',
      'To emphasize duration in the past.',
    ],
    whenNotToUse: [
      'Use Past Perfect for completed results without focus on duration.',
    ],
    signalWords: ['for', 'since', 'all day', 'before', 'by the time'],
    examples: [
      {
        sentence: 'She had been studying for hours before the exam started.',
        parts: [
          { word: 'She', role: 'subject' },
          { word: 'had been', role: 'auxiliary' },
          { word: 'studying', role: 'verb' },
          { word: 'for hours', role: 'time' },
          { word: 'before the exam started', role: 'time' },
        ],
      },
      {
        sentence: 'They had been waiting since morning.',
        parts: [
          { word: 'They', role: 'subject' },
          { word: 'had been', role: 'auxiliary' },
          { word: 'waiting', role: 'verb' },
          { word: 'since morning', role: 'time' },
        ],
      },
    ],
    extraExamples: [
      { sentence: 'I was tired because I had been running.', note: 'Duration with result.' },
      { sentence: 'Had you been working there long?', note: 'Question form.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'I had been study for two hours.',
        right: 'I had been studying for two hours.',
        why: 'Use verb-ing after had been.',
      },
    },
    contrast: {
      title: 'Past Perfect vs Past Perfect Continuous',
      note: 'Perfect = result. Perfect continuous = duration.',
      pair: [
        'She had finished her work. (result)',
        'She had been working for two hours. (duration)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Use had been + verb-ing.' },
      { tone: 'success', text: 'Shows duration before a past moment.' },
      { tone: 'error', text: 'Do not use base verb after had been.' },
    ],
    tip: 'Great for explaining why something happened in the past (cause → effect).',
    commonMistake: '"I had been study" ✗ → "I had been studying" ✓',
  },

  'Future in the Past': {
    icon: 'time-outline',
    color: '#8b5cf6',
    hook: 'Talk about a future plan or prediction from a past point of view.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use it to describe “future” seen from the past.' },
        { title: 'Rule in 10 seconds', text: 'Subject + was/were going to + base verb OR would + base verb.' },
        { title: 'Try it now', text: 'Say a plan you had that did not happen.' },
      ],
    },
    structureNote: 'Use was/were going to for planned intentions; use would for predictions/decisions.',
    structureNoteTone: 'accent',
    ruleFormula: {
      label: 'Two Common Patterns',
      parts: [
        { text: 'Subject', role: 'subject' },
        { text: '+', role: 'connector' },
        { text: 'was / were going to', role: 'auxiliary' },
        { text: '+', role: 'connector' },
        { text: 'Base Verb', role: 'verb' },
      ],
    },
    whenToUse: [
      'Plans in the past that were intended (was/were going to).',
      'Predictions or decisions from a past viewpoint (would).',
    ],
    whenNotToUse: [
      'Use will/going to for future from the present.',
    ],
    signalWords: ['was/were going to', 'would', 'the next day', 'later'],
    examples: [
      {
        sentence: 'I was going to call you, but I forgot.',
        parts: [
          { word: 'I', role: 'subject' },
          { word: 'was going to', role: 'auxiliary' },
          { word: 'call', role: 'verb' },
          { word: 'you', role: 'object' },
        ],
      },
      {
        sentence: 'He said he would help later.',
        parts: [
          { word: 'He', role: 'subject' },
          { word: 'would', role: 'auxiliary' },
          { word: 'help', role: 'verb' },
          { word: 'later', role: 'time' },
        ],
      },
    ],
    extraExamples: [
      { sentence: 'We were going to leave, but it started raining.', note: 'Planned intention.' },
      { sentence: 'She thought it would be easy.', note: 'Prediction from the past.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'He was going to went there.',
        right: 'He was going to go there.',
        why: 'Use base verb after going to.',
      },
    },
    contrast: {
      title: 'Future in the Past vs Future',
      note: 'Past viewpoint uses was/were going to or would.',
      pair: [
        'I am going to travel. (future)',
        'I was going to travel. (future in the past)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Use was/were going to for past plans.' },
      { tone: 'success', text: 'Use would for past predictions/decisions.' },
      { tone: 'error', text: 'Do not use past tense after going to.' },
    ],
    tip: 'Often used in reported speech or to explain plans that changed.',
    commonMistake: '"He was going to went" ✗ → "He was going to go" ✓',
  },

  'Future Simple': {
    icon: 'rocket-outline',
    color: '#fb923c',
    hook: 'Describe decisions, predictions, or promises about the future.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use it for predictions or promises.' },
        { title: 'Rule in 10 seconds', text: 'Subject + will + base verb.' },
        { title: 'Try it now', text: 'Make a promise using will.' },
      ],
    },
    structureNote: 'Negative: will not + base verb.',
    structureNoteTone: 'accent',
    ruleFormula: {
      label: 'Positive Statement',
      parts: [
        { text: 'Subject', role: 'subject', note: 'Any subject' },
        { text: '+', role: 'connector' },
        { text: 'will', role: 'auxiliary', note: 'Same for all subjects (no -s)' },
        { text: '+', role: 'connector' },
        { text: 'Verb (base)', role: 'verb', note: 'Never add -s / -ing / -ed' },
      ],
    },
    whenToUse: [
      'Predictions (It will rain).',
      'Spontaneous decisions (I will help you).',
      'Promises (I will call you).',
    ],
    whenNotToUse: [
      'Use going to for planned intentions.',
    ],
    signalWords: ['will', 'tomorrow', 'next week', 'soon'],
    examples: [
      {
        sentence: 'Ali will call you tomorrow.',
        parts: [
          { word: 'Ali', role: 'subject' },
          { word: 'will', role: 'auxiliary' },
          { word: 'call', role: 'verb' },
          { word: 'you', role: 'object' },
          { word: 'tomorrow', role: 'time' },
        ],
      },
      {
        sentence: 'It will not rain this evening.',
        parts: [
          { word: 'It', role: 'subject' },
          { word: 'will not', role: 'auxiliary' },
          { word: 'rain', role: 'verb' },
          { word: 'this evening', role: 'time' },
        ],
      },
    ],
    extraExamples: [
      { sentence: 'I will not forget your birthday.', note: 'Negative form.' },
      { sentence: 'Will you join us?', note: 'Question form.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'She will goes home.',
        right: 'She will go home.',
        why: 'Use base verb after will.',
      },
    },
    contrast: {
      title: 'Will vs Going to',
      note: 'Will = spontaneous or prediction. Going to = plan.',
      pair: [
        'I will answer the phone. (spontaneous)',
        'I am going to visit my aunt. (plan)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Use will + base verb.' },
      { tone: 'success', text: 'Great for promises and predictions.' },
      { tone: 'error', text: 'Do not add -s/-ed after will.' },
    ],
    tip: 'Use "will" for spontaneous decisions or promises. Use "going to" for planned intentions.',
    commonMistake: '"She will goes." ✗ → "She will go." ✓ (base verb only after will)',
  },

  'Future (Going To)': {
    icon: 'navigate-outline',
    color: '#38bdf8',
    hook: 'Talk about planned intentions and predictions based on evidence.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use it for plans and evidence-based predictions.' },
        { title: 'Rule in 10 seconds', text: 'Subject + am/is/are + going to + base verb.' },
        { title: 'Try it now', text: 'Say what you are going to do this weekend.' },
      ],
    },
    structureNote: 'Negative: am/is/are not going to + base verb.',
    structureNoteTone: 'accent',
    ruleFormula: {
      label: 'Positive Statement',
      parts: [
        { text: 'Subject', role: 'subject' },
        { text: '+', role: 'connector' },
        { text: 'am / is / are', role: 'auxiliary' },
        { text: '+', role: 'connector' },
        { text: 'going to', role: 'auxiliary', note: 'Use "am" for I, "is" for he/she/it, "are" for others' },
        { text: '+', role: 'connector' },
        { text: 'Base Verb', role: 'verb' },
      ],
    },
    whenToUse: [
      'Planned intentions (I am going to visit my aunt).',
      'Predictions with evidence (Look at the clouds — it is going to rain).',
    ],
    whenNotToUse: [
      'Use will for spontaneous decisions or promises.',
    ],
    signalWords: ['going to', 'this weekend', 'soon', 'tomorrow'],
    examples: [
      {
        sentence: 'She is going to start a new course next month.',
        parts: [
          { word: 'She', role: 'subject' },
          { word: 'is', role: 'auxiliary' },
          { word: 'going to', role: 'auxiliary' },
          { word: 'start', role: 'verb' },
          { word: 'a new course', role: 'object' },
          { word: 'next month', role: 'time' },
        ],
      },
      {
        sentence: 'It is going to rain.',
        parts: [
          { word: 'It', role: 'subject' },
          { word: 'is', role: 'auxiliary' },
          { word: 'going to', role: 'auxiliary' },
          { word: 'rain', role: 'verb' },
        ],
      },
    ],
    extraExamples: [
      { sentence: 'I am not going to buy a car.', note: 'Negative form.' },
      { sentence: 'Are they going to join us?', note: 'Question form.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'He going to travel tomorrow.',
        right: 'He is going to travel tomorrow.',
        why: 'Use am/is/are before going to.',
      },
    },
    contrast: {
      title: 'Going to vs Will',
      note: 'Going to = plan or evidence. Will = spontaneous or promise.',
      pair: [
        'I am going to call my mom. (plan)',
        'I will call you now. (spontaneous)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Use am/is/are + going to + base verb.' },
      { tone: 'success', text: 'Best for plans and evidence-based predictions.' },
      { tone: 'error', text: 'Do not drop am/is/are before going to.' },
    ],
    tip: 'Use going to when you have a plan or see evidence in the present.',
    commonMistake: '"He going to travel" ✗ → "He is going to travel" ✓',
  },

  'Future Continuous': {
    icon: 'trending-up-outline',
    color: '#2dd4bf',
    hook: 'Describe an action that will be in progress at a specific moment in the future.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use it for actions in progress in the future.' },
        { title: 'Rule in 10 seconds', text: 'Subject + will be + verb-ing.' },
        { title: 'Try it now', text: 'Say what you will be doing tomorrow at 8.' },
      ],
    },
    structureNote: 'Negative: will not be + verb-ing.',
    structureNoteTone: 'accent',
    ruleFormula: {
      label: 'Positive Statement',
      parts: [
        { text: 'Subject', role: 'subject', note: 'Any subject' },
        { text: '+', role: 'connector' },
        { text: 'will be', role: 'auxiliary', note: 'Same for all subjects' },
        { text: '+', role: 'connector' },
        { text: 'Verb + -ing', role: 'verb', note: 'e.g. working, studying, traveling' },
      ],
    },
    whenToUse: [
      'Action in progress at a future time.',
      'Polite questions about plans.',
    ],
    whenNotToUse: [
      'Use Future Simple for single future actions.',
    ],
    signalWords: ['at this time tomorrow', 'next week', 'later', 'by this time'],
    examples: [
      {
        sentence: 'She will be sleeping at midnight.',
        parts: [
          { word: 'She', role: 'subject' },
          { word: 'will be', role: 'auxiliary' },
          { word: 'sleeping', role: 'verb' },
          { word: 'at midnight', role: 'time' },
        ],
      },
      {
        sentence: 'We will be traveling this time next week.',
        parts: [
          { word: 'We', role: 'subject' },
          { word: 'will be', role: 'auxiliary' },
          { word: 'traveling', role: 'verb' },
          { word: 'this time next week', role: 'time' },
        ],
      },
    ],
    extraExamples: [
      { sentence: 'Will you be using the car tonight?', note: 'Polite question.' },
      { sentence: 'I will not be working on Sunday.', note: 'Negative form.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'I will be study tonight.',
        right: 'I will be studying tonight.',
        why: 'Use verb-ing after will be.',
      },
    },
    contrast: {
      title: 'Future Continuous vs Future Simple',
      note: 'Continuous = action in progress. Simple = single action.',
      pair: [
        'I will be studying at 8. (in progress)',
        'I will study tonight. (single plan)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Use will be + verb-ing.' },
      { tone: 'success', text: 'Great for future actions in progress.' },
      { tone: 'error', text: 'Do not use base verb after will be.' },
    ],
    tip: 'Use it to describe what will be happening at a future point in time — great for polite questions: "Will you be using the car tonight?"',
    commonMistake: '"I will be study." ✗ → "I will be studying." ✓ (must add -ing)',
  },

  'Future Perfect': {
    icon: 'timer-outline',
    color: '#facc15',
    hook: 'Show that an action will be completed before a future time or event.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use it to show completion before a future moment.' },
        { title: 'Rule in 10 seconds', text: 'Subject + will have + past participle.' },
        { title: 'Try it now', text: 'Say what you will have done by next week.' },
      ],
    },
    structureNote: 'Negative: will not have + past participle.',
    structureNoteTone: 'accent',
    ruleFormula: {
      label: 'Positive Statement',
      parts: [
        { text: 'Subject', role: 'subject' },
        { text: '+', role: 'connector' },
        { text: 'will have', role: 'auxiliary' },
        { text: '+', role: 'connector' },
        { text: 'Past Participle', role: 'verb', note: 'e.g. finished, gone, written' },
      ],
    },
    whenToUse: [
      'Action completed before a future time (by Friday).',
      'Predictions about completion.',
    ],
    whenNotToUse: [
      'Use Future Simple for actions not focused on completion time.',
    ],
    signalWords: ['by', 'by the time', 'before', 'by next week'],
    examples: [
      {
        sentence: 'She will have finished the report by Friday.',
        parts: [
          { word: 'She', role: 'subject' },
          { word: 'will have', role: 'auxiliary' },
          { word: 'finished', role: 'verb' },
          { word: 'the report', role: 'object' },
          { word: 'by Friday', role: 'time' },
        ],
      },
      {
        sentence: 'They will have left before we arrive.',
        parts: [
          { word: 'They', role: 'subject' },
          { word: 'will have', role: 'auxiliary' },
          { word: 'left', role: 'verb' },
          { word: 'before we arrive', role: 'time' },
        ],
      },
    ],
    extraExamples: [
      { sentence: 'Will you have completed the course by June?', note: 'Question form.' },
      { sentence: 'I will not have saved enough by then.', note: 'Negative form.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'She will has finished by Friday.',
        right: 'She will have finished by Friday.',
        why: 'Use will have + past participle.',
      },
    },
    contrast: {
      title: 'Future Perfect vs Future Simple',
      note: 'Perfect = completed before a future time. Simple = action in the future.',
      pair: [
        'I will have finished by 6. (completed)',
        'I will finish at 6. (future action)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Use will have + past participle.' },
      { tone: 'success', text: 'Focus on completion before a future time.' },
      { tone: 'error', text: 'Do not use has after will.' },
    ],
    tip: 'Pair with "by" to show the deadline or future reference point.',
    commonMistake: '"She will has finished" ✗ → "She will have finished" ✓',
  },

  'Future Perfect Continuous': {
    icon: 'speedometer-outline',
    color: '#0ea5e9',
    hook: 'Emphasize how long an action will have been happening by a future time.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use it for duration up to a future moment.' },
        { title: 'Rule in 10 seconds', text: 'Subject + will have been + verb-ing.' },
        { title: 'Try it now', text: 'Say how long you will have been studying by Friday.' },
      ],
    },
    structureNote: 'Negative: will not have been + verb-ing.',
    structureNoteTone: 'accent',
    ruleFormula: {
      label: 'Positive Statement',
      parts: [
        { text: 'Subject', role: 'subject' },
        { text: '+', role: 'connector' },
        { text: 'will have been', role: 'auxiliary' },
        { text: '+', role: 'connector' },
        { text: 'Verb + -ing', role: 'verb', note: 'e.g. working, studying, waiting' },
      ],
    },
    whenToUse: [
      'Action continuing up to a future time.',
      'To emphasize duration (for/since) in the future.',
    ],
    whenNotToUse: [
      'Use Future Perfect for completed results without focus on duration.',
    ],
    signalWords: ['for', 'since', 'by', 'by the time', 'for two years'],
    examples: [
      {
        sentence: 'By next month, I will have been working here for two years.',
        parts: [
          { word: 'I', role: 'subject' },
          { word: 'will have been', role: 'auxiliary' },
          { word: 'working', role: 'verb' },
          { word: 'here', role: 'object' },
          { word: 'for two years', role: 'time' },
        ],
      },
      {
        sentence: 'They will have been waiting for an hour by 6 pm.',
        parts: [
          { word: 'They', role: 'subject' },
          { word: 'will have been', role: 'auxiliary' },
          { word: 'waiting', role: 'verb' },
          { word: 'for an hour', role: 'time' },
          { word: 'by 6 pm', role: 'time' },
        ],
      },
    ],
    extraExamples: [
      { sentence: 'Will you have been studying long by then?', note: 'Question form.' },
      { sentence: 'She will not have been living there for long.', note: 'Negative form.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'I will have been study for two hours.',
        right: 'I will have been studying for two hours.',
        why: 'Use verb-ing after will have been.',
      },
    },
    contrast: {
      title: 'Future Perfect vs Future Perfect Continuous',
      note: 'Perfect = completed result. Perfect continuous = duration.',
      pair: [
        'She will have finished by 6. (result)',
        'She will have been working for 3 hours by 6. (duration)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Use will have been + verb-ing.' },
      { tone: 'success', text: 'Emphasize duration up to a future time.' },
      { tone: 'error', text: 'Do not use base verb after will have been.' },
    ],
    tip: 'Use for/since to highlight how long the action continues.',
    commonMistake: '"I will have been study" ✗ → "I will have been studying" ✓',
  },

  'Comparatives': {
    icon: 'stats-chart-outline',
    color: '#0d9488',
    hook: 'Compare people, things, and ideas using adjectives and adverbs.',
    quickLesson: {
      steps: [
        { title: 'Hook', text: 'Use -er/more for comparatives and -est/most for superlatives.' },
        { title: 'Rule in 10 seconds', text: 'Short adjectives: taller. Long adjectives: more beautiful.' },
        { title: 'Try it now', text: 'Compare two things around you.' },
      ],
    },
    structureNote: 'Use than after comparatives, and the before superlatives.',
    structureNoteTone: 'accent',
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
    whenToUse: [
      'Comparatives for two items.',
      'Superlatives for three or more.',
    ],
    whenNotToUse: [
      'Do not double-compare (more taller).',
    ],
    signalWords: ['than', 'the most', 'the least', 'in', 'of'],
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
    extraExamples: [
      { sentence: 'This test is easier than the last one.', note: 'Comparative.' },
      { sentence: 'He is the fastest runner in the class.', note: 'Superlative.' },
    ],
    microPractice: {
      type: 'fix-it',
      prompt: 'Fix the mistake:',
      item: {
        wrong: 'She is more taller than me.',
        right: 'She is taller than me.',
        why: 'Do not double-compare.',
      },
    },
    contrast: {
      title: 'Comparative vs Superlative',
      note: 'Comparative = two items. Superlative = group.',
      pair: [
        'The blue car is faster than the red car. (two)',
        'The blue car is the fastest in the race. (group)',
      ],
    },
    quickSummary: [
      { tone: 'success', text: 'Short adj: -er / -est.' },
      { tone: 'success', text: 'Long adj: more / most.' },
      { tone: 'error', text: 'Do not use more + -er.' },
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
