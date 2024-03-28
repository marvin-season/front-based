import {AnswerChatItem, ChatItem, ChatProps, QuestionChatItem} from "@/components/chat/types.ts";
import React, {FC, useMemo, useState} from "react";
import {Flex} from "@/styled";
// @ts-ignore
import {groupBy} from "@root/shared";
import {Image, Typography} from "antd";
import {useChatContext} from "@/components/chat/context/ChatContext.tsx";

export const groupRenderLayout: ChatProps['renderChatItemLayout'] = (chatList, renderAnswerPanel, renderQuestionPanel) => {

    const groupedChatList = useMemo(() => {
        return groupBy<ChatItem>(chatList, 'groupId') as ChatItem[][]
    }, [chatList.length]);

    console.log('groupedChatList', groupedChatList)
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
    const {onReload} = useChatContext();
    const handleChangeIndex = (i: number) => {
        console.log(currentIndex);
        if (currentIndex + i < 0 || currentIndex + i > list.length - 1) {
            return;
        }

        setCurrentIndex(currentIndex + i);
    };
    return <>

        {
            list[currentIndex].role == "answer" && <>
                {
                    AnswerPanel({chatItem: list[currentIndex]})
                }
                <Flex>
                    {
                        list.length > 1 && <Flex>
                            <div style={{cursor: "pointer"}} onClick={() => handleChangeIndex(-1)}>{'<'}</div>
                            {currentIndex + 1}/{list.length}
                            <div style={{cursor: "pointer"}} onClick={() => handleChangeIndex(1)}>{'>'}</div>
                        </Flex>
                    }
                    <Typography.Link type="success" onClick={() => onReload?.(list[currentIndex])}>reload</Typography.Link>
                </Flex>
            </>
        }
        {
            list[currentIndex].role == "question" && QuestionPanel({chatItem: list[currentIndex]})
        }


    </>
}

export function QuestionPanel({chatItem}: { chatItem: QuestionChatItem }) {
    return <Flex style={{
        background: '#ffffff',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '8px',
        boxSizing: 'border-box'
    }}>
        <div>
            <div>
                {
                    chatItem.chatItemAttach?.images?.map(item => {
                        return <Image key={item.src} width={item.width} height={item.height} src={item.src}
                                      alt={item.src}/>
                    })
                }
            </div>
            <div>
                {chatItem.content}
            </div>
        </div>
    </Flex>;
}

export function AnswerPanel({chatItem}: { chatItem: AnswerChatItem }) {
    return <Flex style={{
        background: '#81d8d0',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '8px',
        boxSizing: 'border-box'
    }}>
        <Flex>
            {chatItem.content}
        </Flex>

    </Flex>;
}

