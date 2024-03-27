import React, {useEffect, useRef, useState} from "react";
import "react-pdf/dist/Page/TextLayer.css";
import {Document, Page, pdfjs} from "react-pdf";
import useHighlightInfo from "./useHighlightInfo";
import {PDFDocumentProxy} from "pdfjs-dist";
import {useGetState} from "ahooks";
import PdfLoading from "./PdfLoading.gif"

export type PDFProps = {
    file?: string | Blob | ArrayBuffer | undefined;
    searchText?: string;
    width?: number;
    highlightColor?: string;
    page_scale?: number;
};

export type HighlightSet = Set<string>

export type HighlightResultInfoType = {
    highlightSet: HighlightSet;
    pages: Set<number>
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.js",
    import.meta.url
).toString();

const Loading = () => {
    return <div style={{height: "100vh", flexShrink: 0, paddingTop: '60px'}}>
        loading
    </div>;
};

export const PDFViewer: React.FC<PDFProps> = ({
                                                  page_scale,
                                                  file,
                                                  searchText,
                                                  width
                                              }) => {
    const [pdfVisibility, setPdfVisibility] = useState(false);
    const pdfDocumentProxyRef = useRef<PDFDocumentProxy>();
    const [hlSet, setHlSet, getHlSet] = useGetState<HighlightSet>(new Set([]));
    // 高亮页下标
    const [hlPages, setHlPages] = useState<Set<number>>(new Set());
    // 所有页面下标
    const [allPages, setAllPages] = useState<number[]>([]);
    const {getHighlightInfo} = useHighlightInfo({searchText});


    const handleHighlightInfo = (res: boolean | HighlightResultInfoType) => {
        if (res && typeof res != "boolean") {
            setHlSet(res.highlightSet);
            setHlPages(res.pages);
        }
    };

    useEffect(() => {
        console.log('searchText', searchText)
        searchText && getHighlightInfo({pdfDocumentProxy: pdfDocumentProxyRef.current}).then(handleHighlightInfo);
    }, [searchText]);

    const renderPage = (pageNumber: number) => {
        return <Page
            scale={page_scale}
            width={width}
            pageNumber={pageNumber}
            renderTextLayer={hlPages.has(pageNumber - 1)}
            onRenderTextLayerSuccess={() => {
                if (hlPages.has(pageNumber - 1)) {
                    setPdfVisibility(true);
                    setTimeout(() => {
                        const targets = document.querySelectorAll('#text_highlight');
                        targets[targets.length - 1]?.scrollIntoView({
                            behavior: 'smooth',
                            block: "end",
                        })
                    })
                }
            }}
            customTextRenderer={(textItem) => {
                const itemKey = `${textItem.pageIndex}-${textItem.itemIndex}`;
                if (getHlSet().has(itemKey)) {
                    return `<span style="background:#fff;color: #27af81" id="text_highlight">${textItem.str}</>`;
                } else {
                    return "";
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



