import {
    IAppAccessors,
    IConfigurationExtend,
    IHttp,
    ILogger,
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { QuickSummary } from './slashcommands/QuickSummary';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export class AppsThreadSummarizerPoCApp extends App {
    private readonly appLogger: ILogger;

    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors);
        this.appLogger = this.getLogger();
    }

    private api = async (http: IHttp, API_URL: string, MODEL: string, PROMPT: string) => {
        const headers = {
            "Content-Type": "application/json",
        };
        const data = {
            "model": MODEL,
            "prompt": PROMPT,
            "stream": false
        };

        const response = await http.post(API_URL, {
            headers,
            data
        });

        if (!response.content)
        {
            return new Error("Error: AI not working.")
        }

        return JSON.parse(response?.content!).response;
    }

    private getMessages = async (read: IRead, threadId: string) => {
        const threadReader = read.getThreadReader();
        const thread = await threadReader.getThreadById(threadId);

        const messages: string[] = [];
        for (const message of thread!) {
            if (message.text) {
                messages.push(`${message.sender.name}: ${message.text}`);
            }
        }

        messages.shift();
        return messages.join(" ## ");
    }

    private getSummary = async (http: IHttp, messages: string, API_URL: string, MODEL: string) => {
        const PROMPT = `You are a bot that assists chatting users to quickly understand what the users have been talking about in a conversation thread. Following are the senders and their messages separated by double hashtags ( ## ). Briefly summarize the messages: ${messages}`;
        const response = await this.api(http, API_URL, MODEL, PROMPT);
        return response;
    }

    private sendMessage = async (modify: IModify, room: IRoom, sender: IUser, text: string, isPrivate: boolean, threadId?: string) => {
        if (modify)
        {
            const message = modify?.getCreator()
                .startMessage()
                .setRoom(room)
                .setText(text);

            if (threadId)
                message.setThreadId(threadId);

            if (isPrivate) {
                // Use for private to you
                await modify
                    .getNotifier()
                    .notifyUser(sender, message.getMessage());
            }
            else {
                // Use for sending in thread visible to everyone
                await modify
                    .getCreator()
                    .finish(message);
            }
        }
    }

    protected async extendConfiguration(configuration: IConfigurationExtend): Promise<void> {
        configuration.slashCommands.provideSlashCommand(new QuickSummary(this.getMessages, this.getSummary, this.sendMessage));
    }
}

