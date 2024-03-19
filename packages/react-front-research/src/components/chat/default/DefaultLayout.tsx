import {AnswerChatItem, QuestionChatItem} from "@/components/chat/types.ts";
import {Flex} from "@/styled";
import React, {FC, useState} from "react";
import {useChatContext} from "@/components/chat/context/ChatContext.tsx";
import {Input} from "@/components/chat/styled.ts";

export function AnswerPanel({chatItem}: { chatItem: AnswerChatItem }) {
    return <Flex style={{
        background: 'lightblue'
    }}>
        <Flex>
            答：
        </Flex>
        <Flex>
            {chatItem.content}
        </Flex>

    </Flex>;
}

export function QuestionPanel({chatItem}: { chatItem: QuestionChatItem }) {
    return <Flex style={{
        background: 'lightcyan'
    }}>
        <Flex>
            问：
        </Flex>
        <Flex>
            {chatItem.content}
        </Flex>
    </Flex>;
}

export function ChatList() {
    const {chatList, renderAnswerPanel, renderQuestionPanel, renderChatItemLayout} = useChatContext();
    return <>
        {
            renderChatItemLayout?.(chatList, renderAnswerPanel, renderQuestionPanel)
        }
    </>;
}

export const UserInput: FC<{
    onChange?: (value: string) => void;
    onSend?: (value: string) => void;
}> = ({onChange, onSend}) => {
    const [value, setValue] = useState<string>('')

    return <Flex>
        <Input value={value} onChange={(e) => {
            setValue(e.target.value);
            onChange?.(e.target.value);
        }}/>
        <button onClick={() => {
            value.trim().length > 0 && onSend?.(value);
            setValue('')
        }}>发送
        </button>
    </Flex>
}