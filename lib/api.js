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

export async function saveQuizProgress({ userId, quizType, formNumber, currentIndex, answers }) {
  const { error } = await supabase
    .from('quiz_progress')
    .upsert({
      user_id: userId,
      quiz_type: quizType,
      form_number: formNumber,
      current_index: currentIndex,
      answers,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,quiz_type,form_number' });

  if (error) console.error('[Supabase] saveQuizProgress failed:', error.message);
  else console.log('[Supabase] saveQuizProgress ok — form', formNumber, 'index', currentIndex, 'answers', Object.keys(answers).length);
  return { error };
}

export async function fetchQuizProgress(userId, quizType) {
  const { data, error } = await supabase
    .from('quiz_progress')
    .select('form_number, current_index, answers')
    .eq('user_id', userId)
    .eq('quiz_type', quizType);

  if (error) {
    console.error('[Supabase] fetchQuizProgress failed:', error.message);
    return { data: [], error };
  }
  return { data, error: null };
}

export async function deleteQuizProgress(userId, quizType, formNumber) {
  const { error } = await supabase
    .from('quiz_progress')
    .delete()
    .eq('user_id', userId)
    .eq('quiz_type', quizType)
    .eq('form_number', formNumber);

  if (error) console.error('[Supabase] deleteQuizProgress failed:', error.message);
  return { error };
}

export async function saveQuizResult({ userId, quizType, formNumber, score, totalQuestions, percentage }) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id: userId,
      quiz_type: quizType,
      form_number: formNumber,
      score,
      total_questions: totalQuestions,
      percentage,
    })
    .select()
    .single();

  if (error) {
    console.error('[Supabase] saveQuizResult failed:', error.message);
  }
  return { data, error };
}

export async function fetchUserProgress(userId) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('[Supabase] fetchUserProgress failed:', error.message);
    return { data: [], error };
  }
  return { data, error: null };
}
