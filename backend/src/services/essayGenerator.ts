import { nanoid } from "nanoid";

interface EssayInput {
  gradeLevel: string;
  essayType: string;
  requirements: string;
  prompt: string;
}

interface RevisionInput extends EssayInput {
  previousEssay: string;
  instructions: string;
  iteration: number;
}

const SAMPLE_ERRORS = [
  "我覺得這次活動真的很好玩我也學到了很多東西",
  "因為老師說要幫助別人所以我就決定參加了這個活動可是過程中我有點害怕",
  "我們小組一開始沒有溝通好結果做得一團亂最後才慢慢變好",
  "我學到最大的道理就是只要努力就會有好結果但是有時候也會失敗讓我很沮喪",
  "如果時間可以倒流我會先把功課寫完然後再去玩不然就會被媽媽罵",
];

const COMMON_STRUCTURE_ISSUES = [
  "開頭沒有點題，直接描述細節，讓讀者難以理解文章主旨。",
  "中段缺少過渡句，情節跳躍。",
  "結尾僅用一句話收尾，沒有總結學到的事情。",
];

const IMPROVEMENT_PHRASES = [
  "我再次想了很久，發現要把事情做好需要先規劃。",
  "後來我和同學溝通，我們分工合作讓事情變得清楚。",
  "經過這次的經驗，我懂得要尊重別人的意見。",
  "最後我希望自己可以把這個好習慣持續下去。",
];

const randomPick = <T,>(list: T[]): T => {
  return list[Math.floor(Math.random() * list.length)];
};

export const generateDraftEssay = (input: EssayInput): string => {
  const intro = `我是${input.gradeLevel}年級的學生，最近老師要我們寫一篇關於「${input.prompt}」的${input.essayType}。其實我一開始不知道要怎麼寫所以就直接把想到的事情全部寫下來。`;
  const bodySentences = Array.from({ length: 3 }, () => randomPick(SAMPLE_ERRORS));
  const closing = `總的來說這次的事情讓我感覺很複雜我知道老師希望我們${input.requirements}但我還沒真的做到。`;

  return `${intro}\n\n${bodySentences.join("\n")}\n\n${closing}`;
};

export const reviseEssayDraft = (input: RevisionInput): string => {
  const improvements = IMPROVEMENT_PHRASES.slice(0, 1 + Math.min(3, input.iteration));
  const commentary = `根據老師的新指示：「${input.instructions}」，我重新整理了文章。`;

  const cleaned = input.previousEssay
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => {
      if (index === 0) {
        return paragraph.replace("不知道要怎麼寫所以就直接把想到的事情全部寫下來", "先列出重點再慢慢描述每一段的內容");
      }
      return paragraph;
    })
    .join("\n\n");

  const improvementParagraph = `我特別記錄了這些重點：${improvements.join("，")}
。`;

  return `${commentary}\n\n${cleaned}\n\n${improvementParagraph}`;
};

export const generateAiFeedback = (essay: string) => {
  const scoreBase = Math.min(95, Math.max(55, 60 + essay.length / 30));
  const score = Math.round(scoreBase + Math.random() * 10 - 5);

  const issues = COMMON_STRUCTURE_ISSUES.slice(0, 2)
    .map((issue, index) => `${index + 1}. ${issue}`)
    .join("\n");

  const strengths = `優點：用詞真誠，情感表達自然。`;
  const summary = `總評：文章有明顯進步，但仍需加強段落間的過渡與結尾的反思。`;

  return {
    score,
    commentary: `${strengths}\n${issues}\n${summary}`,
    referenceId: nanoid(8),
  };
};
