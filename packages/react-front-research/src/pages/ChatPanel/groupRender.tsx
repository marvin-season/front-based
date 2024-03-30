import {ChatItem, ChatProps} from "@/components/chat/types.ts";
import React, {FC, useMemo, useState} from "react";
import {Flex} from "@/styled";
// @ts-ignore
import {groupBy} from "@root/shared";
import {defaultAnswerPanelRender, defaultQuestionPanelRender} from "@/components/chat/default/DefaultRender.tsx";

export const groupRenderLayout: ChatProps['renderChatItemLayout'] = (chatList, renderAnswerPanel, renderQuestionPanel) => {

    const groupedChatList = useMemo(() => {
        return groupBy<ChatItem>(chatList, 'groupId') as ChatItem[][]
    }, [chatList.length]);

    return <div>
        {
            groupedChatList.map((groupItem, index) => {
                return <SwiperChatItemPanel list={groupItem} key={index}/>
            })
        }
    </div>
}

export const SwiperChatItemPanel: FC<{ list: ChatItem[] }> = ({list}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleChangeIndex = (i: number) => {
        console.log(currentIndex);
        if (currentIndex + i < 0 || currentIndex + i > list.length - 1) {
            return;
        }

        setCurrentIndex(currentIndex + i);
    };
    return <>
        {/*回答*/}
        {
            list[currentIndex].role == "answer" && <>
                {defaultAnswerPanelRender(list[currentIndex])}
                <Flex>
                    {
                        list.length > 1 && <Flex className={'pl-2 cursor-pointer text-sm text-sky-400 select-none'}>
                            <div onClick={() => handleChangeIndex(-1)}>{'<'}</div>
                            {currentIndex + 1}/{list.length}
                            <div onClick={() => handleChangeIndex(1)}>{'>'}</div>
                        </Flex>
                    }
                </Flex>
            </>
        }

        {/*问题*/}
        {
            list[currentIndex].role == "question" && defaultQuestionPanelRender(list[currentIndex])
        }
    </>
}


