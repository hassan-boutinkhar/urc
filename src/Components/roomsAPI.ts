import {ErrorCallback, SalonInfo} from "../model/common";
import {CustomError} from "../model/CustomError";

export function getRooms( onResult: (users: SalonInfo[]) => void, onError: ErrorCallback) {
    fetch("/api/rooms", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(async (response) => {
            if (response.ok) {
                const roomsList: SalonInfo[] = await response.json();

                console.log(roomsList)
                onResult(roomsList);
            } else {
                const error = await response.json() as CustomError;
                onError(error);
            }
        })
        .catch((error) => {
            console.error('Error fetching users:', error);
            onError({name: "", stack: "", code: "FETCH_ERROR", message: "Error fetching users" });
        });
}
