import { IHttp, IModify, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { ISlashCommand, SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { sendMessage } from "../lib/sendMessage";
import { getSummary } from "../lib/getSummary";
import { getMessages } from "../lib/getMessages";

export class Summary implements ISlashCommand {
    public command: string = "summarize";
    public i18nParamsExample: string = "AI Chat Conversation Thread Summarizer";
    public i18nDescription: string = "Generate summary of conversation thread.";
    public providesPreview: boolean = false;

    async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {

    }

    private summarize = async(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> => {
        const sender = context.getSender();
        const room = context.getRoom()

        const threadId = context.getThreadId();
        if (!threadId) {
            await sendMessage(
                modify,
                room,
                sender,
                "You can only call /summarize in a thread",
                true
            );
            throw new Error("You can only call /summarize in a thread");
        }

        const API_URL = "http://localhost:11434/api/generate";
        const MODEL = "mistral";

        const messages = await getMessages(read, threadId);
        const summary = await getSummary(http, messages, API_URL, MODEL);
        await sendMessage(modify, room, sender, summary, false, threadId);
    }
}

