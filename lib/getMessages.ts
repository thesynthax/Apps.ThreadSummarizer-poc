import { IRead } from "@rocket.chat/apps-engine/definition/accessors";

export const getMessages = async (read: IRead, threadId: string) => {
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
