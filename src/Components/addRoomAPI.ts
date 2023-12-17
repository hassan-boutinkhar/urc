// roomApi.ts
import {ErrorCallback, SalonInfo} from "../model/common";
import {CustomError} from "../model/CustomError";


export function addRoom(room:SalonInfo, onResult: (success: boolean) => void, onError: ErrorCallback) {
    fetch("/api/addRoom", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(room),
    })
        .then(async (response) => {
            console.log('Response from /api/addRoom:', response);
            if (response.ok) {
                onResult(true);
            } else {
                const error = await response.json() as CustomError;
                onError(error);
            }
        }, onError);
}
