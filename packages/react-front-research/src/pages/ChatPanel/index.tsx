import {FC} from "react";
import {Chat, Types, useChat} from "@root/react-ui";
import {composeStream, getFetchStream} from "@/pages/ChatPanel/mock/readable_mock.ts";
import {sleep} from "@root/shared";
import fs from 'fs'




const ChatPanel: FC = () => {

    const chatProps = useChat({
        invoke: async (params, onMessage, onFinish) => {
            // await sleep(3000);
            composeStream<Types.IMessage>(await getFetchStream(), onMessage, onFinish)
        },
        stop: () => {
        }
    });

    return <Chat {...chatProps}/>;
}

export default ChatPanel;
