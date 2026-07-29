// ImportView.tsx
import React, { useState } from 'react';
import { AppStorageState, KnowledgeCollection, ValidationReport } from '../types';
import { parseJSONImport, parseZIPImport, parseCSVImport } from '../utils/importer';
import { downloadSampleJSONTemplate, downloadSampleCSVTemplate, downloadSampleZIPTemplate } from '../utils/exporter';
import { getTranslation } from '../utils/i18n';
import { UploadCloud, FileCode, CheckCircle2, Sparkles, Copy, Check, Paperclip, FolderArchive } from 'lucide-react';

interface ImportViewProps {
  appState: AppStorageState;
  onUpdateCollections: (collections: KnowledgeCollection[]) => void;
  onNavigateTab: (tab: any) => void;
}

export const ImportView: React.FC<ImportViewProps> = ({
  appState,
  onUpdateCollections,
  onNavigateTab,
}) => {
  const { collections, settings } = appState;
  const lang = settings.language;
  const t = (key: any) => getTranslation(lang, key);
  const licenseType = appState.license?.payload.licenseType;
  const isUserOrVip = licenseType === 'USER' || licenseType === 'VIP';

  const [report, setReport] = useState<ValidationReport | null>(null);
  const [conflictStrategy, setConflictStrategy] = useState<'SKIP' | 'OVERWRITE' | 'IMPORT_NEW'>('IMPORT_NEW');
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);
  const [selectedDifficultyLevel, setSelectedDifficultyLevel] = useState<'beginner' | 'intermediate' | 'master'>('beginner');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const getPromptText = (level: 'beginner' | 'intermediate' | 'master') => {
    if (level === 'beginner') {
      return `Please generate a primary school reading comprehension collection (Standard 1-2 / Tahun 1-2 / 一二年级) with 1 reading passage and 5 questions based on the attached document(s) or text. You can output in either Option A (JSON Format) or Option B (CSV Format):

=== OPTION A: JSON FORMAT ===
Strictly output a single raw JSON object (no markdown, no code block markers, no intro text):
{
  "collectionName": "华文阅读理解 - 小蜜蜂采蜜记",
  "version": 1,
  "description": "小学华文阅读理解专项训练。包含短文及相关理解问题。",
  "passage": "清晨，天刚蒙蒙亮，小蜜蜂黄黄就飞出了蜂巢。花园里开满了五颜六色的花朵，有红彤彤的玫瑰、黄澄澄的菊花，还有雪白的百合。黄黄在一朵朵花采蜜，它把花蜜存放在腿上的小篮子里。虽然很累，但想到能为蜂群酿出甜甜的蜂蜜，黄黄心里感到非常快乐。",
  "group": "Chinese",
  "difficulty": "Tahun 2",
  "tags": ["阅读理解", "华文", "短文"],
  "questions": [
    {
      "id": "zh-q001",
      "category": "阅读理解",
      "passage": "清晨，天刚蒙蒙亮，小蜜蜂黄黄就飞出了蜂巢。花园里开满了五颜六色的花朵，有红彤彤的玫瑰、黄澄澄的菊花，还有雪白的百合。黄黄在一朵朵花采蜜，它把花蜜存放在腿上的小篮子里。虽然很累，但想到能为蜂群酿出甜甜的蜂蜜，黄黄心里感到非常快乐。",
      "questionText": "根据短文，小蜜蜂黄黄是什么时候飞出蜂巢的？",
      "statements": {},
      "optionA": "中午太阳高照时",
      "optionB": "清晨，天刚蒙蒙亮",
      "optionC": "傍晚太阳落山时",
      "optionD": "深夜月亮升起时",
      "correctAnswer": "B",
      "explanation": "短文第一句指出“清晨，天刚蒙蒙亮，小蜜蜂黄黄就飞出了蜂巢”。",
      "sourceReference": "小学华文阅读理解",
      "imageFile": ""
    }
  ]
}

=== OPTION B: CSV FORMAT ===
Strictly output a standard CSV format (include headers as first line, wrap entries containing commas or newlines in double quotes):
ID,Category,Passage,Question Text,Option A,Option B,Option C,Option D,Correct Answer,Explanation,Difficulty,Knowledge Level,Question Type,Tags,Source Reference,Image File
"zh-q001","阅读理解","清晨，天刚蒙蒙亮，小蜜蜂黄黄就飞出了蜂巢。花园里开满了五颜六色的花朵，有红彤彤的玫瑰、黄澄澄的菊花，还有雪白的百合。黄黄在一朵朵花采蜜，它把花蜜存放在腿上的小篮子里。虽然很累，但想到能为蜂群酿出甜甜的蜂蜜，黄黄心里感到非常快乐。","根据短文，小蜜蜂黄黄是什么时候飞出蜂巢的？","中午太阳高照时","清晨，天刚蒙蒙亮","傍晚太阳落山时","深夜月亮升起时","B","短文第一句指出“清晨，天刚蒙蒙亮，小蜜蜂黄黄就飞出了蜂巢”。","Tahun 2","Analyze","Analysis","阅读理解,华文","小学华文阅读理解",""`;
    } else if (level === 'intermediate') {
      return `Please generate a primary school reading comprehension collection (Standard 3-4 / Tahun 3-4 / 三四年级) with 1 passage and 5 questions based on the attached document(s) or text. You can output in either Option A (JSON Format) or Option B (CSV Format):

=== OPTION A: JSON FORMAT ===
Strictly output a single raw JSON object (no markdown, no code block markers, no intro text):
{
  "collectionName": "Pemahaman Bahasa Melayu - Rumah Saya",
  "version": 1,
  "description": "Latihan pemahaman Bahasa Melayu Sekolah Rendah.",
  "passage": "Rumah Encik Karim terletak di Kampung Murni. Di sekeliling rumahnya terdapat banyak pokok buah-buahan seperti rambutan, durian dan manggis. Setiap petang, Encik Karim dan keluarganya akan berkumpul di halaman rumah sambil menikmati buah-buahan segar.",
  "group": "Malay",
  "difficulty": "Standard 4",
  "tags": ["pemahaman", "bahasa-melayu"],
  "questions": [
    {
      "id": "bm-q001",
      "category": "Pemahaman",
      "passage": "Rumah Encik Karim terletak di Kampung Murni. Di sekeliling rumahnya terdapat banyak pokok buah-buahan seperti rambutan, durian dan manggis. Setiap petang, Encik Karim dan keluarganya akan berkumpul di halaman rumah sambil menikmati buah-buahan segar.",
      "questionText": "Di manakah rumah Encik Karim terletak?",
      "statements": {},
      "optionA": "Taman Idaman",
      "optionB": "Kampung Murni",
      "optionC": "Bandar Utama",
      "optionD": "Desa Indah",
      "correctAnswer": "B",
      "explanation": "Petikan menyatakan rumah Encik Karim terletak di Kampung Murni.",
      "sourceReference": "Buku Teks BM Tahun 4",
      "imageFile": ""
    }
  ]
}

=== OPTION B: CSV FORMAT ===
Strictly output a standard CSV format (include headers as first line, wrap entries containing commas or newlines in double quotes):
ID,Category,Passage,Question Text,Option A,Option B,Option C,Option D,Correct Answer,Explanation,Difficulty,Knowledge Level,Question Type,Tags,Source Reference,Image File
"bm-q001","Pemahaman","Rumah Encik Karim terletak di Kampung Murni...","Di manakah rumah Encik Karim terletak?","Taman Idaman","Kampung Murni","Bandar Utama","Desa Indah","B","Petikan menyatakan rumah Encik Karim terletak di Kampung Murni.","Standard 4","Analyze","Analysis","pemahaman,bm","Buku Teks BM Tahun 4",""`;
    } else {
      return `Please generate an advanced primary school reading comprehension collection (Standard 5-6 / Tahun 5-6 / 五六年级) with 1 reading passage and 5 questions based on the attached document(s) or text. You can output in either Option A (JSON Format) or Option B (CSV Format):

=== OPTION A: JSON FORMAT ===
Strictly output a single raw JSON object (no markdown, no code block markers, no intro text):
{
  "collectionName": "English Reading Comprehension - Space Exploration",
  "version": 1,
  "description": "Advanced reading comprehension exercise for Year 6.",
  "passage": "Astronauts undergo rigorous physical and psychological training before embarking on space missions. Inside the space station, microgravity allows them to float freely, but it also causes muscle loss over time. Therefore, astronauts must exercise for at least two hours daily using special equipment.",
  "group": "English",
  "difficulty": "Standard 6",
  "tags": ["comprehension", "english", "science"],
  "questions": [
    {
      "id": "en-q001",
      "category": "Comprehension",
      "passage": "Astronauts undergo rigorous physical and psychological training before embarking on space missions. Inside the space station, microgravity allows them to float freely, but it also causes muscle loss over time. Therefore, astronauts must exercise for at least two hours daily using special equipment.",
      "questionText": "Why must astronauts exercise daily in space?",
      "statements": {},
      "optionA": "To keep themselves warm",
      "optionB": "To prevent muscle loss caused by microgravity",
      "optionC": "To prepare for space walks",
      "optionD": "To pass their spare time",
      "correctAnswer": "B",
      "explanation": "The text states microgravity causes muscle loss, so astronauts exercise to prevent it.",
      "sourceReference": "English Textbook Year 6",
      "imageFile": ""
    }
  ]
}

=== OPTION B: CSV FORMAT ===
Strictly output a standard CSV format (include headers as first line, wrap entries containing commas or newlines in double quotes):
ID,Category,Passage,Question Text,Option A,Option B,Option C,Option D,Correct Answer,Explanation,Difficulty,Knowledge Level,Question Type,Tags,Source Reference,Image File
"en-q001","Comprehension","Astronauts undergo rigorous physical...","Why must astronauts exercise daily in space?","To keep warm","To prevent muscle loss caused by microgravity","To prepare for space walks","To pass time","B","The text states microgravity causes muscle loss...","Standard 6","Analyze","Analysis","comprehension,english","English Textbook Year 6",""`;
    }
  };

  const aiPromptText = getPromptText(selectedDifficultyLevel);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(aiPromptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setReport(null);
    setImportSuccessMsg(null);

    try {
      const filename = file.name.toLowerCase();
      let res: ValidationReport;

      if (filename.endsWith('.json')) {
        const text = await file.text();
        res = await parseJSONImport(text);
      } else if (filename.endsWith('.zip')) {
        const buffer = await file.arrayBuffer();
        res = await parseZIPImport(buffer);
      } else if (filename.endsWith('.csv')) {
        const text = await file.text();
        res = await parseCSVImport(text, file.name);
      } else {
        alert(t('invalidBackup'));
        setIsProcessing(false);
        return;
      }

      setReport(res);
    } catch (err: any) {
      alert(t('backupError').replace('{error}', err.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmImport = () => {
    if (!report || !report.isValid || report.extractedQuestions.length === 0) return;

    const colName = report.collectionName || (lang === 'zh' ? '导入题库' : 'Imported Collection');
    const existingIndex = collections.findIndex((c) => c.name.toLowerCase() === colName.toLowerCase());

    let updatedCollections = [...collections];

    if (existingIndex >= 0 && conflictStrategy === 'SKIP') {
      alert(lang === 'zh' ? `题库集合“${colName}”已存在，根据冲突策略已跳过导入。` : `Collection "${colName}" already exists. Import skipped based on strategy.`);
      return;
    } else if (existingIndex >= 0 && conflictStrategy === 'OVERWRITE') {
      updatedCollections[existingIndex] = {
        ...updatedCollections[existingIndex],
        description: report.collectionDescription || updatedCollections[existingIndex].description,
        passage: report.collectionPassage || report.extractedQuestions.find(q => q.passage)?.passage || updatedCollections[existingIndex].passage,
        group: report.collectionGroup || updatedCollections[existingIndex].group || 'General',
        difficulty: report.collectionDifficulty || updatedCollections[existingIndex].difficulty || 'Standard 1',
        version: report.collectionVersion || updatedCollections[existingIndex].version || 1,
        tags: report.collectionTags || updatedCollections[existingIndex].tags || [],
        updatedAt: new Date().toISOString(),
        questionCount: report.extractedQuestions.length,
        questions: report.extractedQuestions,
        categories: Array.from(new Set(report.extractedQuestions.map((q) => q.category))),
      };
    } else {
      const finalName = existingIndex >= 0 ? `${colName} (${new Date().toLocaleTimeString()})` : colName;
      const newCollection: KnowledgeCollection = {
        id: `col_${Date.now()}`,
        name: finalName,
        description: report.collectionDescription || (lang === 'zh' ? `包含 ${report.extractedQuestions.length} 道题目的导入题库。` : `Imported with ${report.extractedQuestions.length} questions.`),
        passage: report.collectionPassage || report.extractedQuestions.find(q => q.passage)?.passage,
        group: report.collectionGroup || 'General',
        difficulty: report.collectionDifficulty || 'Standard 1',
        version: report.collectionVersion || 1,
        tags: report.collectionTags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        questionCount: report.extractedQuestions.length,
        categories: Array.from(new Set(report.extractedQuestions.map((q) => q.category))),
        questions: report.extractedQuestions,
      };
      updatedCollections.push(newCollection);
    }

    onUpdateCollections(updatedCollections);
    setImportSuccessMsg(
      t('importSuccess')
        .replace('{count}', report.extractedQuestions.length)
        .replace('{name}', colName)
    );
    setReport(null);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-[#3E4A3E] dark:text-[#F5F2EA] font-serif">
          {t('importTitle')}
        </h2>
        <p className="text-xs text-[#7C776B] dark:text-[#A09886]">
          {t('importDesc')}
        </p>
      </div>

      {isUserOrVip ? (
        <div className="p-8 text-center bg-white dark:bg-[#242824] border border-[#E8E2D2] dark:border-[#353B35] rounded-3xl">
          <p className="text-sm font-semibold text-[#7C776B] dark:text-[#A09886]">
            {lang === 'zh' ? '该功能仅向管理员开放。' : lang === 'ms' ? 'Ciri ini hanya tersedia untuk Administrator.' : 'This feature is only available for Administrators.'}
          </p>
        </div>
      ) : (
        <>
          {/* File Upload Dropzone */}
          <div className="p-8 bg-white dark:bg-[#242824] border-2 border-dashed border-[#E8E2D2] dark:border-[#353B35] rounded-3xl text-center hover:border-[#5A6D5B] transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-[#5A6D5B]/10 text-[#5A6D5B] dark:text-[#A3B5A4] flex items-center justify-center mx-auto mb-3">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-sm text-[#3E4A3E] dark:text-[#F5F2EA] mb-1 font-serif">
              {t('dropFileHere')}
            </h3>
            <p className="text-xs text-[#7C776B] dark:text-[#A09886] max-w-sm mx-auto mb-4">
              {t('supportsJsonZip')}
            </p>

            <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5A6D5B] hover:bg-[#485749] text-white font-semibold text-xs cursor-pointer transition-all shadow-sm">
              <UploadCloud className="w-4 h-4" />
              <span>{t('chooseFile')}</span>
              <input
                type="file"
                accept=".json,.zip,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Pre-Import Validation & Preview Report */}
          {report && (
            <div className="p-6 bg-white dark:bg-[#242824] border border-[#E8E2D2] dark:border-[#353B35] rounded-2xl space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#E8E2D2] dark:border-[#353B35] pb-4">
                <div>
                  <h3 className="font-bold text-base text-[#3E4A3E] dark:text-[#F5F2EA] font-serif">
                    {lang === 'zh' ? '导入前数据校验报告' : 'Pre-Import Validation Report'}
                  </h3>
                  <p className="text-xs text-[#7C776B] dark:text-[#A09886]">
                    {lang === 'zh' ? '题库集合：' : 'Collection:'} <span className="font-bold text-[#2D2A26] dark:text-[#EAE7DF]">{report.collectionName}</span>
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    report.isValid
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200'
                  }`}
                >
                  {report.isValid
                    ? (lang === 'zh' ? '校验通过' : 'Validation Passed')
                    : (lang === 'zh' ? '校验失败' : 'Validation Failed')}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-[#F5F2EA] dark:bg-[#2D322D]">
                  <span className="text-[#7C776B] dark:text-[#A09886] block text-[10px]">
                    {lang === 'zh' ? '解析总数' : 'Total Parsed'}
                  </span>
                  <span className="font-bold text-[#2D2A26] dark:text-[#EAE7DF] text-sm">{report.totalRows}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
                  <span className="text-emerald-600 dark:text-emerald-400 block text-[10px]">
                    {lang === 'zh' ? '有效题目' : 'Valid Questions'}
                  </span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 text-sm">{report.validRows}</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40">
                  <span className="text-rose-600 dark:text-rose-400 block text-[10px]">
                    {lang === 'zh' ? '跳过 / 无效' : 'Skipped / Invalid'}
                  </span>
                  <span className="font-bold text-rose-700 dark:text-rose-300 text-sm">{report.invalidRows}</span>
                </div>
              </div>

              {report.errors.length > 0 && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 text-rose-700 dark:text-rose-300 text-xs space-y-1">
                  <span className="font-bold block">{lang === 'zh' ? '校验错误说明：' : 'Validation Errors:'}</span>
                  {report.errors.map((err, idx) => (
                    <p key={idx} className="text-[11px]">
                      • {lang === 'zh' ? `第 ${err.row} 行 [${err.field}]: ${err.message}` : `Row ${err.row} [${err.field}]: ${err.message}`}
                    </p>
                  ))}
                </div>
              )}

              <div className="p-4 bg-[#F5F2EA] dark:bg-[#2D322D] rounded-xl border border-[#E8E2D2] dark:border-[#353B35]">
                <label className="text-xs font-bold text-[#2D2A26] dark:text-[#EAE7DF] block mb-2">
                  {lang === 'zh' ? '若集合或题目 ID 已存在：' : 'If Collection or Question ID Exists:'}
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'IMPORT_NEW', label: lang === 'zh' ? '导入为新题库' : 'Import as New' },
                    { id: 'OVERWRITE', label: lang === 'zh' ? '覆盖现有题库' : 'Overwrite Existing' },
                    { id: 'SKIP', label: lang === 'zh' ? '跳过重复项' : 'Skip Duplicates' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setConflictStrategy(opt.id as any)}
                      className={`py-2 px-3 rounded-lg font-semibold border transition-all ${
                        conflictStrategy === opt.id
                          ? 'bg-[#5A6D5B] text-white border-[#5A6D5B] shadow-sm'
                          : 'bg-white dark:bg-[#242824] border-[#E8E2D2] dark:border-[#353B35] text-[#2D2A26] dark:text-[#EAE7DF]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setReport(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7C776B] hover:bg-[#F5F2EA] dark:hover:bg-[#2D322D]"
                >
                  {t('cancel')}
                </button>
                <button
                  disabled={!report.isValid || report.extractedQuestions.length === 0}
                  onClick={handleConfirmImport}
                  className="px-5 py-2.5 rounded-xl bg-[#5A6D5B] hover:bg-[#485749] text-white font-semibold text-xs transition-all shadow-sm disabled:opacity-50"
                >
                  {lang === 'zh' ? '确认并保存至本地数据库' : 'Confirm & Save to Local Database'}
                </button>
              </div>
            </div>
          )}

          {/* AI Prompt Template Section */}
          <div className="p-5 bg-white dark:bg-[#242824] rounded-2xl border border-[#E8E2D2] dark:border-[#353B35] shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#5A6D5B]/10 text-[#5A6D5B] dark:text-[#A3B5A4] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#3E4A3E] dark:text-[#F5F2EA] font-serif">
                    {t('aiHelper')}
                  </h3>
                  <p className="text-xs text-[#7C776B] dark:text-[#A09886]">
                    {t('aiHelperDesc')}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyPrompt}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                  copiedPrompt
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#5A6D5B] hover:bg-[#485749] text-white shadow-sm'
                }`}
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{t('copiedToClipboard')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{t('copyPrompt')}</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 border-b border-[#E8E2D2] dark:border-[#353B35] pb-3">
              <span className="text-xs font-semibold text-[#7C776B] dark:text-[#A09886] mr-1">{lang === 'zh' ? '目标难度:' : 'Target Level:'}</span>
              {(['beginner', 'intermediate', 'master'] as const).map((lvl) => {
                const isActive = selectedDifficultyLevel === lvl;
                const labels = {
                  beginner: t('easy'),
                  intermediate: t('medium'),
                  master: t('hard'),
                };
                return (
                  <button
                    key={lvl}
                    onClick={() => setSelectedDifficultyLevel(lvl)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#5A6D5B] text-white shadow-sm'
                        : 'bg-[#F5F2EA] dark:bg-[#2D322D] text-[#6B6559] dark:text-[#A09886] hover:bg-[#EAE5D8] dark:hover:bg-[#353B35]'
                    }`}
                  >
                    {labels[lvl]}
                  </button>
                );
              })}
            </div>

            <div className="relative">
              <pre className="p-4 bg-[#F5F2EA] dark:bg-[#1D211D] border border-[#E8E2D2] dark:border-[#353B35] rounded-xl text-[11px] font-mono text-[#2D2A26] dark:text-[#EAE7DF] overflow-x-auto max-h-48 whitespace-pre-wrap leading-relaxed">
                {aiPromptText}
              </pre>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#5A6D5B] dark:text-[#A3B5A4] bg-[#5A6D5B]/10 p-2.5 rounded-xl font-medium">
              <Paperclip className="w-4 h-4 shrink-0" />
              <span>
                <strong>{lang === 'zh' ? '使用说明：' : 'Instruction:'}</strong>{' '}
                {lang === 'zh'
                  ? '复制上方提示词，附带您的学习资料或 PDF 文件发送给 ChatGPT、Gemini 或 Claude 即可生成 standard JSON 题库。'
                  : 'Copy the prompt above, attach your study files/PDFs, and paste into ChatGPT or Gemini to receive a ready-to-import JSON package.'}
              </span>
            </div>
          </div>

          {/* Starter Template Downloader */}
          <div className="p-5 bg-[#F5F2EA] dark:bg-[#2D322D] rounded-2xl border border-[#E8E2D2] dark:border-[#353B35] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-[#3E4A3E] dark:text-[#F5F2EA] font-serif">
                {t('needTemplate')}
              </h4>
              <p className="text-[11px] text-[#7C776B] dark:text-[#A09886]">
                {lang === 'zh' ? '下载标准预置格式的 JSON、CSV 或 ZIP 题目模版文件' : 'Download standard pre-formatted question template for JSON, CSV or ZIP'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={downloadSampleJSONTemplate}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#242824] text-[#2D2A26] dark:text-[#EAE7DF] border border-[#E8E2D2] dark:border-[#353B35] hover:bg-[#EAE5D8] text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5 text-[#5A6D5B]" />
                <span>JSON</span>
              </button>
              <button
                onClick={downloadSampleCSVTemplate}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#242824] text-[#2D2A26] dark:text-[#EAE7DF] border border-[#E8E2D2] dark:border-[#353B35] hover:bg-[#EAE5D8] text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <FileCode className="w-3.5 h-3.5 text-emerald-600" />
                <span>CSV</span>
              </button>
              <button
                onClick={downloadSampleZIPTemplate}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#242824] text-[#2D2A26] dark:text-[#EAE7DF] border border-[#E8E2D2] dark:border-[#353B35] hover:bg-[#EAE5D8] text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <FolderArchive className="w-3.5 h-3.5 text-amber-600" />
                <span>ZIP</span>
              </button>
            </div>
          </div>

          {/* Import Success Message */}
          {importSuccessMsg && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  {importSuccessMsg}
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('library')}
                className="text-xs font-semibold px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
              >
                {t('goToLibrary')}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};