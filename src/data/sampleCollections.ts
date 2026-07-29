// sampleCollections.ts - 理解题 (阅读理解短文 + 5个相关问题)
import { KnowledgeCollection } from '../types';

export const SAMPLE_COLLECTIONS: KnowledgeCollection[] = [
  // ============================================================
  // 书本 1: 华文 - 《清明节的传统与习俗》
  // ============================================================
  {
    id: 'col-chi-01',
    name: '清明节的传统与习俗',
    description: '阅读关于清明节由来、扫墓祭祖与吃青团等传统习俗的短文，回答5个相关理解题。',
    passage: '清明节是中华民族的传统节日，通常在每年公历的四月四日或五日。清明节既是扫墓祭祖的肃穆节日，也是人们亲近自然、踏青游玩、享受春光之乐的节日。在这一天，人们会扶老携幼来到祖先的墓前，铲除杂草，献上鲜花与供品，表达对先人的怀念与敬意。除了扫墓，清明节还有吃青团、放风筝、插柳等丰富多彩的传统习俗。青团是用艾草汁拌入糯米粉制成的，吃起来香甜可口，带有淡淡的草木清香。',
    group: '华文',
    difficulty: 'Standard 4',
    tags: ['华文', '阅读理解', '传统节日', '清明节'],
    version: 1,
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-29T00:00:00.000Z',
    questionCount: 5,
    categories: ['阅读理解'],
    questions: [
      {
        id: 'qm-q1',
        category: '阅读理解',
        questionText: '1. 根据短文，清明节通常在公历的什么时候？',
        passage: '清明节是中华民族的传统节日，通常在每年公历的四月四日或五日。清明节既是扫墓祭祖的肃穆节日，也是人们亲近自然、踏青游玩、享受春光之乐的节日。在这一天，人们会扶老携幼来到祖先的墓前，铲除杂草，献上鲜花与供品，表达对先人的怀念与敬意。除了扫墓，清明节还有吃青团、放风筝、插柳等丰富多彩的传统习俗。青团是用艾草汁拌入糯米粉制成的，吃起来香甜可口，带有淡淡的草木清香。',
        options: ['三月三日或四日', '四月四日或五日', '五月五日或六日', '八月十五日'],
        correctIndex: 1,
        explanation: '短文中明确提到：“清明节通常在每年公历的四月四日或五日”。',
        sourceReference: '华文阅读理解 第1课'
      },
      {
        id: 'qm-q2',
        category: '阅读理解',
        questionText: '2. 人们在清明节来到祖先墓前扫墓，主要是为了表达什么？',
        passage: '清明节是中华民族的传统节日，通常在每年公历的四月四日或五日。清明节既是扫墓祭祖的肃穆节日，也是人们亲近自然、踏青游玩、享受春光之乐的节日。在这一天，人们会扶老携幼来到祖先的墓前，铲除杂草，献上鲜花与供品，表达对先人的怀念与敬意。除了扫墓，清明节还有吃青团、放风筝、插柳等丰富多彩的传统习俗。青团是用艾草汁拌入糯米粉制成的，吃起来香甜可口，带有淡淡的草木清香。',
        options: ['表达对新年的庆祝', '表达对先人的怀念与敬意', '为了向神明求雨', '为了锻炼身体'],
        correctIndex: 1,
        explanation: '短文中提到人们铲除杂草、献上鲜花供品，“表达对先人的怀念与敬意”。',
        sourceReference: '华文阅读理解 第1课'
      },
      {
        id: 'qm-q3',
        category: '阅读理解',
        questionText: '3. 短文中提到的清明节传统美食叫什么？',
        passage: '清明节是中华民族的传统节日，通常在每年公历的四月四日或五日。清明节既是扫墓祭祖的肃穆节日，也是人们亲近自然、踏青游玩、享受春光之乐的节日。在这一天，人们会扶老携幼来到祖先的墓前，铲除杂草，献上鲜花与供品，表达对先人的怀念与敬意。除了扫墓，清明节还有吃青团、放风筝、插柳等丰富多彩的传统习俗。青团是用艾草汁拌入糯米粉制成的，吃起来香甜可口，带有淡淡的草木清香。',
        options: ['粽子', '月饼', '青团', '汤圆'],
        correctIndex: 2,
        explanation: '短文中提到了清明节有“吃青团”的传统习俗。',
        sourceReference: '华文阅读理解 第1课'
      },
      {
        id: 'qm-q4',
        category: '阅读理解',
        questionText: '4. 根据短文，青团是用什么成分拌入糯米粉制成的？',
        passage: '清明节是中华民族的传统节日，通常在每年公历的四月四日或五日。清明节既是扫墓祭祖的肃穆节日，也是人们亲近自然、踏青游玩、享受春光之乐的节日。在这一天，人们会扶老携幼来到祖先的墓前，铲除杂草，献上鲜花与供品，表达对先人的怀念与敬意。除了扫墓，清明节还有吃青团、放风筝、插柳等丰富多彩的传统习俗。青团是用艾草汁拌入糯米粉制成的，吃起来香甜可口，带有淡淡的草木清香。',
        options: ['艾草汁', '抹茶粉', '红豆沙', '菠菜汁'],
        correctIndex: 0,
        explanation: '短文最后一句说明：“青团是用艾草汁拌入糯米粉制成的”。',
        sourceReference: '华文阅读理解 第1课'
      },
      {
        id: 'qm-q5',
        category: '阅读理解',
        questionText: '5. 根据短文，除了扫墓和吃青团，清明节还有哪些传统活动？',
        passage: '清明节是中华民族的传统节日，通常在每年公历的四月四日或五日。清明节既是扫墓祭祖的肃穆节日，也是人们亲近自然、踏青游玩、享受春光之乐的节日。在这一天，人们会扶老携幼来到祖先的墓前，铲除杂草，献上鲜花与供品，表达对先人的怀念与敬意。除了扫墓，清明节还有吃青团、放风筝、插柳等丰富多彩的传统习俗。青团是用艾草汁拌入糯米粉制成的，吃起来香甜可口，带有淡淡的草木清香。',
        options: ['赛龙舟、赏月', '踏青、放风筝、插柳', '贴春联、吃年夜饭', '猜灯谜、踩高峤'],
        correctIndex: 1,
        explanation: '短文中写道：“除了扫墓，清明节还有吃青团、放风筝、插柳等丰富多彩的传统习俗”，文中也提及“踏青游玩”。',
        sourceReference: '华文阅读理解 第1课'
      }
    ]
  },

  // ============================================================
  // 书本 2: 华文 - 《小蜜蜂采蜜记》
  // ============================================================
  {
    id: 'col-chi-02',
    name: '小蜜蜂采蜜记',
    description: '阅读关于勤劳的小蜜蜂在花园里采集花蜜的童话故事短文，回答5个相关理解题。',
    passage: '清晨，太阳从东方升起，小蜜蜂“花花”从蜂巢里飞了出来。花园里的花朵盛开了，有红色的玫瑰、黄色的向日葵和紫色的薰衣草，散发出阵阵清香。花花在花丛中飞来飞去，用细长的吸管吸取甜甜的花蜜，并把花粉收集在后腿的花粉篮里。小蜜蜂勤劳地工作了一整天，飞过了成百上千朵花。虽然很辛苦，但想到能为蜂群带回丰盛的食物，花花心里感到无比满足与快乐。',
    group: '华文',
    difficulty: 'Standard 2',
    tags: ['华文', '阅读理解', '童话故事', '勤劳'],
    version: 1,
    createdAt: '2026-07-02T00:00:00.000Z',
    updatedAt: '2026-07-29T00:00:00.000Z',
    questionCount: 5,
    categories: ['阅读理解'],
    questions: [
      {
        id: 'mb-q1',
        category: '阅读理解',
        questionText: '1. 小蜜蜂“花花”是在什么时候从蜂巢飞出来的？',
        passage: '清晨，太阳从东方升起，小蜜蜂“花花”从蜂巢里飞了出来。花园里的花朵盛开了，有红色的玫瑰、黄色的向日葵和紫色的薰衣草，散发出阵阵清香。花花在花丛中飞来飞去，用细长的吸管吸取甜甜的花蜜，并把花粉收集在后腿的花粉篮里。小蜜蜂勤劳地工作了一整天，飞过了成百上千朵花。虽然很辛苦，但想到能为蜂群带回丰盛的食物，花花心里感到无比满足与快乐。',
        options: ['傍晚', '中午', '清晨', '深夜'],
        correctIndex: 2,
        explanation: '短文开头写道：“清晨，太阳从东方升起，小蜜蜂‘花花’从蜂巢里飞了出来”。',
        sourceReference: '童话阅读理解 第2课'
      },
      {
        id: 'mb-q2',
        category: '阅读理解',
        questionText: '2. 花花是用什么器官来吸取甜甜的花蜜的？',
        passage: '清晨，太阳从东方升起，小蜜蜂“花花”从蜂巢里飞了出来。花园里的花朵盛开了，有红色的玫瑰、黄色的向日葵和紫色的薰衣草，散发出阵阵清香。花花在花丛中飞来飞去，用细长的吸管吸取甜甜的花蜜，并把花粉收集在后腿的花粉篮里。小蜜蜂勤劳地工作了一整天，飞过了成百上千朵花。虽然很辛苦，但想到能为蜂群带回丰盛的食物，花花心里感到无比满足与快乐。',
        options: ['前脚', '细长的吸管', '翅膀', '尾巴'],
        correctIndex: 1,
        explanation: '文中说明花花“用细长的吸管吸取甜甜的花蜜”。',
        sourceReference: '童话阅读理解 第2课'
      },
      {
        id: 'mb-q3',
        category: '阅读理解',
        questionText: '3. 小蜜蜂把收集到的花粉放在哪里？',
        passage: '清晨，太阳从东方升起，小蜜蜂“花花”从蜂巢里飞了出来。花园里的花朵盛开了，有红色的玫瑰、黄色的向日葵和紫色的薰衣草，散发出阵阵清香。花花在花丛中飞来飞去，用细长的吸管吸取甜甜的花蜜，并把花粉收集在后腿的花粉篮里。小蜜蜂勤劳地工作了一整天，飞过了成百上千朵花。虽然很辛苦，但想到能为蜂群带回丰盛的食物，花花心里感到无比满足与快乐。',
        options: ['后腿的花粉篮里', '翅膀下面', '头上', '蜂巢门口'],
        correctIndex: 0,
        explanation: '文中写道：“并把花粉收集在后腿的花粉篮里”。',
        sourceReference: '童话阅读理解 第2课'
      },
      {
        id: 'mb-q4',
        category: '阅读理解',
        questionText: '4. 根据短文，花花在花园里遇到了哪些颜色的花朵？',
        passage: '清晨，太阳从东方升起，小蜜蜂“花花”从蜂巢里飞了出来。花园里的花朵盛开了，有红色的玫瑰、黄色的向日葵和紫色的薰衣草，散发出阵阵清香。花花在花丛中飞来飞去，用细长的吸管吸取甜甜的花蜜，并把花粉收集在后腿的花粉篮里。小蜜蜂勤劳地工作了一整天，飞过了成百上千朵花。虽然很辛苦，但想到能为蜂群带回丰盛的食物，花花心里感到无比满足与快乐。',
        options: ['只有红色的花', '红色、黄色和紫色', '蓝色和白色', '黑色和绿色'],
        correctIndex: 1,
        explanation: '文中提到了“红色的玫瑰、黄色的向日葵和紫色的薰衣草”。',
        sourceReference: '童话阅读理解 第2课'
      },
      {
        id: 'mb-q5',
        category: '阅读理解',
        questionText: '5. 这个故事主要体现了小蜜蜂怎样的品质？',
        passage: '清晨，太阳从东方升起，小蜜蜂“花花”从蜂巢里飞了出来。花园里的花朵盛开了，有红色的玫瑰、黄色的向日葵和紫色的薰衣草，散发出阵阵清香。花花在花丛中飞来飞去，用细长的吸管吸取甜甜的花蜜，并把花粉收集在后腿的花粉篮里。小蜜蜂勤劳地工作了一整天，飞过了成百上千朵花。虽然很辛苦，但想到能为蜂群带回丰盛的食物，花花心里感到无比满足与快乐。',
        options: ['骄傲自满', '勤劳无私', '贪婪懒惰', '胆小怯懦'],
        correctIndex: 1,
        explanation: '花花工作了一整天，为蜂群采蜜带回食物，展现了“勤劳无私”的美德。',
        sourceReference: '童话阅读理解 第2课'
      }
    ]
  },

  // ============================================================
  // 书本 3: 科学 - 《奇妙的海洋世界》
  // ============================================================
  {
    id: 'col-sci-01',
    name: '奇妙的海洋世界',
    description: '阅读关于海洋覆盖面积、蓝鲸与珊瑚礁生态环境的科学科普短文，回答5个相关问题。',
    passage: '海洋占据了地球表面约百分之七十的面积，是地球上最大的生态系统。在辽阔而深邃的海洋里，栖息着无数神奇的生物。体型庞大的蓝鲸是地球上已知最大的动物，一头成年蓝鲸的体重可达一百五十吨以上。而在温暖的浅海区，五彩斑斓的珊瑚礁被称为“海洋中的热带雨林”，为成千上万种鱼类和小海鲜提供了避风港。然而，海洋塑料污染正严重威胁着海洋生物的生存，保护海洋环境已成为全人类的共同责任。',
    group: '科学',
    difficulty: 'Standard 3',
    tags: ['科学', '阅读理解', '海洋生态', '环境保护'],
    version: 1,
    createdAt: '2026-07-03T00:00:00.000Z',
    updatedAt: '2026-07-29T00:00:00.000Z',
    questionCount: 5,
    categories: ['阅读理解'],
    questions: [
      {
        id: 'ocean-q1',
        category: '阅读理解',
        questionText: '1. 海洋大约占据了地球表面的多少面积？',
        passage: '海洋占据了地球表面约百分之七十的面积，是地球上最大的生态系统。在辽阔而深邃的海洋里，栖息着无数神奇的生物。体型庞大的蓝鲸是地球上已知最大的动物，一头成年蓝鲸的体重可达一百五十吨以上。而在温暖的浅海区，五彩斑斓的珊瑚礁被称为“海洋中的热带雨林”，为成千上万种鱼类和小海鲜提供了避风港。然而，海洋塑料污染正严重威胁着海洋生物的生存，保护海洋环境已成为全人类的共同责任。',
        options: ['百分之五十', '百分之六十', '百分之七十', '百分之九十'],
        correctIndex: 2,
        explanation: '文章第一句指出：“海洋占据了地球表面约百分之七十的面积”。',
        sourceReference: '科学阅读理解 第3课'
      },
      {
        id: 'ocean-q2',
        category: '阅读理解',
        questionText: '2. 根据短文，地球上已知体型最大的动物是什么？',
        passage: '海洋占据了地球表面约百分之七十的面积，是地球上最大的生态系统。在辽阔而深邃的海洋里，栖息着无数神奇的生物。体型庞大的蓝鲸是地球上已知最大的动物，一头成年蓝鲸的体重可达一百五十吨以上。而在温暖的浅海区，五彩斑斓的珊瑚礁被称为“海洋中的热带雨林”，为成千上万种鱼类和小海鲜提供了避风港。然而，海洋塑料污染正严重威胁着海洋生物的生存，保护海洋环境已成为全人类的共同责任。',
        options: ['大象', '蓝鲸', '鲨鱼', '恐龙'],
        correctIndex: 1,
        explanation: '文中明确指出：“体型庞大的蓝鲸是地球上已知最大的动物”。',
        sourceReference: '科学阅读理解 第3课'
      },
      {
        id: 'ocean-q3',
        category: '阅读理解',
        questionText: '3. 为什么珊瑚礁被称为“海洋中的热带雨林”？',
        passage: '海洋占据了地球表面约百分之七十的面积，是地球上最大的生态系统。在辽阔而深邃的海洋里，栖息着无数神奇的生物。体型庞大的蓝鲸是地球上已知最大的动物，一头成年蓝鲸的体重可达一百五十吨以上。而在温暖的浅海区，五彩斑斓的珊瑚礁被称为“海洋中的热带雨林”，为成千上万种鱼类和小海鲜提供了避风港。然而，海洋塑料污染正严重威胁着海洋生物的生存，保护海洋环境已成为全人类的共同责任。',
        options: ['因为珊瑚礁长在陆地上', '因为珊瑚礁树木繁茂', '因为它为成千上万种海洋生物提供了避风港与家园', '因为珊瑚礁会下雨'],
        correctIndex: 2,
        explanation: '文中提到珊瑚礁“为成千上万种鱼类和小海鲜提供了避风港”。',
        sourceReference: '科学阅读理解 第3课'
      },
      {
        id: 'ocean-q4',
        category: '阅读理解',
        questionText: '4. 文中指出目前严重威胁海洋生物生存的问题是什么？',
        passage: '海洋占据了地球表面约百分之七十的面积，是地球上最大的生态系统。在辽阔而深邃的海洋里，栖息着无数神奇的生物。体型庞大的蓝鲸是地球上已知最大的动物，一头成年蓝鲸的体重可达一百五十吨以上。而在温暖的浅海区，五彩斑斓的珊瑚礁被称为“海洋中的热带雨林”，为成千上万种鱼类和小海鲜提供了避风港。然而，海洋塑料污染正严重威胁着海洋生物的生存，保护海洋环境已成为全人类的共同责任。',
        options: ['海水太咸', '海洋塑料污染', '阳光照不到海底', '鱼类繁殖太多'],
        correctIndex: 1,
        explanation: '文章提到：“然而，海洋塑料污染正严重威胁着海洋生物的生存”。',
        sourceReference: '科学阅读理解 第3课'
      },
      {
        id: 'ocean-q5',
        category: '阅读理解',
        questionText: '5. 根据短文，我们应该采取怎样的态度对待海洋？',
        passage: '海洋占据了地球表面约百分之七十的面积，是地球上最大的生态系统。在辽阔而深邃的海洋里，栖息着无数神奇的生物。体型庞大的蓝鲸是地球上已知最大的动物，一头成年蓝鲸的体重可达一百五十吨以上。而在温暖的浅海区，五彩斑斓的珊瑚礁被称为“海洋中的热带雨林”，为成千上万种鱼类和小海鲜提供了避风港。然而，海洋塑料污染正严重威胁着海洋生物的生存，保护海洋环境已成为全人类的共同责任。',
        options: ['随手丢弃垃圾', '积极保护海洋环境', '捕杀所有鱼类', '完全不关心'],
        correctIndex: 1,
        explanation: '短文结尾呼吁：“保护海洋环境已成为全人类的共同责任”。',
        sourceReference: '科学阅读理解 第3课'
      }
    ]
  },

  // ============================================================
  // 书本 4: 道德/故事 - 《守时的小猴皮皮》
  // ============================================================
  {
    id: 'col-moral-01',
    name: '守时的小猴皮皮',
    description: '阅读关于小猴子遵守时间、勤奋准备并在比赛中取得优异成绩的寓言短文，回答5个理解题。',
    passage: '小猴子皮皮是森林学校里公认最守时的学生。无论是上学还是和小伙伴约好玩耍，皮皮总是会提前五分钟到达集合地点。皮皮常说：“守时是对别人的尊重，也是对自己的负责。”有一天，森林里举行一年一度的长跑比赛，赛程非常艰苦。早上六点闹钟一响，皮皮立刻起床热身，准时来到了起起跑线。最终，凭着充沛的准备和坚持不懈的努力，皮皮夺得了冠军。大家不仅佩服它的速度，更敬佩它守信守时的好品质。',
    group: '道德',
    difficulty: 'Standard 2',
    tags: ['道德教育', '阅读理解', '守时守信', '品质'],
    version: 1,
    createdAt: '2026-07-04T00:00:00.000Z',
    updatedAt: '2026-07-29T00:00:00.000Z',
    questionCount: 5,
    categories: ['阅读理解'],
    questions: [
      {
        id: 'pipi-q1',
        category: '阅读理解',
        questionText: '1. 小猴子皮皮在森林学校里以什么品质闻名？',
        passage: '小猴子皮皮是森林学校里公认最守时的学生。无论是上学还是和小伙伴约好玩耍，皮皮总是会提前五分钟到达集合地点。皮皮常说：“守时是对别人的尊重，也是对自己的负责。”有一天，森林里举行一年一度的长跑比赛，赛程非常艰苦。早上六点闹钟一响，皮皮立刻起床热身，准时来到了起跑线。最终，凭着充沛的准备和坚持不懈的努力，皮皮夺得了冠军。大家不仅佩服它的速度，更敬佩它守信守时的好品质。',
        options: ['调皮捣蛋', '最守时', '爱吃香蕉', '喜欢睡觉'],
        correctIndex: 1,
        explanation: '短文开头写道：“小猴子皮皮是森林学校里公认最守时的学生”。',
        sourceReference: '道德品格阅读 第4课'
      },
      {
        id: 'pipi-q2',
        category: '阅读理解',
        questionText: '2. 与小伙伴约定集合时，皮皮通常会怎么做？',
        passage: '小猴子皮皮是森林学校里公认最守时的学生。无论是上学还是和小伙伴约好玩耍，皮皮总是会提前五分钟到达集合地点。皮皮常说：“守时是对别人的尊重，也是对自己的负责。”有一天，森林里举行一年一度的长跑比赛，赛程非常艰苦。早上六点闹钟一响，皮皮立刻起床热身，准时来到了起跑线。最终，凭着充沛的准备和坚持不懈的努力，皮皮夺得了冠军。大家不仅佩服它的速度，更敬佩它守信守时的好品质。',
        options: ['迟到半小时', '提前五分钟到达集合地点', '总是忘记时间', '要别人去催它'],
        correctIndex: 1,
        explanation: '文中说到皮皮“总是会提前五分钟到达集合地点”。',
        sourceReference: '道德品格阅读 第4课'
      },
      {
        id: 'pipi-q3',
        category: '阅读理解',
        questionText: '3. 皮皮对于“守时”有着怎样的看法的？',
        passage: '小猴子皮皮是森林学校里公认最守时的学生。无论是上学还是和小伙伴约好玩耍，皮皮总是会提前五分钟到达集合地点。皮皮常说：“守时是对别人的尊重，也是对自己的负责。”有一天，森林里举行一年一度的长跑比赛，赛程非常艰苦。早上六点闹钟一响，皮皮立刻起床热身，准时来到了起跑线。最终，凭着充沛的准备和坚持不懈的努力，皮皮夺得了冠军。大家不仅佩服它的速度，更敬佩它守信守时的好品质。',
        options: ['守时是很麻烦的事情', '守时是对别人的尊重，也是对自己的负责', '只有大人需要守时', '守时没有任何好处'],
        correctIndex: 1,
        explanation: '皮皮常说：“守时是对别人的尊重，也是对自己的负责”。',
        sourceReference: '道德品格阅读 第4课'
      },
      {
        id: 'pipi-q4',
        category: '阅读理解',
        questionText: '4. 长跑比赛那天，皮皮是怎么准备比赛的？',
        passage: '小猴子皮皮是森林学校里公认最守时的学生。无论是上学还是和小伙伴约好玩耍，皮皮总是会提前五分钟到达集合地点。皮皮常说：“守时是对别人的尊重，也是对自己的负责。”有一天，森林里举行一年一度的长跑比赛，赛程非常艰苦。早上六点闹钟一响，皮皮立刻起床热身，准时来到了起跑线。最终，凭着充沛的准备和坚持不懈的努力，皮皮夺得了冠军。大家不仅佩服它的速度，更敬佩它守信守时的好品质。',
        options: ['闹钟响后继续睡觉', '早上六点闹钟一响就起床热身并准时到场', '比赛结束了才赶到', '直接放弃比赛'],
        correctIndex: 1,
        explanation: '文章描述皮皮“早上六点闹钟一响，皮皮立刻起床热身，准时来到了起跑线”。',
        sourceReference: '道德品格阅读 第4课'
      },
      {
        id: 'pipi-q5',
        category: '阅读理解',
        questionText: '5. 这个故事主要想告诉我们什么道理？',
        passage: '小猴子皮皮是森林学校里公认最守时的学生。无论是上学还是和小伙伴约好玩耍，皮皮总是会提前五分钟到达集合地点。皮皮常说：“守时是对别人的尊重，也是对自己的负责。”有一天，森林里举行一年一度的长跑比赛，赛程非常艰苦。早上六点闹钟一响，皮皮立刻起床热身，准时来到了起跑线。最终，凭着充沛的准备和坚持不懈的努力，皮皮夺得了冠军。大家不仅佩服它的速度，更敬佩它守信守时的好品质。',
        options: ['应该养成守时守信的好习惯', '跑步快最重要', '不用准备就能成功', '迟到是没有关系的'],
        correctIndex: 0,
        explanation: '故事告诉我们要像皮皮一样，养成守时守信、认真准备的好品质。',
        sourceReference: '道德品格阅读 第4课'
      }
    ]
  },

  // ============================================================
  // 书本 5: 英文 - 《The Little Seed's Journey》
  // ============================================================
  {
    id: 'col-eng-01',
    name: 'The Little Seed\'s Journey',
    description: 'Read the short story about a seed growing into a sunflower, and answer 5 comprehension questions.',
    passage: 'Once upon a time, a little seed slept comfortably under the dark, soft soil. When springtime arrived, gentle rain fell and the warm sun shone brightly upon the earth. The little seed felt the warmth and decided to stretch its little green arms upward. Slowly, it pushed through the dark soil and burst into the fresh air. Day by day, with water and sunlight, the seed grew into a beautiful, strong sunflower with bright yellow petals that always turned toward the sun.',
    group: '英文',
    difficulty: 'Standard 3',
    tags: ['English', 'Reading Comprehension', 'Story', 'Plants'],
    version: 1,
    createdAt: '2026-07-05T00:00:00.000Z',
    updatedAt: '2026-07-29T00:00:00.000Z',
    questionCount: 5,
    categories: ['Reading Comprehension'],
    questions: [
      {
        id: 'eng-seed-q1',
        category: 'Reading Comprehension',
        questionText: '1. Where did the little seed sleep at the beginning of the story?',
        passage: 'Once upon a time, a little seed slept comfortably under the dark, soft soil. When springtime arrived, gentle rain fell and the warm sun shone brightly upon the earth. The little seed felt the warmth and decided to stretch its little green arms upward. Slowly, it pushed through the dark soil and burst into the fresh air. Day by day, with water and sunlight, the seed grew into a beautiful, strong sunflower with bright yellow petals that always turned toward the sun.',
        options: ['On a tree branch', 'Under the dark, soft soil', 'In a bird nest', 'Inside a river'],
        correctIndex: 1,
        explanation: 'The passage states: "a little seed slept comfortably under the dark, soft soil."',
        sourceReference: 'English Reading Lesson 5'
      },
      {
        id: 'eng-seed-q2',
        category: 'Reading Comprehension',
        questionText: '2. Which season brought gentle rain and warm sunlight to awaken the seed?',
        passage: 'Once upon a time, a little seed slept comfortably under the dark, soft soil. When springtime arrived, gentle rain fell and the warm sun shone brightly upon the earth. The little seed felt the warmth and decided to stretch its little green arms upward. Slowly, it pushed through the dark soil and burst into the fresh air. Day by day, with water and sunlight, the seed grew into a beautiful, strong sunflower with bright yellow petals that always turned toward the sun.',
        options: ['Winter', 'Autumn', 'Springtime', 'Summer'],
        correctIndex: 2,
        explanation: 'The text mentions: "When springtime arrived, gentle rain fell and the warm sun shone brightly..."',
        sourceReference: 'English Reading Lesson 5'
      },
      {
        id: 'eng-seed-q3',
        category: 'Reading Comprehension',
        questionText: '3. What plant did the little seed eventually grow into?',
        passage: 'Once upon a time, a little seed slept comfortably under the dark, soft soil. When springtime arrived, gentle rain fell and the warm sun shone brightly upon the earth. The little seed felt the warmth and decided to stretch its little green arms upward. Slowly, it pushed through the dark soil and burst into the fresh air. Day by day, with water and sunlight, the seed grew into a beautiful, strong sunflower with bright yellow petals that always turned toward the sun.',
        options: ['A red rose', 'A tall pine tree', 'A beautiful, strong sunflower', 'A green grass field'],
        correctIndex: 2,
        explanation: 'The story ends with: "the seed grew into a beautiful, strong sunflower..."',
        sourceReference: 'English Reading Lesson 5'
      },
      {
        id: 'eng-seed-q4',
        category: 'Reading Comprehension',
        questionText: '4. What special characteristic do the sunflower\'s bright yellow petals have?',
        passage: 'Once upon a time, a little seed slept comfortably under the dark, soft soil. When springtime arrived, gentle rain fell and the warm sun shone brightly upon the earth. The little seed felt the warmth and decided to stretch its little green arms upward. Slowly, it pushed through the dark soil and burst into the fresh air. Day by day, with water and sunlight, the seed grew into a beautiful, strong sunflower with bright yellow petals that always turned toward the sun.',
        options: ['They always turned toward the sun', 'They glow in the dark', 'They fall off immediately', 'They change colors every hour'],
        correctIndex: 0,
        explanation: 'The text notes the petals "always turned toward the sun."',
        sourceReference: 'English Reading Lesson 5'
      },
      {
        id: 'eng-seed-q5',
        category: 'Reading Comprehension',
        questionText: '5. What two main elements helped the seed grow big and strong day by day?',
        passage: 'Once upon a time, a little seed slept comfortably under the dark, soft soil. When springtime arrived, gentle rain fell and the warm sun shone brightly upon the earth. The little seed felt the warmth and decided to stretch its little green arms upward. Slowly, it pushed through the dark soil and burst into the fresh air. Day by day, with water and sunlight, the seed grew into a beautiful, strong sunflower with bright yellow petals that always turned toward the sun.',
        options: ['Wind and snow', 'Water and sunlight', 'Rocks and sand', 'Ice and shade'],
        correctIndex: 1,
        explanation: 'The text says: "Day by day, with water and sunlight, the seed grew..."',
        sourceReference: 'English Reading Lesson 5'
      }
    ]
  }
];
