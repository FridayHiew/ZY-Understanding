import JSZip from 'jszip';
import { Question, ValidationReport } from '../types';

/**
 * Helper to parse CSV lines handling quoted values with commas
 */
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = '';
  let insideQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuote && nextChar === '"') {
        currentVal += '"';
        i++; // skip escaped quote
      } else {
        insideQuote = !insideQuote;
      }
    } else if (char === ',' && !insideQuote) {
      currentRow.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !insideQuote) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentVal.trim());
      if (currentRow.some((field) => field.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }

  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim());
    if (currentRow.some((field) => field.length > 0)) {
      lines.push(currentRow);
    }
  }

  return lines;
}

/**
 * Validate and format raw question objects according to VR-1, VR-2, VR-4
 * and strictly verify parameter structure (no missing or extra parameters)
 */
export function validateAndFormatQuestions(
  rawQuestions: any[],
  imagesMap?: Map<string, string> // relative image path -> data URL
): ValidationReport {
  const errors: { row: number; field: string; message: string }[] = [];
  const warnings: string[] = [];
  const extractedQuestions: Question[] = [];
  const seenIds = new Set<string>();

  const ALLOWED_QUESTION_KEYS = new Set([
    'id', 'category', 'passage', 'passagetext', 'passagecontent', 'article', '文章', '短文',
    'questiontext', 'question',
    'optiona', 'optionb', 'optionc', 'optiond', 'options',
    'correctanswer', 'correctindex', 'correct',
    'explanation', 'difficulty', 'knowledgelevel', 'questiontype', 'tags',
    'statements', 'sourcereference', 'source', 'imagefile', 'image'
  ]);

  rawQuestions.forEach((raw, idx) => {
    const rowNum = idx + 1;

    if (typeof raw !== 'object' || raw === null) {
      errors.push({ row: rowNum, field: 'format', message: '题目数据格式无效（必须为 JSON 对象或表格行）' });
      return;
    }

    // Check for unknown or extra parameters in question object
    const rawKeys = Object.keys(raw);
    const unknownKeys = rawKeys.filter((k) => {
      const norm = k.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '').toLowerCase();
      return !ALLOWED_QUESTION_KEYS.has(norm);
    });

    if (unknownKeys.length > 0) {
      errors.push({
        row: rowNum,
        field: 'extra_parameter',
        message: `包含未定义的格式参数或多余参数: "${unknownKeys.join(', ')}"`
      });
    }

    // Normalize field names
    const id = (raw.id || raw.ID || `q_${Date.now()}_${idx}`).toString().trim();
    const category = (raw.category || raw.Category || 'General').toString().trim();
    const questionText = (
      raw.questionText !== undefined ? raw.questionText :
      raw.question !== undefined ? raw.question :
      raw.Question !== undefined ? raw.Question :
      ''
    ).toString().trim();

    // Additional JSON metadata fields
    const difficulty = (raw.difficulty || 'Expert').toString().trim();
    const knowledgeLevel = (raw.knowledgeLevel || 'Analyze').toString().trim();
    const questionType = (raw.questionType || 'Analysis').toString().trim();
    const tags = Array.isArray(raw.tags)
      ? raw.tags.map((t: any) => t.toString().trim())
      : typeof raw.tags === 'string' && raw.tags.trim()
      ? raw.tags.split(/[,;\s]+/).map((t: any) => t.trim())
      : [];
    let statements: string[] | undefined = undefined;
    if (raw.statements !== undefined && raw.statements !== null) {
      if (Array.isArray(raw.statements)) {
        statements = raw.statements.map((s: any) => s.toString().trim());
      } else if (typeof raw.statements === 'string') {
        const trimmed = raw.statements.trim();
        if (trimmed) {
          if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
              const parsed = JSON.parse(trimmed);
              if (Array.isArray(parsed)) {
                statements = parsed.map((s: any) => s.toString().trim());
              } else {
                statements = [trimmed];
              }
            } catch (e) {
              statements = trimmed.split(/[;\n\r]+/).map((s: any) => s.trim()).filter(Boolean);
            }
          } else {
            statements = trimmed.split(/[;\n\r]+/).map((s: any) => s.trim()).filter(Boolean);
          }
        }
      } else if (typeof raw.statements === 'object') {
        statements = Object.entries(raw.statements).map(([key, val]) => `${key}: ${val}`);
      }
    }
    const sourceReference = (raw.sourceReference || '').toString().trim();

    // Check option parameters
    let options: [string, string, string, string] | null = null;
    if (raw.options !== undefined) {
      if (!Array.isArray(raw.options)) {
        errors.push({ row: rowNum, field: 'options', message: "参数 'options' 必须为数组" });
      } else if (raw.options.length !== 4) {
        errors.push({
          row: rowNum,
          field: 'options',
          message: `选项数组 'options' 必须包含恰好 4 个选项（当前有 ${raw.options.length} 个参数）`
        });
      } else {
        options = [
          raw.options[0].toString(),
          raw.options[1].toString(),
          raw.options[2].toString(),
          raw.options[3].toString(),
        ];
      }
    } else {
      const optA = raw.optionA !== undefined ? raw.optionA : raw.optiona;
      const optB = raw.optionB !== undefined ? raw.optionB : raw.optionb;
      const optC = raw.optionC !== undefined ? raw.optionC : raw.optionc;
      const optD = raw.optionD !== undefined ? raw.optionD : raw.optiond;

      const missingOpts: string[] = [];
      if (optA === undefined) missingOpts.push('Option A');
      if (optB === undefined) missingOpts.push('Option B');
      if (optC === undefined) missingOpts.push('Option C');
      if (optD === undefined) missingOpts.push('Option D');

      if (missingOpts.length > 0) {
        errors.push({
          row: rowNum,
          field: 'options',
          message: `缺少必需的选项参数: ${missingOpts.join(', ')}`
        });
      } else {
        options = [
          optA.toString(),
          optB.toString(),
          optC.toString(),
          optD.toString(),
        ];
      }
    }

    // Parse correct answer
    let correctIndex = -1;
    const rawCorrect = (
      raw.correctAnswer !== undefined ? raw.correctAnswer :
      raw.correctIndex !== undefined ? raw.correctIndex :
      raw.correct !== undefined ? raw.correct :
      undefined
    );

    if (rawCorrect === undefined || rawCorrect === null || rawCorrect.toString().trim() === '') {
      errors.push({ row: rowNum, field: 'correctAnswer', message: "缺少正确答案参数 'correctAnswer'" });
    } else {
      const strCorrect = rawCorrect.toString().trim().toUpperCase();
      if (strCorrect === 'A' || strCorrect === '0') correctIndex = 0;
      else if (strCorrect === 'B' || strCorrect === '1') correctIndex = 1;
      else if (strCorrect === 'C' || strCorrect === '2') correctIndex = 2;
      else if (strCorrect === 'D' || strCorrect === '3') correctIndex = 3;
      else {
        errors.push({ row: rowNum, field: 'correctAnswer', message: `正确答案参数 "${strCorrect}" 无效，必须为 A, B, C, D 或 0-3` });
      }
    }

    const explanation = (raw.explanation || raw.Explanation || '').toString().trim();
    let image = (raw.image || raw.imageFile || raw.Image || '').toString().trim();
    const passage = (raw.passage || raw.Passage || raw.passageText || raw.article || raw.文章 || raw.短文 || '').toString().trim();

    // Check required field questionText
    if (!questionText || (raw.questionText === undefined && raw.question === undefined && raw.Question === undefined)) {
      errors.push({ row: rowNum, field: 'questionText', message: "缺少必需的题目内容参数 'questionText'" });
    } else if (questionText.length > 2000) {
      errors.push({ row: rowNum, field: 'questionText', message: '题目内容超出 2000 字符限制' });
    }

    // Check options content
    if (options && options.some((opt) => opt.trim().length === 0)) {
      errors.push({ row: rowNum, field: 'options', message: '题目 4 个选项 (A, B, C, D) 均不能为空' });
    } else if (options && options.some((opt) => opt.length > 500)) {
      errors.push({ row: rowNum, field: 'options', message: '选项内容超出 500 字符限制' });
    }

    // Check VR-3: Duplicate ID check
    if (seenIds.has(id)) {
      warnings.push(`第 ${rowNum} 行: 检测到重复题目 ID "${id}"，系统将自动分配唯一 ID。`);
    }
    const finalId = seenIds.has(id) ? `${id}_${Date.now()}_${idx}` : id;
    seenIds.add(finalId);

    // Process image attachment
    if (image) {
      if (imagesMap && imagesMap.has(image)) {
        image = imagesMap.get(image)!;
      } else if (imagesMap && imagesMap.has(`images/${image}`)) {
        image = imagesMap.get(`images/${image}`)!;
      } else if (!image.startsWith('data:') && !image.startsWith('http')) {
        warnings.push(`第 ${rowNum} 行: 未找到引用的图片文件 "${image}"。`);
        image = '';
      }
    }

    if (options && correctIndex >= 0 && questionText) {
      extractedQuestions.push({
        id: finalId,
        category,
        questionText,
        passage: passage || undefined,
        options,
        correctIndex,
        explanation,
        image: image || undefined,
        difficulty,
        knowledgeLevel,
        questionType,
        tags,
        statements,
        sourceReference,
      });
    }
  });

  const validRows = extractedQuestions.length;
  const invalidRows = rawQuestions.length - validRows;
  // Format is valid ONLY if there are valid questions AND zero errors
  const isValid = validRows > 0 && errors.length === 0;

  return {
    isValid,
    totalRows: rawQuestions.length,
    validRows,
    invalidRows,
    errors,
    warnings,
    extractedQuestions,
    collectionName: 'Imported Question Collection',
  };
}

/**
 * Parse JSON File content
 */
export async function parseJSONImport(fileText: string): Promise<ValidationReport> {
  let parsed: any;
  try {
    parsed = JSON.parse(fileText);
  } catch (e) {
    return {
      isValid: false,
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      errors: [{ row: 0, field: 'file', message: 'Invalid JSON file syntax' }],
      warnings: [],
      extractedQuestions: [],
      collectionName: '',
    };
  }

  const topLevelErrors: { row: number; field: string; message: string }[] = [];

  // Check top-level keys if parsed is an object
  if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
    const ALLOWED_TOP_LEVEL_KEYS = new Set([
      'collectionname', 'name', 'version', 'description', 'passage', 'passagetext', 'article', '文章', '短文', 'group', 'groupname', 'difficulty', 'tags', 'questions'
    ]);
    const unknownTopKeys = Object.keys(parsed).filter((k) => {
      const norm = k.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '').toLowerCase();
      return !ALLOWED_TOP_LEVEL_KEYS.has(norm);
    });

    if (unknownTopKeys.length > 0) {
      topLevelErrors.push({
        row: 0,
        field: 'top_level_parameter',
        message: `JSON 文件包含未定义的多余顶层参数: "${unknownTopKeys.join('", "')}"`
      });
    }
  }

  const collectionName = parsed.collectionName || parsed.name || 'Imported Collection';
  const collectionDescription = parsed.description || '';
  const collectionPassage = (parsed.passage || parsed.passageText || parsed.article || parsed.文章 || parsed.短文 || '').toString().trim();
  const collectionDifficulty = parsed.difficulty || 'Standard 1';
  const collectionGroup = parsed.group || parsed.groupName || 'General';
  const collectionVersion = typeof parsed.version === 'number' ? parsed.version : 1;
  const collectionTags = Array.isArray(parsed.tags) ? parsed.tags.map((t: any) => t.toString().trim()) : [];
  let rawQuestions: any[] = [];

  if (Array.isArray(parsed)) {
    rawQuestions = parsed;
  } else if (Array.isArray(parsed.questions)) {
    rawQuestions = parsed.questions;
  } else {
    return {
      isValid: false,
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      errors: [{ row: 0, field: 'questions', message: 'JSON file must contain an array of questions or a "questions" field' }],
      warnings: [],
      extractedQuestions: [],
      collectionName,
      collectionDescription,
      collectionPassage,
      collectionDifficulty,
      collectionGroup,
      collectionVersion,
      collectionTags,
    };
  }

  const report = validateAndFormatQuestions(rawQuestions);
  if (topLevelErrors.length > 0) {
    report.errors.unshift(...topLevelErrors);
    report.isValid = false;
  }
  report.collectionName = collectionName;
  report.collectionDescription = collectionDescription;
  report.collectionPassage = collectionPassage || report.extractedQuestions.find(q => q.passage)?.passage;
  report.collectionDifficulty = collectionDifficulty;
  report.collectionGroup = collectionGroup;
  report.collectionVersion = collectionVersion;
  report.collectionTags = collectionTags;
  return report;
}

/**
 * Parse ZIP package containing questions.json + images/
 */
export async function parseZIPImport(fileBuffer: ArrayBuffer): Promise<ValidationReport> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(fileBuffer);
  } catch (e) {
    return {
      isValid: false,
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      errors: [{ row: 0, field: 'zip', message: 'Corrupted or unreadable ZIP package' }],
      warnings: [],
      extractedQuestions: [],
      collectionName: '',
    };
  }

  // Prevent Zip-Slip security attacks
  for (const filename of Object.keys(zip.files)) {
    if (filename.includes('..') || filename.startsWith('/')) {
      return {
        isValid: false,
        totalRows: 0,
        validRows: 0,
        invalidRows: 0,
        errors: [{ row: 0, field: 'zip', message: 'ZIP package contains invalid file paths (zip-slip attempt)' }],
        warnings: [],
        extractedQuestions: [],
        collectionName: '',
      };
    }
  }

  // 1. Extract image files into Data URLs
  const imagesMap = new Map<string, string>();
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

  for (const [relativePath, zipEntry] of Object.entries(zip.files)) {
    if (zipEntry.dir) continue;
    const lowerPath = relativePath.toLowerCase();
    if (imageExtensions.some((ext) => lowerPath.endsWith(ext))) {
      const blob = await zipEntry.async('blob');
      const reader = new FileReader();
      const dataUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
      imagesMap.set(relativePath, dataUrl);
      imagesMap.set(relativePath.replace(/^images\//, ''), dataUrl);
    }
  }

  // 2. Search for questions.json or manifest.json
  let questionsFileEntry = zip.file('questions.json') || zip.file('manifest.json');

  if (!questionsFileEntry) {
    // Search any json file in root
    const jsonFiles = Object.keys(zip.files).filter((f) => f.endsWith('.json'));
    if (jsonFiles.length > 0) {
      questionsFileEntry = zip.file(jsonFiles[0]);
    }
  }

  if (!questionsFileEntry) {
    return {
      isValid: false,
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      errors: [{ row: 0, field: 'zip', message: 'ZIP package missing questions.json file' }],
      warnings: [],
      extractedQuestions: [],
      collectionName: '',
    };
  }

  const fileText = await questionsFileEntry.async('text');

  let parsed: any;
  try {
    parsed = JSON.parse(fileText);
  } catch (e) {
    return {
      isValid: false,
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      errors: [{ row: 0, field: 'questions.json', message: 'Invalid JSON syntax inside ZIP package' }],
      warnings: [],
      extractedQuestions: [],
      collectionName: '',
    };
  }

  const topLevelErrors: { row: number; field: string; message: string }[] = [];

  if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
    const ALLOWED_TOP_LEVEL_KEYS = new Set([
      'collectionname', 'name', 'version', 'description', 'passage', 'passagetext', 'article', '文章', '短文', 'group', 'groupname', 'difficulty', 'tags', 'questions'
    ]);
    const unknownTopKeys = Object.keys(parsed).filter((k) => {
      const norm = k.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '').toLowerCase();
      return !ALLOWED_TOP_LEVEL_KEYS.has(norm);
    });

    if (unknownTopKeys.length > 0) {
      topLevelErrors.push({
        row: 0,
        field: 'top_level_parameter',
        message: `ZIP 包内的 JSON 包含未定义的多余顶层参数: "${unknownTopKeys.join('", "')}"`
      });
    }
  }

  const collectionName = parsed.collectionName || parsed.name || 'ZIP Imported Collection';
  const collectionDescription = parsed.description || '';
  const collectionPassage = (parsed.passage || parsed.passageText || parsed.article || parsed.文章 || parsed.短文 || '').toString().trim();
  const collectionDifficulty = parsed.difficulty || 'Standard 1';
  const collectionGroup = parsed.group || parsed.groupName || 'General';
  const collectionVersion = typeof parsed.version === 'number' ? parsed.version : 1;
  const collectionTags = Array.isArray(parsed.tags) ? parsed.tags.map((t: any) => t.toString().trim()) : [];
  const rawQuestions = Array.isArray(parsed) ? parsed : parsed.questions || [];
  const report = validateAndFormatQuestions(rawQuestions, imagesMap);
  if (topLevelErrors.length > 0) {
    report.errors.unshift(...topLevelErrors);
    report.isValid = false;
  }
  report.collectionName = collectionName;
  report.collectionDescription = collectionDescription;
  report.collectionPassage = collectionPassage || report.extractedQuestions.find(q => q.passage)?.passage;
  report.collectionDifficulty = collectionDifficulty;
  report.collectionGroup = collectionGroup;
  report.collectionVersion = collectionVersion;
  report.collectionTags = collectionTags;
  return report;
}

/**
 * Parse CSV file containing questions row by row with strict parameter validation
 */
export async function parseCSVImport(fileText: string, filename: string): Promise<ValidationReport> {
  const lines = fileText.split(/\r?\n/);
  const metadata: Record<string, string> = {};
  const dataLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#')) {
      const content = trimmed.substring(1).trim();
      const colonIdx = content.indexOf(':');
      if (colonIdx !== -1) {
        const key = content.substring(0, colonIdx).trim().toLowerCase();
        let value = content.substring(colonIdx + 1).trim();
        // If it starts and ends with double quotes, unwrap them
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1).trim();
        }
        metadata[key] = value;
      }
    } else {
      dataLines.push(line);
    }
  }

  const cleanText = dataLines.join('\n');
  const rows = parseCSV(cleanText);

  if (rows.length < 2) {
    return {
      isValid: false,
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      errors: [{ row: 0, field: 'csv', message: 'CSV 文件为空或缺失数据行' }],
      warnings: [],
      extractedQuestions: [],
      collectionName: metadata.collectionname || filename.replace(/\.[^/.]+$/, ''),
    };
  }

  const csvErrors: { row: number; field: string; message: string }[] = [];
  const headerRow = rows[0];
  const ALLOWED_CSV_HEADER_KEYS = new Set([
    'id', 'category', 'passage', 'passagetext', 'passagecontent', 'article', '文章', '短文',
    'questiontext', 'question', 'statements',
    'optiona', 'optionb', 'optionc', 'optiond',
    'correctanswer', 'correct', 'correctindex',
    'explanation', 'difficulty', 'knowledgelevel', 'questiontype', 'tags',
    'sourcereference', 'source', 'imagefile', 'image'
  ]);

  // Check unknown headers
  const unknownHeaders: string[] = [];
  const normalizedHeaderKeys = headerRow.map((h) => {
    const norm = h.trim().replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '').toLowerCase();
    if (!ALLOWED_CSV_HEADER_KEYS.has(norm)) {
      unknownHeaders.push(h.trim());
    }
    return norm;
  });

  if (unknownHeaders.length > 0) {
    csvErrors.push({
      row: 1,
      field: 'csv_header',
      message: `CSV 标头包含未定义的参数列/多余参数: "${unknownHeaders.join('", "')}"`
    });
  }

  // Check required headers
  const hasQuestionText = normalizedHeaderKeys.some(k => k === 'questiontext' || k === 'question');
  const hasOptA = normalizedHeaderKeys.includes('optiona');
  const hasOptB = normalizedHeaderKeys.includes('optionb');
  const hasOptC = normalizedHeaderKeys.includes('optionc');
  const hasOptD = normalizedHeaderKeys.includes('optiond');
  const hasCorrect = normalizedHeaderKeys.some(k => k === 'correctanswer' || k === 'correct' || k === 'correctindex');

  const missingReq: string[] = [];
  if (!hasQuestionText) missingReq.push('Question Text');
  if (!hasOptA) missingReq.push('Option A');
  if (!hasOptB) missingReq.push('Option B');
  if (!hasOptC) missingReq.push('Option C');
  if (!hasOptD) missingReq.push('Option D');
  if (!hasCorrect) missingReq.push('Correct Answer');

  if (missingReq.length > 0) {
    csvErrors.push({
      row: 1,
      field: 'csv_header',
      message: `CSV 标头缺少必需的参数列: "${missingReq.join('", "')}"`
    });
  }

  const rawQuestions: any[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 1;

    // Parameter count check for row
    if (row.length !== headerRow.length) {
      csvErrors.push({
        row: rowNum,
        field: 'parameter_count',
        message: `第 ${rowNum} 行参数个数不一致: 标头有 ${headerRow.length} 列，而该行有 ${row.length} 列 (参数过多或缺少参数)`
      });
    }

    // Create an object using headers as keys
    const questionObj: any = {};
    headerRow.forEach((header, index) => {
      if (index < row.length) {
        questionObj[header.trim().toLowerCase()] = row[index];
      }
    });

    // Normalize keys to what validateAndFormatQuestions expects
    const normalizedObj: any = {};
    Object.entries(questionObj).forEach(([key, val]) => {
      const normalizedKey = key.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '').toLowerCase();
      if (normalizedKey === 'id') normalizedObj.id = val;
      else if (normalizedKey === 'category') normalizedObj.category = val;
      else if (normalizedKey === 'difficulty') normalizedObj.difficulty = val;
      else if (normalizedKey === 'knowledgelevel') normalizedObj.knowledgeLevel = val;
      else if (normalizedKey === 'questiontype') normalizedObj.questionType = val;
      else if (normalizedKey === 'tags') normalizedObj.tags = val;
      else if (normalizedKey === 'questiontext' || normalizedKey === 'question') normalizedObj.questionText = val;
      else if (normalizedKey === 'optiona') normalizedObj.optionA = val;
      else if (normalizedKey === 'optionb') normalizedObj.optionB = val;
      else if (normalizedKey === 'optionc') normalizedObj.optionC = val;
      else if (normalizedKey === 'optiond') normalizedObj.optionD = val;
      else if (normalizedKey === 'correctanswer' || normalizedKey === 'correct' || normalizedKey === 'correctindex') normalizedObj.correctAnswer = val;
      else if (normalizedKey === 'explanation') normalizedObj.explanation = val;
      else if (normalizedKey === 'sourcereference' || normalizedKey === 'source') normalizedObj.sourceReference = val;
      else if (normalizedKey === 'imagefile' || normalizedKey === 'image') normalizedObj.imageFile = val;
      else if (normalizedKey === 'statements') normalizedObj.statements = val;
      else if (normalizedKey === 'passage' || normalizedKey === 'passagetext' || normalizedKey === 'article' || normalizedKey === 'passagecontent') normalizedObj.passage = val;
      else {
        // preserve extra keys so validateAndFormatQuestions catches them
        normalizedObj[key] = val;
      }
    });

    rawQuestions.push(normalizedObj);
  }

  const collectionName = metadata.collectionname || filename.replace(/\.[^/.]+$/, '').trim();
  const report = validateAndFormatQuestions(rawQuestions);
  if (csvErrors.length > 0) {
    report.errors.unshift(...csvErrors);
    report.isValid = false;
  }

  report.collectionName = collectionName;
  report.collectionDescription = metadata.description || `Imported from CSV file: ${filename}`;
  report.collectionPassage = metadata.passage || report.extractedQuestions.find(q => q.passage)?.passage;
  report.collectionDifficulty = metadata.difficulty || 'Standard 1';
  report.collectionGroup = metadata.group || 'General';
  report.collectionVersion = metadata.version ? parseInt(metadata.version, 10) || 1 : 1;
  report.collectionTags = metadata.tags ? metadata.tags.split(/[,;\s]+/).map(t => t.trim()).filter(Boolean) : ['csv-import'];
  return report;
}
