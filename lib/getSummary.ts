import { IHttp } from "@rocket.chat/apps-engine/definition/accessors";
import { api } from "./api"

export const getSummary = async (http: IHttp, messages: string, API_URL: string, MODEL: string) => {
    const PROMPT = `You are a bot that assists chatting users in quickly understanding what the users have been talking about in a conversation thread. Following are the senders and their messages separated by double hashtags ( ## ). Briefly summarize the messages: ${messages}`;
    const response = await api(http, API_URL, MODEL, PROMPT);
    return response;
}
