import {PDFViewer} from "@/components/PDFViewer/index.ts";
import {ChangeEventHandler, useEffect, useState} from "react";


function PDFTest() {
    const [hls, setHls] = useState<{
        content: string,
    }[]>([
        {
            content: '。\n' +
                '　　沈璃⼀⼈⾏动极快，瞬息便转⾄郊外野⼭，她⽴于⼭头望远处⼀望，正是⻛和⽇丽之⽇，远处⻛光尽收眼底，京城城⻔已在极远的地⽅，她⾐袍⼀转，步⼊⼭林之间，寻得灵⽓极盛之处，掌⼼法⼒凝聚，覆掌与地，肃容低喝：“来！”\n' +
                '　　仿似有⼀道灵光⾃她掌⼼灌⼊地⾯，光芒以她为圆⼼，极快的向四周扩散开来，⼭⽯颤动，⻦兽惊⽽四⾛，劲⻛扬起沈璃的⾐⻆，待⾐摆再次落地，不消⽚刻，寂静的⼭林⾥倏地出现数到身影'
        },
        {
            content: '。\n' +
                '　　这倒省事，沈璃⼀把擒住扑来的⼩荷的⼿腕，扣住命⻔，将她的⼿往后背⼀拧，径直将她擒住，接着把她脖⼦⼀揽，往廊桥边的护栏上⼀放，将红缨枪往空中⼀扔，枪随即消失'
        },
        {
            content: '这⾏⽌君独居天外天已经数不清有好多年了！他根本就不知道天界谁是谁吧！更别提魔界了！他到底是怎么定的⼈选啊！这⽼⼈家偶尔⼼⾎来潮来天界议个事，竟议毁了他的⼀⽣啊！\n' +
                '　　不过事到如今毁也毁成这样了，拂容君⼼道，难怪天帝今⽇⽐往⽇更⽣⽓⼀些，原来是怕他这违背⾏⽌君⼼意的话触了⾏⽌君逆鳞。但是既然知道这亲是谁定的，那就直接求求这幕后之⼈吧'
        },
        {
            content: '谁要你施舍了!'
        },
        {
            content: '。”\n' +
                '　　沈璃眺望远处京城，⼿臂⼀伸，红缨⻓枪⻜回她的掌⼼，五指⽤⼒，握住⻓枪，沈璃凭空⼀跃，身影只在空中留下⼀场疾⻛。待她消失之后众仙皆嘀嘀咕咕的讨论起来：\n' +
                '　　“这到底是哪⾥来的家伙啊，⼀身煞⽓好吓⼈。”\n' +
                '　　“⼀看就是魔界的⼈呐！霸道⼜横蛮……湖⿅你没受什么伤吧？”\n' +
                '　　“唔，嗯，没事'
        }

    ])
    const [url, setUrl] = useState('/与凤行.pdf')
    const [file, setFile] = useState<Blob | string>(url);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [searchText, setSearchText] = useState('');


    const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
        let file: File | undefined = e.currentTarget.files?.[0];
        if (!file) {
            return
        }
        setFile(file)
    }

    return (
        <>
            <div style={{display: 'flex', gap: '20px'}}>
                <div style={{
                    overflow: 'auto',
                    height: '800px'
                }}>
                    <PDFViewer
                        width={800}
                        searchText={hls[currentIndex].content}
                        file={file}/>
                </div>


                <div>
                    <input type={'file'} onChange={handleFileChange}/>

                    <textarea value={searchText} onChange={(e) => {
                        setSearchText(e.currentTarget.value)
                    }}/>
                    <button onClick={() => {
                        hls.push({
                            content: searchText,
                        })
                        setSearchText('')
                    }}>添加
                    </button>
                    <input value={url} onChange={(e) => setUrl(e.target.value)}/>

                    <button onClick={() => {
                        setFile(url)
                    }}>添加url
                    </button>
                    <div style={{maxWidth: '600px'}}>

                        {
                            hls.map((item, index) => <div
                                onClick={() => {
                                    setCurrentIndex(index)
                                }}
                                key={index}
                                style={{
                                    border: currentIndex === index ? 'blue solid 2px' : '1px black dashed',
                                    padding: '10px',
                                    cursor: 'pointer',
                                }}>
                                {item.content}
                            </div>)
                        }
                    </div>

                </div>
            </div>
        </>
    )
}

export default PDFTest
