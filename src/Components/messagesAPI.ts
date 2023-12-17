import {ErrorCallback, Message} from "../model/common";
import {CustomError} from "../model/CustomError";

export function getMessages(sender_id: string, receiver_id: string, onResult: (messages: Message[]) => void, onError: ErrorCallback) {
    console.log(receiver_id)
    fetch(`/api/messages?sender_id=${sender_id}&receiver_id=${receiver_id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(async (response) => {
            if (response.ok) {
                const messagesFetched: Message[] = await response.json();
                onResult(messagesFetched);
            } else {
                const error = await response.json() as CustomError;
                onError(error);
            }
        })
        .catch((error) => {
            console.error('Error fetching messages:', error);
            onError({ name: "", stack: "", code: "FETCH_ERROR", message: "Error fetching messages" });
        });
}
