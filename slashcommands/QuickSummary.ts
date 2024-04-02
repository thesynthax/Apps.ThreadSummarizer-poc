import { IHttp, IModify, IRead } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { ISlashCommand, SlashCommandContext } from "@rocket.chat/apps-engine/definition/slashcommands";
import { IUser } from "@rocket.chat/apps-engine/definition/users";

export class QuickSummary implements ISlashCommand {
    public command: string = "quick-summarize";
    public i18nParamsExample: string = "AI Chat Conversation Thread Summarizer";
    public i18nDescription: string = "Generate summary of conversation thread.";
    public providesPreview: boolean = false;

    private getMessages = async (read: IRead, threadId: string): Promise<any> => {};
    private getSummary = async (http: IHttp, messages: string, API_URL: string, MODEL: string): Promise<any> => {};
    private sendMessage = async (modify: IModify, room: IRoom, sender: IUser, text: string, isPrivate: boolean, threadId?: string): Promise<any> => {};

    constructor(getMessages: any, getSummary: any, sendMessage: any) {
        this.getMessages = getMessages;
        this.getSummary = getSummary;
        this.sendMessage = sendMessage;
    }

    async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
        const sender = context.getSender();
        const room = context.getRoom()

        const threadId = context.getThreadId();
        if (!threadId) {
            await this.sendMessage(
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

        const messages = await this.getMessages(read, threadId);
        const summary = await this.getSummary(http, messages, API_URL, MODEL);
        await this.sendMessage(modify, room, sender, summary, false, threadId);
    }


}

