// messageApi.ts
import {ErrorCallback, Message} from "../model/common";
import {CustomError} from "../model/CustomError";


export function addMessage(message: Message, onResult: (success: boolean) => void, onError: ErrorCallback) {
    console.log('message object :'+message.message_type)
    fetch("/api/addMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    })
        .then(async (response) => {
            console.log('Response from /api/addMessage:', response);
            if (response.ok) {
                onResult(true);
            } else {
                const error = await response.json() as CustomError;
                onError(error);
            }
        }, onError);
}
