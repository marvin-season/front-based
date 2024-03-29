import React, {useState} from "react";
import {PdfViewer} from "@/components/pdf/PdfViewer.tsx";

const keywords = {
    demo6: '了众多超级极客和高瞻远瞩的商业领袖'
}

function Index() {
    const [url, setUrl] = useState('/demo.pdf')

    return <div>
        <div style={{height: `500px`, overflow: "auto",}}>
            <PdfViewer url={'/tenant-api/api/knowledge/file/download?url=http:aa.pdf'}
                       width={800} searchText={keywords.demo6}/>;
        </div>

    </div>
}

export default Index;
