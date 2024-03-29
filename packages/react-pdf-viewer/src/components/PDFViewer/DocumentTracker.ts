import {TextItem} from "pdfjs-dist/types/src/display/api";
import {HighlightMap} from "./PDFViewer";

type resolveItemNode = {
    value: TextItem[];
    next: null | resolveItemNode;
    prev: null | resolveItemNode;
}
/**
 * 按照页解析，pdfjs以TextItem[]的数据格式，将页面的数据暴露出来
 * 高亮算法的思路是:
 * 0、取出当前page的文本项，放入累加文本中；
 * 1、判断累加的文本是否匹配，符合条件的TextItem 打标识
 * 2、否则开始下一页（将下一页数据累加到文本中）
 *
 * resolveItemsChain： 由每页的文本项节点组成的链表，头节点空
 * pointer一个游荡的指针
 */
export default class DocumentTracker {
    maxPage;
    trackedPage: number = 0; // 已经解析的页码个数
    resolveItemsChain: resolveItemNode; // 头节点
    pointer: resolveItemNode | null = null;
    resolveText = '';
    highlightMap: HighlightMap = new Map();
    highlightPageIndexSet: Set<number> = new Set();
    readonly regex = /[^\u4e00-\u9fa5a-zA-Z0-9]/g;

    constructor(maxPage = 3, regex?: RegExp) {
        this.maxPage = maxPage;

        this.resolveItemsChain = {
            value: [],
            next: null,
            prev: null
        }
    }

    async track(items: TextItem[], pageIndex: number, text: string) {
        // 最多跨页: 2
        if (this.trackedPage >= this.maxPage && this.resolveItemsChain.next) {
            const len = this.resolveItemsChain.next.value.reduce((prev, cur) => {
                return prev.concat(cur.str)
            }, '').length;

            this.resolveText = this.resolveText.slice(len)

            this.resolveItemsChain.next.prev = null
            this.resolveItemsChain.next = this.resolveItemsChain.next.next
        }

        const resolveItems: TextItem[] = [];

        this.pointer = this.resolveItemsChain;
        while (this.pointer.next != null) {
            this.pointer = this.pointer.next
        }

        this.pointer.next = {value: resolveItems, next: null, prev: this.pointer} // 双向
        this.pointer = this.pointer.next
        this.trackedPage += 1;

        const searchText = text.replace(this.regex, '');
        for (let index = 0; index < items.length; index++) {
            resolveItems.push(items[index])
            this.resolveText += items[index].str.replace(this.regex, '');
            if (this.resolveText.indexOf(searchText) != -1) {
                // resolveItems has been searched Text
                let str = '';

                while (this.pointer.prev) {
                    const resolveItems = this.pointer.value;
                    for (let reverseIndex = resolveItems.length - 1; reverseIndex >= 0; reverseIndex--) {
                        str = resolveItems[reverseIndex].str.replace(this.regex, '') + str;
                        if(this.highlightMap.has(pageIndex)){
                            this.highlightMap.get(pageIndex)?.push(reverseIndex)
                        }else {
                            this.highlightMap.set(pageIndex, [reverseIndex])
                        }
                        this.highlightPageIndexSet.add(pageIndex)
                        if (str.indexOf(searchText) != -1) {
                            return true
                        }
                    }

                    this.pointer = this.pointer.prev
                }
            }
        }

        return false
    }
}
