import {Chat, useChat, Types} from '@marvin/react-ai'
import {useChatPage} from "./hooks/index.js";

export default function ChatPage() {
    const {conversations, handleSelectConversation, conversation} = useChatPage()

    const chatProps = useChat({
        async onSend(params) {
            console.log(params)
            return await fetch('/api/chat/stream', {
                method: 'POST',
                body: JSON.stringify({...params, conversationId: conversation?.conversationId}),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },
        onConversationEnd: console.log,
        onConversationStart: console.log,
        onStop: () => {
        }
    }, {
        historyMessage: conversation?.messages || []
    });


    return <>
        <div className={'flex gap-4'}>
            <div className={'p-2'}>
                {
                    conversations.map(item => {
                        return <div key={item.id} className={`${item.id === conversation?.id ? 'bg-blue-100': ''} mb-2`}
                                    onClick={() => handleSelectConversation(item)}>
                            {item.name}
                        </div>
                    })
                }

            </div>
            <div className={'w-[800px] h-screen'}>
                <Chat {...chatProps} AssistantMessageLayout={({answers, onRegenerate}) => {
                    return <>
                        {
                            answers?.map((answer, index) => {
                                return <div className={'flex'} key={index}>
                                    <div className={'bg-blue-300 text-white p-2'}>
                                        {answer.content}事实上
                                    </div>
                                </div>
                            })
                        }
                    </>
                }}/>
            </div>
        </div>
    </>;
}