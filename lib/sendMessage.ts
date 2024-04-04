import { IModify } from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IUser } from "@rocket.chat/apps-engine/definition/users";


export const sendMessage = async (modify: IModify, room: IRoom, sender: IUser, text: string, isPrivate: boolean, threadId?: string): Promise<any> => {
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
