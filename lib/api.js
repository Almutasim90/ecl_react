import { supabase } from './supabase';

export const AUDIO_BASE_URL = 'https://ffgtgjonipvrhejwvldw.supabase.co/storage/v1/object/public/AUDIO';

export async function fetchListeningQuestions() {
  const { data, error } = await supabase
    .from('listeningquestions')
    .select('*')
    .order('formnumber', { ascending: true })
    .order('qno', { ascending: true });

  if (error) {
    console.error('[Supabase] fetchListeningQuestions failed:', error.message);
    throw new Error(`Could not load listening questions. ${error.message}`);
  }
  return data;
}

export async function fetchReadingQuestions() {
  const { data, error } = await supabase
    .from('readingquestions')
    .select('*')
    .order('formnumber', { ascending: true })
    .order('qno', { ascending: true });

  if (error) {
    console.error('[Supabase] fetchReadingQuestions failed:', error.message);
    throw new Error(`Could not load reading questions. ${error.message}`);
  }
  return data;
}

/**
 * Groups questions by formnumber.
 * Returns: { [formNumber]: question[] }
 */
export function groupByForm(questions) {
  return questions.reduce((acc, q) => {
    const key = q.formnumber;
    if (!acc[key]) acc[key] = [];
    acc[key].push(q);
    return acc;
  }, {});
}

/**
 * Returns sorted array: [{ formNumber, questions }]
 */
export function getFormList(questions) {
  const grouped = groupByForm(questions);
  return Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b)
    .map((formNumber) => ({ formNumber, questions: grouped[formNumber] }));
}

export function getAudioUrl(audioFile) {
  return `${AUDIO_BASE_URL}/${audioFile}`;
}
