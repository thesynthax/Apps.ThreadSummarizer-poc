import { IHttp } from "@rocket.chat/apps-engine/definition/accessors";

export const api = async (http: IHttp, API_URL: string, MODEL: string, PROMPT: string) => {
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
