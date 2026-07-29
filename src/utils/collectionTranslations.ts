import { KnowledgeCollection, LanguageCode } from '../types';

interface LocalizedCollectionInfo {
  name: string;
  description: string;
  categories: string[];
}

const GROUP_NAME_MAP: Record<string, Record<LanguageCode, string>> = {
  '华文': { zh: '华文', ms: 'Bahasa Cina', en: 'Chinese' },
  'Bahasa Cina': { zh: '华文', ms: 'Bahasa Cina', en: 'Chinese' },
  'Chinese': { zh: '华文', ms: 'Bahasa Cina', en: 'Chinese' },

  '数学': { zh: '数学', ms: 'Matematik', en: 'Mathematics' },
  'Matematik': { zh: '数学', ms: 'Matematik', en: 'Mathematics' },
  'Mathematics': { zh: '数学', ms: 'Matematik', en: 'Mathematics' },

  '英文': { zh: '英文', ms: 'Bahasa Inggeris', en: 'English' },
  'Bahasa Inggeris': { zh: '英文', ms: 'Bahasa Inggeris', en: 'English' },
  'English': { zh: '英文', ms: 'Bahasa Inggeris', en: 'English' },

  '马来文': { zh: '马来文', ms: 'Bahasa Melayu', en: 'Bahasa Melayu' },
  'Bahasa Melayu': { zh: '马来文', ms: 'Bahasa Melayu', en: 'Bahasa Melayu' },
  'Malay': { zh: '马来文', ms: 'Bahasa Melayu', en: 'Bahasa Melayu' },

  '科学': { zh: '科学', ms: 'Sains', en: 'Science' },
  'Sains': { zh: '科学', ms: 'Sains', en: 'Science' },
  'Science': { zh: '科学', ms: 'Sains', en: 'Science' },

  '历史': { zh: '历史', ms: 'Sejarah', en: 'History' },
  'Sejarah': { zh: '历史', ms: 'Sejarah', en: 'History' },
  'History': { zh: '历史', ms: 'Sejarah', en: 'History' },

  '道德': { zh: '道德', ms: 'Pendidikan Moral', en: 'Moral Education' },
  'Pendidikan Moral': { zh: '道德', ms: 'Pendidikan Moral', en: 'Moral Education' },
  'Moral Education': { zh: '道德', ms: 'Pendidikan Moral', en: 'Moral Education' },

  'General': { zh: '通用', ms: 'Umum', en: 'General' },
  'Umum': { zh: '通用', ms: 'Umum', en: 'General' },
  '通用': { zh: '通用', ms: 'Umum', en: 'General' },
};

const SAMPLE_COLLECTION_TRANSLATIONS: Record<string, Record<LanguageCode, LocalizedCollectionInfo>> = {
  'col-chi-01': {
    zh: {
      name: '清明节的传统与习俗',
      description: '阅读关于清明节由来、扫墓祭祖与吃青团等传统习俗的短文，回答5个相关理解题。',
      categories: ['阅读理解'],
    },
    ms: {
      name: 'Tradisi & Adat Festival Qingming',
      description: 'Baca petikan tentang asal usul Festival Qingming dan adat resam, kemudian jawab 5 soalan pemahaman.',
      categories: ['Pemahaman Bacaan'],
    },
    en: {
      name: 'Qingming Festival Traditions',
      description: 'Read the short passage about Qingming Festival customs and answer 5 comprehension questions.',
      categories: ['Reading Comprehension'],
    },
  },
  'col-chi-02': {
    zh: {
      name: '小蜜蜂采蜜记',
      description: '阅读关于勤劳的小蜜蜂在花园里采集花蜜的童话故事短文，回答5个相关理解题。',
      categories: ['阅读理解'],
    },
    ms: {
      name: 'Kisah Lebah Cilik Menghisap Madu',
      description: 'Baca cerita dongeng tentang lebah rajin di taman dan jawab 5 soalan pemahaman.',
      categories: ['Pemahaman Bacaan'],
    },
    en: {
      name: 'The Little Honeybee',
      description: 'Read the story of a hard-working little bee in the garden and answer 5 comprehension questions.',
      categories: ['Reading Comprehension'],
    },
  },
  'col-sci-01': {
    zh: {
      name: '奇妙的海洋世界',
      description: '阅读关于海洋覆盖面积、蓝鲸与珊瑚礁生态环境的科学科普短文，回答5个相关问题。',
      categories: ['阅读理解'],
    },
    ms: {
      name: 'Dunia Lautan yang Menakjubkan',
      description: 'Baca petikan sains tentang lautan, paus biru dan batu karang, kemudian jawab 5 soalan.',
      categories: ['Pemahaman Bacaan'],
    },
    en: {
      name: 'The Wonderful Ocean World',
      description: 'Read the science passage about oceans, blue whales, and coral reefs, then answer 5 questions.',
      categories: ['Reading Comprehension'],
    },
  },
  'col-moral-01': {
    zh: {
      name: '守时的小猴皮皮',
      description: '阅读关于小猴子遵守时间、勤奋准备并在比赛中取得优异成绩的寓言短文，回答5个理解题。',
      categories: ['阅读理解'],
    },
    ms: {
      name: 'Monyet Pipi yang Menjaga Masa',
      description: 'Baca cerita dongeng tentang Monyet Pipi yang menepati masa, kemudian jawab 5 soalan pemahaman.',
      categories: ['Pemahaman Bacaan'],
    },
    en: {
      name: 'Pipi the Punctual Monkey',
      description: 'Read the fable about Pipi the punctual monkey and answer 5 comprehension questions.',
      categories: ['Reading Comprehension'],
    },
  },
  'col-eng-01': {
    zh: {
      name: 'The Little Seed\'s Journey',
      description: 'Read the short story about a seed growing into a sunflower, and answer 5 comprehension questions.',
      categories: ['Reading Comprehension'],
    },
    ms: {
      name: 'Perjalanan Biji Benih Cilik',
      description: 'Baca cerita pendek tentang biji benih tumbuh menjadi bunga matahari, dan jawab 5 soalan pemahaman.',
      categories: ['Pemahaman Bacaan'],
    },
    en: {
      name: 'The Little Seed\'s Journey',
      description: 'Read the short story about a seed growing into a sunflower, and answer 5 comprehension questions.',
      categories: ['Reading Comprehension'],
    },
  },
};

const DIFFICULTY_NAME_MAP: Record<string, Record<LanguageCode, string>> = {
  'Standard 1': { zh: '一年级', ms: 'Tahun 1', en: 'Standard 1' },
  'Tahun 1': { zh: '一年级', ms: 'Tahun 1', en: 'Standard 1' },
  '一年级': { zh: '一年级', ms: 'Tahun 1', en: 'Standard 1' },

  'Standard 2': { zh: '二年级', ms: 'Tahun 2', en: 'Standard 2' },
  'Tahun 2': { zh: '二年级', ms: 'Tahun 2', en: 'Standard 2' },
  '二年级': { zh: '二年级', ms: 'Tahun 2', en: 'Standard 2' },

  'Standard 3': { zh: '三年级', ms: 'Tahun 3', en: 'Standard 3' },
  'Tahun 3': { zh: '三年级', ms: 'Tahun 3', en: 'Standard 3' },
  '三年级': { zh: '三年级', ms: 'Tahun 3', en: 'Standard 3' },

  'Standard 4': { zh: '四年级', ms: 'Tahun 4', en: 'Standard 4' },
  'Tahun 4': { zh: '四年级', ms: 'Tahun 4', en: 'Standard 4' },
  '四年级': { zh: '四年级', ms: 'Tahun 4', en: 'Standard 4' },

  'Standard 5': { zh: '五年级', ms: 'Tahun 5', en: 'Standard 5' },
  'Tahun 5': { zh: '五年级', ms: 'Tahun 5', en: 'Standard 5' },
  '五年级': { zh: '五年级', ms: 'Tahun 5', en: 'Standard 5' },

  'Standard 6': { zh: '六年级', ms: 'Tahun 6', en: 'Standard 6' },
  'Tahun 6': { zh: '六年级', ms: 'Tahun 6', en: 'Standard 6' },
  '六年级': { zh: '六年级', ms: 'Tahun 6', en: 'Standard 6' },

  'Beginner': { zh: '一年级', ms: 'Tahun 1', en: 'Standard 1' },
  'Intermediate': { zh: '三年级', ms: 'Tahun 3', en: 'Standard 3' },
  'Master': { zh: '六年级', ms: 'Tahun 6', en: 'Standard 6' },
  'Expert': { zh: '六年级', ms: 'Tahun 6', en: 'Standard 6' },
};

/**
 * Get localized group name
 */
export function getLocalizedGroupName(groupName: string | undefined, lang: LanguageCode): string {
  if (!groupName) return groupName || 'General';
  const trimmed = groupName.trim();
  const mapping = GROUP_NAME_MAP[trimmed];
  if (mapping && mapping[lang]) {
    return mapping[lang];
  }
  return trimmed;
}

/**
 * Get localized difficulty name (Primary School Standard 1-6)
 */
export function getLocalizedDifficultyName(difficulty: string | undefined, lang: LanguageCode): string {
  if (!difficulty) return lang === 'zh' ? '一年级' : lang === 'ms' ? 'Tahun 1' : 'Standard 1';
  const trimmed = difficulty.trim();
  const mapping = DIFFICULTY_NAME_MAP[trimmed];
  if (mapping && mapping[lang]) {
    return mapping[lang];
  }
  return trimmed;
}

/**
 * Get localized collection with translated name, description, group, difficulty, and categories
 */
export function getLocalizedCollection(col: KnowledgeCollection, lang: LanguageCode): KnowledgeCollection {
  const localizedGroup = getLocalizedGroupName(col.group, lang);
  const localizedDifficulty = getLocalizedDifficultyName(col.difficulty, lang);
  const colTrans = SAMPLE_COLLECTION_TRANSLATIONS[col.id];

  if (colTrans && colTrans[lang]) {
    const info = colTrans[lang];
    return {
      ...col,
      name: info.name,
      description: info.description,
      group: localizedGroup,
      difficulty: localizedDifficulty,
      categories: info.categories,
    };
  }

  return {
    ...col,
    group: localizedGroup,
    difficulty: localizedDifficulty,
  };
}

/**
 * Get array of localized collections
 */
export function getLocalizedCollections(collections: KnowledgeCollection[], lang: LanguageCode): KnowledgeCollection[] {
  return collections.map((col) => getLocalizedCollection(col, lang));
}
