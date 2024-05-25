import { sleep } from "@root/shared";

export const getStream = <T>(data = 'may i help you') => new ReadableStream<T>({
    start: () => {
        console.log("🚀  start",)
    },
    pull: async (controller) => {
        console.log("🚀  pull",)
        for (const value of data) {
            await sleep(100)
            controller.enqueue(JSON.stringify({
                id: 1,
                content: value
            }) as T);
        }
        controller.close();
    },
    cancel: console.log,

})

export const getFetchStream = async () => {
    const request = await fetch('/chat-gpt-moc.txt',)
    return request.body
}

const textDecoder = new TextDecoder()

export const composeStream = <T>(stream: ReadableStream<string>, onMessage: (message: T) => void, onFinish?: (message?: T) => void) => {
    stream
        .pipeThrough(new TransformStream({
            transform(chunk, controller) {
                const s = textDecoder.decode(chunk)
                s.split('\n').forEach(item => {
                    item && controller.enqueue(item)

                })
            },
        }))
        .pipeThrough(new TransformStream({
            transform(chunk, controller) {
                // const data = JSON.parse(chunk)
                controller.enqueue(chunk.replace(/^data:\s*\r*/, ''))
            },
        }))
        .pipeThrough(new TransformStream({
            transform(chunk, controller) {
                try {
                    const data = JSON.parse(chunk)
                    controller.enqueue(data)
                } catch (error) {
                    console.error(error);

                }
            },
        }))
        .pipeThrough(new TransformStream({
            transform(chunk, controller){
                controller.enqueue({
                    content: chunk.message.content.parts[0],
                    id: chunk.conversation_id
                })
            }
        }))
        .pipeTo(new WritableStream({
            write: onMessage
        }))
        .then(() => {
            onFinish?.()
        })
}
