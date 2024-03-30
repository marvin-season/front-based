import React, {FC} from "react";
import {ChatProps} from "@/components/chat/types.ts";
import {
    defaultAnswerPanelRender,
    defaultQuestionPanelRender,
    linerLayoutRender
} from "@/components/chat/default/DefaultRender.tsx";
import {ChatList, UserInput, UseSelectedImage} from "@/components/chat/default/DefaultLayout.tsx";
import {ChatContext} from "./context/ChatContext";
import {Flex} from "antd";


export const Chat: FC<ChatProps> = ({
                                        renderAnswerPanel = defaultAnswerPanelRender,
                                        renderQuestionPanel = defaultQuestionPanelRender,
                                        renderChatItemLayout = linerLayoutRender,
                                        ...restProps
                                    }) => {


    return <ChatContext.Provider value={{
        renderQuestionPanel,
        renderAnswerPanel,
        renderChatItemLayout,
        ...restProps
    }}>
        <Flex vertical={true} gap={6} className={'h-full p-6'}>
            <Flex vertical={true} className={'h-2/3 overflow-y-auto border-slate-200 p-4 border rounded-lg'}>
                <ChatList/>
            </Flex>
            <UseSelectedImage/>
            <UserInput/>
        </Flex>

    </ChatContext.Provider>
}
