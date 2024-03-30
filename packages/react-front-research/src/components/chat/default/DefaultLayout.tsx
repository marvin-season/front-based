import {AnswerChatItem, QuestionChatItem} from "@/components/chat/types.ts";
import React, {useState} from "react";
import {useChatContext} from "@/components/chat/context/ChatContext.tsx";
import {FileSelector} from "@/components/file";
import {Button, Flex, Image, Input, message} from "antd";
import {defaultAnswerPanelRender, defaultQuestionPanelRender} from "@/components/chat/default/DefaultRender.tsx";
import {UploadOutlined} from "@ant-design/icons";

export function DefaultAnswerPanel({chatItem}: { chatItem: AnswerChatItem }) {
    return defaultAnswerPanelRender(chatItem)
}

export function DefaultQuestionPanel({chatItem}: { chatItem: QuestionChatItem }) {
    return defaultQuestionPanelRender(chatItem);
}

export function ChatList() {
    const {chatList, renderAnswerPanel, renderQuestionPanel, renderChatItemLayout} = useChatContext();
    return <>
        {
            renderChatItemLayout?.(chatList, renderAnswerPanel, renderQuestionPanel)
        }
    </>;
}

export const UserInput = () => {
    const [value, setValue] = useState<string>('');
    const {onSelectedFile, onSend} = useChatContext();

    const handleSend = () => {
        if (value.trim().length > 0) {
            onSend?.(value);
            setValue('')
        } else {
            message.info('消息不能为空').then()
        }
    }
    return <Flex align={"center"} gap={6}>
        <FileSelector onChange={onSelectedFile}><UploadOutlined className={'text-xl text-cyan-700'}/></FileSelector>
        <Input
            value={value}
            onKeyUp={e => {
                if (e.key.toLowerCase() == 'enter') {
                    handleSend()
                }
            }}
            onChange={(e) => {
                setValue(e.target.value);
            }}
        />

        <Button onClick={handleSend}>发送</Button>

    </Flex>
}


export const UseSelectedImage = () => {
    const {chatAttach} = useChatContext();

    return <>
        {
            chatAttach?.images?.map(image => {
                return <Image key={image.src} width={image.width} src={image.src} alt="no image"/>
            })
        }
    </>
}
