import {HLArrayType} from "@/pages/MarkdownPanel/types.ts";

export const regex = /[\[\]\\()\n*#|｜\-+\s`]/g;

export const splitter = /\n+/g

export const getIntersection = (array1: [number, number], array2: [number, number]) => {
    // 获取每个数组的最小值和最大值
    const min1 = Math.min(...array1);
    const max1 = Math.max(...array1);
    const min2 = Math.min(...array2);
    const max2 = Math.max(...array2);

    // 计算交集范围
    const minIntersection = Math.max(min1, min2);
    const maxIntersection = Math.min(max1, max2);

    // 检查是否存在交集范围
    if (minIntersection <= maxIntersection) {
        return [minIntersection, maxIntersection]
    } else {
        return [-1, -1]
    }
}


export const convertToArray = (str: string) => {
    return str.split('').map((str, index) => {
        return {
            index,
            str
        }
    })
}

export const highlightV1 = async (rawArr: HLArrayType[], searchArr: HLArrayType[]) => {
    // console.log("🚀  ", {rawArr, searchArr})
    return new Promise<[number, number]>((resolve) => {
        const searchText = searchArr.map(item => item.str).join('');
        let accText = "";
        // left => right
        for (let i = 0; i < rawArr.length; i++) {
            const current = rawArr[i];

            if (regex.test(current.str)) {
                regex.lastIndex = 0
                continue
            }

            accText += current.str;
            const index = accText.indexOf(searchText.replace(regex, ''));
            if (searchText.length > 0 && index > -1) {
                // console.log("🚀  accText", accText)
                // rawArr[i].index + 1 - searchArr.length 当searchArray和原文不完全一致时（过滤掉了md语法） 这种简单的计算方法会导致精度问题
                resolve([rawArr[i].index + 1 - searchArr.length, rawArr[i].index + 1])
                return
            }
        }
        resolve([0, 0])
    })
}


export const getHighlightInfo = (s1: string, s2: string) => highlightV1(convertToArray(s1), convertToArray(s2))

function splitBy(s1: string, splitter: RegExp) {
    const matchesIt = [...s1.matchAll(splitter)];
    let index = 0
    console.log("🚀  ", matchesIt);
    const sliceInfo: any[] = []
    matchesIt.forEach(item => {
        sliceInfo.push({
            item: s1.substring(index, item.index),
            index: {
                start: index,
                end: item.index
            }
        })

        const matchesEndIndex = item.index + item[0].length;
        sliceInfo.push({
            item: s1.substring(item.index, matchesEndIndex),
            index: {
                start: item.index,
                end: matchesEndIndex
            }
        })

        index = matchesEndIndex;
    })

    sliceInfo.push({
        item: s1.substring(index),
        index: {
            start: index,
            end: s1.length
        }
    })
    return sliceInfo
}

export const getHighlightInfoV2 = (s1: string, s2: string) => {
    const s1Slice = splitBy(s1, splitter);
    const s2Slice = splitBy(s2, splitter);
    console.log("🚀  s1Slice", s1Slice);
    console.log("🚀  s2Slice", s2Slice);

    return []
}
