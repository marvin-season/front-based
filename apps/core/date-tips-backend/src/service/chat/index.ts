import { Response } from "express";
import { StreamTextResult } from "ai";
import { MessageEvent } from "../../controller/chat-controller/constant";

export const chatService = {
  async writeStream(res: Response, result: StreamTextResult<Record<string, any>>, {
    conversationId,
  }: {
    conversationId: string
  }) {
    try {
      const id = Date.now();
      let content = "";
      res.write(`data: ${JSON.stringify({
        event: MessageEvent.conversationStart,
        content: "",
        id,
        conversationId,
      })}\n\n`);
      for await (const chunk of result.textStream) {
        content += chunk;
        res.write(`data: ${JSON.stringify({ event: MessageEvent.message, content: chunk, id, conversationId })}\n\n`);
      }
      res.write(`data: ${JSON.stringify({
        event: MessageEvent.conversationEnd,
        content: "",
        id,
        conversationId,
      })}\n\n`);

      return content;
    } catch (e) {
      console.log(e);
    }
  },
};