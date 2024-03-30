import React from "react";
import {ChatProps, CommonPanelRenderType} from "@/components/chat/types.ts";
import {Flex, Image} from "antd";
import {ReloadOutlined} from "@ant-design/icons";
import {useChatContext} from "@/components/chat/context/ChatContext.tsx";

export const linerLayoutRender: ChatProps['renderChatItemLayout'] = (chatList, renderAnswer, renderQuestion) => <>
    {
        chatList.map(chatItem => {
            return <div key={chatItem.id}>
                {
                    chatItem.role === 'answer' ? renderAnswer?.(chatItem) : renderQuestion?.(chatItem)
                }
            </div>
        })
    }
</>


export const defaultAnswerPanelRender: CommonPanelRenderType = (chatItem) => {
    const {onReload} = useChatContext();

    return <>
        <Flex gap={6} className={'p-2'} justify={"flex-start"}>
            <div
                className={'bg-sky-100 p-2 pl-4 pr-4 rounded-lg hover:bg-sky-200 hover:cursor-pointer font-mono text-sm'}>
                {chatItem.content}
            </div>
            <ReloadOutlined className={'text-sm text-sky-400'} onClick={() => onReload?.(chatItem)}/>
        </Flex>
    </>
}
export const defaultQuestionPanelRender: CommonPanelRenderType = (chatItem) => {
    return <Flex className={'p-2'} justify={"flex-end"}>
        <Flex vertical={true} gap={2} align={'end'}
              className={'bg-indigo-100 p-2 pl-4 pr-4 rounded-lg hover:bg-indigo-200 hover:cursor-pointer'}>
            <div>
                {
                    chatItem.chatItemAttach?.images?.map(item => {
                        return <Image className={'overflow-auto rounded-lg'} key={item.src} width={item.width}
                                      height={item.height} src={item.src}
                                      alt={item.src}/>
                    })
                }
            </div>
            <div className={'font-mono text-sm'}>
                {chatItem.content}
            </div>
        </Flex>
    </Flex>
}
