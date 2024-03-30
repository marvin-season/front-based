import {useState} from "react";
import {BaseAttach, ChatItem, ChatProps} from "@/components/chat/types.ts";
import {nanoid} from "nanoid";
import {generateRandomTextWithCallback} from "@/utils/ContentGenerator.ts";
import {useImmer} from "use-immer";

export const useChat = (): ChatProps => {
    const [chatList, setChatList] = useImmer<ChatItem[]>([]);
    const [baseAttach, setBaseAttach] = useState<BaseAttach>({});


    const handleChat = (chatItem?: ChatItem) => {
        const groupId = nanoid()
        generateRandomTextWithCallback(({content, id}) => {
            setChatList(draft => {
                const find = draft.find(item => item.id === id);
                if (!find) {
                    return draft.concat({
                        id,
                        content,
                        role: 'answer',
                        groupId: chatItem?.groupId || groupId,
                    })
                } else {
                    find.content = find.content.concat(content)
                }
            })
        })
    }

    const onSelectedFile = (files: FileList) => {
        const images: any[] = [];
        for (let index = 0; index < files.length; index++) {
            const file = files[index]
            if (file) {
                const url = URL.createObjectURL(file);
                images.push({src: url, width: '120px'})
            }
        }

        setBaseAttach({
            images
        })
    }
    const onReload = (chatItem: ChatItem) => {
        handleChat(chatItem);
    }
    const onSend = (value: string) => {
        setChatList(chatList.concat({
            id: Date.now().toString(),
            content: value,
            role: 'question',
            groupId: nanoid(),
            chatItemAttach: baseAttach
        }))

        setBaseAttach({});

        handleChat()
    }

    return {
        chatList,
        chatAttach: baseAttach,
        onReload,
        onSend,
        onSelectedFile
    }

}
