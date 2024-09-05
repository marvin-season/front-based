import React, {FC} from "react";
import { Message} from "@/types/chat.tsx";
import {Flex} from "antd";
import MarkdownContent from "./MarkdownContent.tsx";


export const UserMessageLayout: FC<{ message: Message }> = ({message}) => {
    return <>
        <Flex className={'p-2'} justify={"flex-end"}>
            <Flex vertical={true} gap={2} align={'end'}
                  className={'bg-indigo-100 p-2 pl-4 pr-4 rounded-lg hover:bg-indigo-200 hover:cursor-pointer'}>
                <div>
                </div>
                <MarkdownContent source={message.content}/>
            </Flex>
        </Flex>
    </>
}