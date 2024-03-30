import {nanoid} from "nanoid";

// 随机生成 1 到 n 之间的数字
function generateRandomNumber(n: number) {
    return Math.floor(Math.random() * n) + 1;
}

export function generateRandomTextWithCallback(
    onTextGenerated: (text: { id: string; content: string }) => void
) {
    // const count = generateRandomNumber(10);
    const count = 20;
    const id = nanoid();
    let index = 0;

    const t = setInterval(() => {
        if (index < count) {
            const content = generateRandomSentence();
            onTextGenerated({content, id});
            index++;
        } else {
            clearInterval(t);
        }
    }, 30);

    return t;
}

export function generateRandomSentence(wordsLength = 5) {
    const words = [
        "天气晴朗",
        "春风拂面",
        "万物复苏",
        "生机盎然",
        "鸟语花香",
        "四季轮回",
        "岁月静好",
        "山高水长",
        "风景如画",
        "岁月静好",
        "欢声笑语",
        "琴瑟和鸣",
    ];

    // 随机生成句子长度
    const sentenceLength = generateRandomNumber(wordsLength);

    return Array.from({length: sentenceLength}, () => {
        const randomIndex = generateRandomNumber(words.length - 1);
        return words[randomIndex];
    }).join(", ")
}
