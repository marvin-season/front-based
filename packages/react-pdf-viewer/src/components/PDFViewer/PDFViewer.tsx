import React, {useEffect, useRef, useState} from "react";
import "react-pdf/dist/Page/TextLayer.css";
import {Document, Page, pdfjs} from "react-pdf";
import useHighlightInfo from "./useHighlightInfo";
import {PDFDocumentProxy} from "pdfjs-dist";
import './index.css'

export type PDFProps = {
    file?: string | Blob | ArrayBuffer | undefined;
    searchText?: string;
    width?: number;
    highlightColor?: string;
    page_scale?: number;
};

export type HighlightMap = Map<number, number[]>

export type HighlightResultInfoType = {
    highlightMap: HighlightMap;
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
).toString();

export const PDFViewer: React.FC<PDFProps> = ({
                                                  page_scale,
                                                  file,
                                                  searchText,
                                                  width
                                              }) => {
    const pdfDocumentProxyRef = useRef<PDFDocumentProxy>();
    const [hlMap, setHlMap] = useState<HighlightMap | null>(null);

    // 高亮页下标
    const [allPages, setAllPages] = useState<number[]>([]);
    const {getHighlightInfo} = useHighlightInfo({searchText, salt: typeof file === "string" ? file : ''});


    const handleHighlightInfo = (res: boolean | HighlightResultInfoType) => {
        if (res && typeof res != "boolean") {
            setHlMap(res.highlightMap);
        }
    };

    useEffect(() => {
        searchText && getHighlightInfo({pdfDocumentProxy: pdfDocumentProxyRef.current}).then(handleHighlightInfo);
    }, [searchText]);


    const renderPage = (pageNumber: number) => {
        return <Page
            scale={page_scale}
            width={width}
            pageNumber={pageNumber}
            renderTextLayer={!!(hlMap && hlMap.has(pageNumber - 1))}
            onRenderTextLayerSuccess={() => {
                const elements = document.querySelectorAll(`[data-page-number='${pageNumber}'] .textLayer [role='presentation']`);
                if (hlMap) {
                    const targetPageTextItems = hlMap.get(pageNumber - 1);
                    targetPageTextItems?.forEach(i => {
                        // 添加预定义的高亮类
                        elements[i].classList.add('pdf-highlight');
                    })
                    const targetTextItemIndex = targetPageTextItems?.at(0);
                    if (targetTextItemIndex || targetTextItemIndex == 0) {
                        elements[targetTextItemIndex].scrollIntoView({behavior: 'smooth', block: "center"})
                    }
                }
            }}
            renderAnnotationLayer={false}>
        </Page>;
    };


    return <>
        <Document
            file={file}
            onLoadSuccess={(pdf) => {
                pdfDocumentProxyRef.current = pdf;
                getHighlightInfo({pdfDocumentProxy: pdf}).then(handleHighlightInfo);
                setAllPages(new Array(pdf.numPages).fill(0).map((item, index) => index));
            }}>
            {
                allPages.map(pageIndex => <div key={pageIndex + 1}>
                        {
                            renderPage(pageIndex + 1)
                        }
                    </div>
                )
            }

        </Document>
    </>;
};



