import JSZip from 'jszip';
import { KnowledgeCollection } from '../types';

/**
 * Trigger file download in browser
 */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Format collection according to standard JSON schema
 */
function formatCollectionForExport(collection: KnowledgeCollection) {
  return {
    collectionName: collection.name,
    version: collection.version || 1,
    description: collection.description || 'Kumpulan soalan pemahaman / 学习练习。',
    passage: collection.passage || collection.questions.find(q => q.passage)?.passage || '',
    group: collection.group || 'General',
    difficulty: collection.difficulty || 'Standard 1',
    tags: collection.tags || [],
    questions: collection.questions.map((q) => {
      const idx = q.correctIndex >= 0 && q.correctIndex <= 3 ? q.correctIndex : 0;
      const optionLetters = ['A', 'B', 'C', 'D'];
      return {
        id: q.id,
        category: q.category || '',
        passage: q.passage || collection.passage || '',
        difficulty: q.difficulty || collection.difficulty || 'Standard 1',
        knowledgeLevel: q.knowledgeLevel || 'Analyze',
        questionType: q.questionType || 'Analysis',
        tags: q.tags || [],
        questionText: q.questionText,
        statements: q.statements || {},
        optionA: q.options[0] || '',
        optionB: q.options[1] || '',
        optionC: q.options[2] || '',
        optionD: q.options[3] || '',
        correctAnswer: optionLetters[idx],
        explanation: q.explanation || '',
        sourceReference: q.sourceReference || '',
        imageFile: q.image || '',
      };
    }),
  };
}

/**
 * Export collection as JSON
 */
export function exportCollectionAsJSON(collection: KnowledgeCollection) {
  const exportData = formatCollectionForExport(collection);
  const dataStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const filename = `${collection.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_package.json`;
  downloadBlob(blob, filename);
}

/**
 * Export collection as ZIP package
 */
export async function exportCollectionAsZIP(collection: KnowledgeCollection) {
  const zip = new JSZip();

  const exportData = formatCollectionForExport(collection);
  // Create questions.json
  zip.file('questions.json', JSON.stringify(exportData, null, 2));

  // Add images if any
  const imgFolder = zip.folder('images');
  if (imgFolder) {
    for (let i = 0; i < collection.questions.length; i++) {
      const q = collection.questions[i];
      if (q.image && q.image.startsWith('data:image/')) {
        const parts = q.image.split(',');
        const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
        const ext = mime.split('/')[1] || 'png';
        const base64Data = parts[1];
        imgFolder.file(`q_${q.id}.${ext}`, base64Data, { base64: true });
      }
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const filename = `${collection.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_package.zip`;
  downloadBlob(content, filename);
}

/**
 * Download sample JSON template matching system schema
 */
export function downloadSampleJSONTemplate() {
  const template = {
    collectionName: '华文阅读理解 - 小蜜蜂采蜜记',
    version: 1,
    description: '小学华文阅读理解专项训练。包含短文及相关理解问题。',
    passage: '清晨，天刚蒙蒙亮，小蜜蜂黄黄就飞出了蜂巢。花园里开满了五颜六色的花朵，有红彤彤的玫瑰、黄澄澄的菊花，还有雪白的百合。黄黄在一朵朵花采蜜，它把花蜜存放在腿上的小篮子里。虽然很累，但想到能为蜂群酿出甜甜的蜂蜜，黄黄心里感到非常快乐。',
    group: 'Chinese',
    difficulty: '二年级',
    tags: ['阅读理解', '华文', '短文'],
    questions: [
      {
        id: 'zh-q001',
        category: '阅读理解',
        passage: '清晨，天刚蒙蒙亮，小蜜蜂黄黄就飞出了蜂巢。花园里开满了五颜六色的花朵，有红彤彤的玫瑰、黄澄澄的菊花，还有雪白的百合。黄黄在一朵朵花采蜜，它把花蜜存放在腿上的小篮子里。虽然很累，但想到能为蜂群酿出甜甜的蜂蜜，黄黄心里感到非常快乐。',
        questionText: '根据短文，小蜜蜂黄黄是什么时候飞出蜂巢的？',
        statements: {},
        optionA: '中午太阳高照时',
        optionB: '清晨，天刚蒙蒙亮',
        optionC: '傍晚太阳落山时',
        optionD: '深夜月亮升起时',
        correctAnswer: 'B',
        explanation: '短文第一句指出“清晨，天刚蒙蒙亮，小蜜蜂黄黄就飞出了蜂巢”。',
        sourceReference: '小学华文阅读理解',
        imageFile: ''
      },
      {
        id: 'zh-q002',
        category: '阅读理解',
        passage: '清晨，天刚蒙蒙亮，小蜜蜂黄黄就飞出了蜂巢。花园里开满了五颜六色的花朵，有红彤彤的玫瑰、黄澄澄的菊花，还有雪白的百合。黄黄在一朵朵花采蜜，它把花蜜存放在腿上的小篮子里。虽然很累，但想到能为蜂群酿出甜甜的蜂蜜，黄黄心里感到非常快乐。',
        questionText: '小蜜蜂黄黄把采到的花蜜存放在哪里？',
        statements: {},
        optionA: '背上的小口袋',
        optionB: '翅膀下面',
        optionC: '腿上的小篮子里',
        optionD: '头上的帽子里',
        correctAnswer: 'C',
        explanation: '短文写道“它把花蜜存放在腿上的小篮子里”。',
        sourceReference: '小学华文阅读理解',
        imageFile: ''
      }
    ]
  };

  const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'sample_questions_template.json');
}

/**
 * Download sample CSV template matching system schema
 */
export function downloadSampleCSVTemplate() {
  const headers = [
    'ID',
    'Category',
    'Passage',
    'Question Text',
    'Option A',
    'Option B',
    'Option C',
    'Option D',
    'Correct Answer',
    'Explanation',
    'Difficulty',
    'Knowledge Level',
    'Question Type',
    'Tags',
    'Source Reference',
    'Image File'
  ];

  const sampleRow1 = [
    'zh-csv-001',
    '阅读理解',
    '清晨，天刚蒙蒙亮，小蜜蜂黄黄就飞出了蜂巢。花园里开满了五颜六色的花朵，有红彤彤的玫瑰、黄澄澄的菊花，还有雪白的百合。黄黄在一朵朵花采蜜，它把花蜜存放在腿上的小篮子里。虽然很累，但想到能为蜂群酿出甜甜的蜂蜜，黄黄心里感到非常快乐。',
    '根据短文，小蜜蜂黄黄是什么时候飞出蜂巢的？',
    '中午太阳高照时',
    '清晨，天刚蒙蒙亮',
    '傍晚太阳落山时',
    '深夜月亮升起时',
    'B',
    '短文第一句指出“清晨，天刚蒙蒙亮，小蜜蜂黄黄就飞出了蜂巢”。',
    '二年级',
    'Analyze',
    'Analysis',
    '阅读理解,华文',
    '小学华文阅读理解',
    ''
  ];

  const sampleRow2 = [
    'zh-csv-002',
    '阅读理解',
    '清晨，天刚蒙蒙亮，小蜜蜂黄黄就飞出了蜂巢。花园里开满了五颜六色的花朵，有红彤彤的玫瑰、黄澄澄的菊花，还有雪白的百合。黄黄在一朵朵花采蜜，它把花蜜存放在腿上的小篮子里。虽然很累，但想到能为蜂群酿出甜甜的蜂蜜，黄黄心里感到非常快乐。',
    '小蜜蜂黄黄把采到的花蜜存放在哪里？',
    '背上的小口袋',
    '翅膀下面',
    '腿上的小篮子里',
    '头上的帽子里',
    'C',
    '短文写道“它把花蜜存放在腿上的小篮子里”。',
    '二年级',
    'Analyze',
    'Analysis',
    '阅读理解,华文',
    '小学华文阅读理解',
    ''
  ];

  // Helper to format CSV row properly
  const formatCSVRow = (row: string[]) => {
    return row.map(val => {
      const escaped = val.replace(/"/g, '""');
      if (escaped.includes(',') || escaped.includes('\n') || escaped.includes('\r') || escaped.includes('"')) {
        return `"${escaped}"`;
      }
      return escaped;
    }).join(',');
  };

  const csvContent = [formatCSVRow(headers), formatCSVRow(sampleRow1), formatCSVRow(sampleRow2)].join('\n');
  // Use BOM for Excel UTF-8 encoding support
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, 'sample_questions_template.csv');
}

/**
 * Download sample ZIP template containing questions.json
 */
export async function downloadSampleZIPTemplate() {
  const zip = new JSZip();

  const template = {
    collectionName: '华文阅读理解 - 小蜜蜂采蜜记',
    version: 1,
    description: '小学华文阅读理解专项训练。包含短文及相关理解问题。',
    passage: '清晨，天刚蒙蒙亮，小蜜蜂黄黄就飞出了蜂巢。花园里开满了五颜六色的花朵，有红彤彤的玫瑰、黄澄澄的菊花，还有雪白的百合。黄黄在一朵朵花采蜜，它把花蜜存放在腿上的小篮子里。虽然很累，但想到能为蜂群酿出甜甜的蜂蜜，黄黄心里感到非常快乐。',
    group: 'Chinese',
    difficulty: '二年级',
    tags: [
      '阅读理解', '华文'
    ],
    questions: [
      {
        id: 'zh-q001',
        category: '阅读理解',
        passage: '清晨，天刚蒙蒙亮，小蜜蜂黄黄就飞出了蜂巢。花园里开满了五颜六色的花朵，有红彤彤的玫瑰、黄澄澄的菊花，还有雪白的百合。黄黄在一朵朵花采蜜，它把花蜜存放在腿上的小篮子里。虽然很累，但想到能为蜂群酿出甜甜的蜂蜜，黄黄心里感到非常快乐。',
        questionText: '根据短文，小蜜蜂黄黄是什么时候飞出蜂巢的？',
        statements: {},
        optionA: '中午太阳高照时',
        optionB: '清晨，天刚蒙蒙亮',
        optionC: '傍晚太阳落山时',
        optionD: '深夜月亮升起时',
        correctAnswer: 'B',
        explanation: '短文第一句指出“清晨，天刚蒙蒙亮，小蜜蜂黄黄就飞出了蜂巢”。',
        sourceReference: '小学华文阅读理解',
        imageFile: ''
      }
    ]
  };

  zip.file('questions.json', JSON.stringify(template, null, 2));
  zip.folder('images');

  const content = await zip.generateAsync({ type: 'blob' });
  downloadBlob(content, 'sample_questions_template.zip');
}

