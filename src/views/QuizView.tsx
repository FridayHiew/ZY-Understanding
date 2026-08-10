// QuizView.tsx
import React, { useState, useEffect } from 'react';
import { AppStorageState, Question, QuizConfig, QuizResult, UserAnswerRecord } from '../types';
import { calculateAndUpdateStreak, saveAppState, resolveImagePath } from '../utils/storage';
import { getTranslation } from '../utils/i18n';
import { getLocalizedCollection } from '../utils/collectionTranslations';
import { CheckCircle2, XCircle, ArrowRight, ArrowLeft, Clock, Award, RotateCcw, FileText, Check, AlertCircle, Image as ImageIcon, Grid, HelpCircle, BookOpen } from 'lucide-react';
import { quizSounds } from '../utils/sound';

interface QuizViewProps {
  appState: AppStorageState;
  config: QuizConfig;
  onFinishQuiz: (result: QuizResult) => void;
  onExitQuiz: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  appState,
  config,
  onFinishQuiz,
  onExitQuiz,
}) => {
  const { collections, quizResults, settings } = appState;
  const lang = settings.language;
  const t = (key: any) => getTranslation(lang, key);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Map<number, number>>(new Map());
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [timeSpentSeconds, setTimeSpentSeconds] = useState(0);
  const [showExplanation, setShowExplanation] = useState<Map<number, boolean>>(new Map());
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number | null>(null);
  const [showGridModal, setShowGridModal] = useState(false);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [finalResult, setFinalResult] = useState<QuizResult | null>(null);
  const [shuffledQuestionsMap, setShuffledQuestionsMap] = useState<
    Map<number, { options: [string, string, string, string]; correctIndex: number }>
  >(new Map());
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let selectedQuestions: Question[] = [];

    if (config.mode === 'PRACTICE' || config.mode === 'EXAM') {
      const col = collections.find((c) => c.id === config.collectionId) || collections[0];
      if (col && col.questions.length > 0) {
        if (config.mode === 'EXAM') {
          // EXAM mode is always randomized and capped at a maximum of 10 questions
          selectedQuestions = [...col.questions]
            .sort(() => Math.random() - 0.5)
            .slice(0, 10);
        } else {
          // PRACTICE mode keeps comprehension questions in original sequence but shuffles others
          const isComprehension = Boolean(col.passage) || col.categories?.some((cat) => /阅读|Pemahaman|Reading/.test(cat));
          selectedQuestions = isComprehension ? [...col.questions] : [...col.questions].sort(() => Math.random() - 0.5);
          if (config.questionCount) {
            selectedQuestions = selectedQuestions.slice(0, config.questionCount);
          }
        }
      }
    } else if (config.mode === 'MISTAKE_REVIEW') {
      const incorrectIds = new Set<string>();
      quizResults.forEach((res) => {
        res.answerRecords.forEach((ans) => {
          if (!ans.isCorrect) incorrectIds.add(ans.questionId);
        });
      });
      const allQs = collections.flatMap((c) => c.questions);
      selectedQuestions = allQs.filter((q) => incorrectIds.has(q.id));
      if (selectedQuestions.length === 0) {
        selectedQuestions = allQs.slice(0, 10);
      }
    } else if (config.mode === 'WEAK_TOPICS') {
      const allQs = collections.flatMap((c) => c.questions);
      selectedQuestions = [...allQs].sort(() => Math.random() - 0.5).slice(0, config.questionCount || 10);
    }

    setQuestions(selectedQuestions);

    const shuffledMap = new Map();
    selectedQuestions.forEach((q, idx) => {
      const indices = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
      const shuffledOpts: [string, string, string, string] = [
        q.options[indices[0]],
        q.options[indices[1]],
        q.options[indices[2]],
        q.options[indices[3]],
      ];
      const newCorrectIdx = indices.indexOf(q.correctIndex);
      shuffledMap.set(idx, { options: shuffledOpts, correctIndex: newCorrectIdx });
    });
    setShuffledQuestionsMap(shuffledMap);

    if (config.mode === 'EXAM' && config.timeLimitMinutes) {
      setTimeRemainingSeconds(config.timeLimitMinutes * 60);
    }
  }, [retryCount]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [currentIndex, isExamCompleted]);

  useEffect(() => {
    if (isExamCompleted) return;

    const timer = setInterval(() => {
      setTimeSpentSeconds((prev) => prev + 1);

      if (timeRemainingSeconds !== null) {
        setTimeRemainingSeconds((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemainingSeconds, isExamCompleted]);

  const currentQ = questions[currentIndex];
  const shuffledData = shuffledQuestionsMap.get(currentIndex);

  const handleSelectOptionForQuestion = (qIdx: number, optionIndex: number) => {
    if (isExamCompleted) return;

    const alreadyAnswered = userAnswers.has(qIdx);

    setUserAnswers((prev) => {
      const next = new Map(prev);
      next.set(qIdx, optionIndex);
      return next;
    });

    if (config.mode === 'PRACTICE' || config.mode === 'MISTAKE_REVIEW') {
      setShowExplanation((prev) => {
        const next = new Map(prev);
        next.set(qIdx, true);
        return next;
      });

      if (!alreadyAnswered) {
        const shuff = shuffledQuestionsMap.get(qIdx);
        if (shuff) {
          const isCorrect = optionIndex === shuff.correctIndex;
          if (isCorrect) {
            quizSounds.playRightAnswer();
          } else {
            quizSounds.playWrongAnswer();
          }
        }
      }
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    handleSelectOptionForQuestion(currentIndex, optionIndex);
  };

  const toggleFlag = (idx: number) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleFinalSubmit = () => {
    if (isExamCompleted) return;

    const records: UserAnswerRecord[] = questions.map((q, idx) => {
      const shuff = shuffledQuestionsMap.get(idx);
      const selected = userAnswers.get(idx) ?? -1;
      const isCorrect = shuff ? selected === shuff.correctIndex : false;

      return {
        questionId: q.id,
        questionText: q.questionText,
        category: q.category || 'General',
        selectedOptionIndex: selected,
        correctOptionIndex: shuff ? shuff.correctIndex : q.correctIndex,
        isCorrect,
        timeSpentSeconds: Math.round(timeSpentSeconds / Math.max(1, questions.length)),
        shuffledOptions: shuff?.options ? [...shuff.options] : [...q.options],
        originalCorrectText: q.options[q.correctIndex],
      };
    });

    const correctCount = records.filter((r) => r.isCorrect).length;
    const totalQuestions = questions.length;
    const scorePercentage = Math.round((correctCount / Math.max(1, totalQuestions)) * 100);
    const passMark = config.passMarkPercentage || appState.settings.defaultPassMark || 60;
    const passed = scorePercentage >= passMark;

    const result: QuizResult = {
      id: `res_${Date.now()}`,
      collectionId: config.collectionId,
      collectionName: config.collectionName || `${config.mode} Session`,
      mode: config.mode,
      date: new Date().toISOString(),
      totalQuestions,
      correctCount,
      scorePercentage,
      passed,
      timeSpentSeconds,
      answerRecords: records,
    };

    setFinalResult(result);
    setIsExamCompleted(true);
    onFinishQuiz(result);

    if (config.mode === 'EXAM') {
      if (passed) {
        quizSounds.playPassExam();
      } else {
        quizSounds.playFailedExam();
      }
    }
  };

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-500 mb-4">
          {lang === 'zh'
            ? '此会话没有可用题目。请导入或选择包含题目的知识库。'
            : lang === 'ms'
            ? 'Tiada soalan tersedia untuk sesi ini. Sila import atau pilih koleksi pengetahuan dengan soalan.'
            : 'No questions available for this session. Please import or select a knowledge collection with questions.'}
        </p>
        <button
          onClick={onExitQuiz}
          className="px-4 py-2 bg-indigo-600 text-white font-semibold text-xs rounded-xl"
        >
          {lang === 'zh' ? '返回首页' : lang === 'ms' ? 'Kembali ke Utama' : 'Return to Home'}
        </button>
      </div>
    );
  }

  // Render Final Exam Results Summary View
  if (isExamCompleted && finalResult) {
    return (
      <div className="space-y-6 pb-12 max-w-3xl mx-auto">
        <div className="p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center">
          <div
            className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
              finalResult.passed
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
            }`}
          >
            <Award className="w-8 h-8" />
          </div>

          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
              finalResult.passed
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
            }`}
          >
            {finalResult.passed ? t('passed') : t('failed')}
          </span>

          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
            {finalResult.scorePercentage}%
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            {lang === 'zh'
              ? `及格分数要求: ${config.passMarkPercentage || 60}%`
              : lang === 'ms'
              ? `Keperluan markah lulus: ${config.passMarkPercentage || 60}%`
              : `Pass mark requirement: ${config.passMarkPercentage || 60}%`}
          </p>

          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl mb-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">
                {lang === 'zh' ? '题目总数' : lang === 'ms' ? 'Jumlah Soalan' : 'Total Questions'}
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {finalResult.totalQuestions}
              </span>
            </div>
            <div>
              <span className="text-emerald-600 dark:text-emerald-400 block text-[10px]">
                {lang === 'zh' ? '正确题数' : lang === 'ms' ? 'Jawapan Betul' : 'Correct Answers'}
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                {finalResult.correctCount}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">
                {lang === 'zh' ? '所用时间' : lang === 'ms' ? 'Masa Diambil' : 'Time Spent'}
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {Math.floor(finalResult.timeSpentSeconds / 60)}{lang === 'zh' ? '分' : 'm'} {finalResult.timeSpentSeconds % 60}{lang === 'zh' ? '秒' : 's'}
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={onExitQuiz}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
            >
              {lang === 'zh' ? '返回首页' : lang === 'ms' ? 'Kembali ke Utama' : 'Back to Home'}
            </button>
            <button
              onClick={() => {
                setIsExamCompleted(false);
                setFinalResult(null);
                setCurrentIndex(0);
                setUserAnswers(new Map());
                setShowExplanation(new Map());
                setFlaggedQuestions(new Set());
                setTimeSpentSeconds(0);
                setShowGridModal(false);
                setRetryCount((prev) => prev + 1);
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md shadow-indigo-500/20"
            >
              {t('retryQuiz')}
            </button>
          </div>
        </div>

        {/* Detailed Answer Breakdown */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-3">
            {lang === 'zh'
              ? (config.mode === 'EXAM' ? '试卷答案回顾' : '练习答案回顾与解析')
              : lang === 'ms'
              ? (config.mode === 'EXAM' ? 'Semakan Jawapan Peperiksaan' : 'Semakan Jawapan & Penerangan')
              : (config.mode === 'EXAM' ? 'Answer Review' : 'Answer Review & Explanations')}
          </h3>

          {finalResult.answerRecords.map((ans, idx) => {
            const matchedQ = questions.find((q) => q.id === ans.questionId);
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border text-xs space-y-2 ${
                  ans.isCorrect
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    Q{idx + 1}. {ans.questionText}
                  </span>
                  {ans.isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                </div>

                {matchedQ?.statements && matchedQ.statements.length > 0 && (
                  <div className="my-2 p-2.5 rounded-lg bg-white/70 dark:bg-black/20 border border-slate-200/40 dark:border-slate-800/40 space-y-0.5">
                    {matchedQ.statements.map((stmt, sIdx) => (
                      <div key={sIdx} className="text-[11px] text-[#4E473C] dark:text-[#D1C9B8]">
                        {stmt}
                      </div>
                    ))}
                  </div>
                )}

                {matchedQ?.image && (
                  <div className="my-2 max-h-48 rounded-xl overflow-hidden border border-[#E8E2D2] dark:border-[#353B35] bg-[#F5F2EA] dark:bg-[#2D322D] flex items-center justify-center p-1.5 w-fit max-w-full">
                    <img
                      src={resolveImagePath(matchedQ.image)}
                      alt="Question diagram"
                      className="max-h-44 object-contain rounded-lg"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                {ans.shuffledOptions?.map((opt, oIdx) => {
                  const isSelected = ans.selectedOptionIndex === oIdx;
                  const isCorrectOpt = ans.correctOptionIndex === oIdx;

                  return (
                    <div
                      key={oIdx}
                      className={`p-2 rounded-lg border text-[11px] ${
                        isCorrectOpt
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 border-emerald-300 font-bold'
                          : isSelected
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 border-rose-300 font-bold'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span>{String.fromCharCode(65 + oIdx)}. {opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )})}
        </div>
      </div>
    );
  }

  // Active Quiz View
  const modeLabel = lang === 'zh'
    ? (config.mode === 'PRACTICE' ? t('practiceMode') : config.mode === 'EXAM' ? t('examMode') : config.mode === 'MISTAKE_REVIEW' ? t('mistakeReviewMode') : t('weakTopicTraining'))
    : lang === 'ms'
    ? (config.mode === 'PRACTICE' ? 'MOD LATIHAN' : config.mode === 'EXAM' ? 'MOD PEPERIKSAAN' : config.mode === 'MISTAKE_REVIEW' ? 'MOD SEMAKAN KESILAPAN' : 'LATIHAN TOPIK LEMAH')
    : `${config.mode} MODE`;

  const activeCol = collections.find((c) => c.id === config.collectionId);
  const activePassage = activeCol?.passage || questions.find((q) => q.passage)?.passage;

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      {/* Top Session Progress Bar & Controls */}
      <div className="p-4 bg-white dark:bg-[#242824] rounded-2xl border border-[#E8E2D2] dark:border-[#353B35] shadow-sm flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6D5B] dark:text-[#A3B5A4] block font-serif">
            {modeLabel}
          </span>
          <div className="text-xs font-extrabold text-[#2D2A26] dark:text-[#EAE7DF]">
            {lang === 'zh'
              ? `共 ${questions.length} 道理解题 (单页查看模式)`
              : lang === 'ms'
              ? `${questions.length} Soalan Pemahaman (Satu Halaman)`
              : `${questions.length} Comprehension Questions (Single Page)`}
          </div>
        </div>

        {timeRemainingSeconds !== null && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F2EA] dark:bg-[#2D322D] text-[#3E4A3E] dark:text-[#F5F2EA] font-mono text-xs font-bold border border-[#E8E2D2] dark:border-[#353B35]">
            <Clock className="w-4 h-4 text-[#5A6D5B]" />
            <span>
              {Math.floor(timeRemainingSeconds / 60)
                .toString()
                .padStart(2, '0')}
              :{(timeRemainingSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {config.mode === 'EXAM' && (
            <button
              onClick={() => setShowGridModal(true)}
              className="p-2 rounded-xl bg-[#F5F2EA] dark:bg-[#2D322D] text-[#2D2A26] dark:text-[#EAE7DF] text-xs font-semibold hover:bg-[#EAE5D8] transition-colors border border-[#E8E2D2] dark:border-[#353B35]"
              title={lang === 'zh' ? '题目导航网格' : lang === 'ms' ? 'Grid Penunjuk Soalan' : 'Question Navigator Grid'}
            >
              <Grid className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onExitQuiz}
            className="text-xs font-semibold px-3 py-1.5 bg-[#F5F2EA] dark:bg-[#2D322D] text-[#2D2A26] dark:text-[#EAE7DF] rounded-xl hover:bg-[#EAE5D8] transition-colors border border-[#E8E2D2] dark:border-[#353B35]"
          >
            {lang === 'zh' ? '退出' : lang === 'ms' ? 'Keluar' : 'Exit'}
          </button>
        </div>
      </div>

      {/* Reading Passage Card at the Top */}
      {activePassage && (
        <div className="p-6 bg-amber-50/80 dark:bg-[#2D322D] rounded-3xl border border-amber-200/80 dark:border-[#353B35] shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-amber-900 dark:text-[#F5F2EA] font-serif font-bold text-sm border-b border-amber-200/60 dark:border-[#353B35] pb-2.5">
            <BookOpen className="w-5 h-5 text-amber-700 dark:text-[#A3B5A4]" />
            <span>{activeCol?.name || config.collectionName || (lang === 'zh' ? '阅读短文' : 'Reading Passage')}</span>
          </div>
          <div className="text-sm text-slate-800 dark:text-[#EAE7DF] leading-relaxed font-serif whitespace-pre-line tracking-wide">
            {activePassage}
          </div>
        </div>
      )}

      {/* All Questions Stacked Below the Article on the Same Page */}
      <div className="space-y-6">
        {questions.map((qItem, qIdx) => {
          const shuff = shuffledQuestionsMap.get(qIdx);
          const selectedOpt = userAnswers.get(qIdx);
          const isFlagged = flaggedQuestions.has(qIdx);

          return (
            <div key={qItem.id || qIdx} className="p-6 bg-white dark:bg-[#242824] rounded-3xl border border-[#E8E2D2] dark:border-[#353B35] shadow-sm space-y-5">
              <div className="flex items-center justify-between text-xs text-[#7C776B] dark:text-[#A09886]">
                <span className="font-bold text-[#5A6D5B] dark:text-[#A3B5A4] px-3 py-1 rounded-lg bg-[#F5F2EA] dark:bg-[#2D322D]">
                  {lang === 'zh' ? `第 ${qIdx + 1} 题` : `Question ${qIdx + 1}`}
                </span>
                {config.mode === 'EXAM' && (
                  <button
                    onClick={() => toggleFlag(qIdx)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                      isFlagged
                        ? 'bg-[#D9C5B2] text-[#2D2A26] border-[#B8C0B0]'
                        : 'bg-[#F5F2EA] text-[#6B6559] border-[#E8E2D2] dark:bg-[#2D322D] dark:text-[#A09886] dark:border-[#353B35]'
                    }`}
                  >
                    {isFlagged ? '★ 已标记' : '☆ 标记待复查'}
                  </button>
                )}
              </div>

              <h3 className="text-base font-bold text-[#3E4A3E] dark:text-[#F5F2EA] leading-relaxed font-serif">
                {qItem.questionText}
              </h3>

              {qItem.statements && qItem.statements.length > 0 && (
                <div className="my-2.5 p-3 rounded-lg bg-[#FDFBF7] dark:bg-[#252825] border border-[#ECE7DB] dark:border-[#3A403A] space-y-1">
                  {qItem.statements.map((stmt, sIdx) => (
                    <div key={sIdx} className="text-sm text-[#4E473C] dark:text-[#D1C9B8]">
                      {stmt}
                    </div>
                  ))}
                </div>
              )}

              {qItem.image && (
                <div className="my-3 max-h-64 rounded-2xl overflow-hidden border border-[#E8E2D2] dark:border-[#353B35] bg-[#F5F2EA] dark:bg-[#2D322D] flex items-center justify-center p-2">
                  <img
                    src={resolveImagePath(qItem.image)}
                    alt="Question supporting diagram"
                    className="max-h-60 object-contain rounded-xl"
                  />
                </div>
              )}

              {/* 4 Selectable Answer Options A-D */}
              <div className="space-y-2.5 pt-1">
                {shuff?.options.map((optText, oIdx) => {
                  const isOptSelected = selectedOpt === oIdx;
                  const isCorrectOption = oIdx === shuff.correctIndex;
                  const isRevealed =
                    (config.mode === 'PRACTICE' || config.mode === 'MISTAKE_REVIEW') &&
                    showExplanation.get(qIdx);

                  let optionStyle =
                    'bg-[#F5F2EA] dark:bg-[#2D322D] border-[#E8E2D2] dark:border-[#353B35] text-[#2D2A26] dark:text-[#EAE7DF] hover:bg-[#EAE5D8]';

                  if (isOptSelected) {
                    optionStyle =
                      'bg-[#EAE5D8] dark:bg-[#383E38] border-[#5A6D5B] text-[#3E4A3E] dark:text-[#F5F2EA] font-bold shadow-sm';
                  }

                  if (isRevealed) {
                    if (isCorrectOption) {
                      optionStyle =
                        'bg-blue-100 dark:bg-blue-900/40 border-blue-400 dark:border-blue-500 text-blue-800 dark:text-blue-200 font-bold shadow-md ring-2 ring-blue-300 dark:ring-blue-500';
                    } else if (isOptSelected && !isCorrectOption) {
                      optionStyle =
                        'bg-rose-100/80 dark:bg-rose-950/60 border-rose-400 text-rose-900 dark:text-rose-200 font-bold';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOptionForQuestion(qIdx, oIdx)}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs transition-all flex items-start gap-3 ${optionStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-white/80 dark:bg-[#1C1E1C]/80 font-bold flex items-center justify-center text-xs shrink-0 border border-current opacity-80">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="mt-0.5 font-medium leading-normal">{optText}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal in Practice Mode */}
              {(config.mode === 'PRACTICE' || config.mode === 'MISTAKE_REVIEW') &&
                showExplanation.get(qIdx) && (
                  <div className="p-4 rounded-2xl bg-[#F5F2EA] dark:bg-[#2D322D] border border-[#E8E2D2] dark:border-[#353B35] text-xs space-y-1">
                    <span className="font-bold text-[#3E4A3E] dark:text-[#F5F2EA] block flex items-center gap-1.5 font-serif">
                      <HelpCircle className="w-4 h-4 text-[#5A6D5B]" />
                      {t('questionExplanation')}:
                    </span>
                    <p className="text-[#2D2A26] dark:text-[#EAE7DF] leading-relaxed">
                      {qItem.explanation || (lang === 'zh' ? '该题未提供具体解析。' : 'No explicit explanation provided.')}
                    </p>
                    {qItem.sourceReference && (
                      <div className="mt-2 pt-2 border-t border-[#EAE5D8] dark:border-[#353B35] text-[11px] text-[#5A6D5B] dark:text-[#A3B5A4] flex items-center gap-1">
                        <span className="font-bold">
                          {lang === 'zh' ? '参考来源: ' : 'Source Reference: '}
                        </span>
                        <span>{qItem.sourceReference}</span>
                      </div>
                    )}
                  </div>
                )}
            </div>
          );
        })}
      </div>

      {/* Bottom Submit Action */}
      <div className="p-5 bg-white dark:bg-[#242824] rounded-3xl border border-[#E8E2D2] dark:border-[#353B35] shadow-sm flex items-center justify-between">
        <div className="text-xs text-[#7C776B] dark:text-[#A09886] font-bold">
          {lang === 'zh'
            ? `已回答 ${userAnswers.size} / ${questions.length} 题`
            : `Answered ${userAnswers.size} / ${questions.length} Questions`}
        </div>
        <button
          onClick={handleFinalSubmit}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#3E4A3E] hover:bg-[#2E372E] text-white font-bold text-xs transition-all shadow-md"
        >
          <Check className="w-4 h-4" />
          <span>{lang === 'zh' ? '提交整页答卷' : 'Submit All Answers'}</span>
        </button>
      </div>

      {/* Grid Navigator Modal for Exam Mode */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-4">
              {lang === 'zh' ? '题目导航网格' : lang === 'ms' ? 'Grid Penunjuk Soalan' : 'Question Navigator Grid'}
            </h3>

            <div className="grid grid-cols-5 gap-2 max-h-60 overflow-y-auto mb-6">
              {questions.map((_, idx) => {
                const isAnswered = userAnswers.has(idx);
                const isCurrent = idx === currentIndex;
                const isFlagged = flaggedQuestions.has(idx);

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowGridModal(false);
                    }}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                      isCurrent
                        ? 'ring-2 ring-indigo-500 border-indigo-500'
                        : ''
                    } ${
                      isAnswered
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {idx + 1} {isFlagged ? '★' : ''}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowGridModal(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-xl"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};