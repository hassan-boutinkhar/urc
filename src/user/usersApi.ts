
import { ErrorCallback, UserInfo } from "../model/common";
import {CustomError} from "../model/CustomError";

export function getUsers(id: string, onResult: (users: UserInfo[]) => void, onError: ErrorCallback) {
    fetch("/api/users", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(async (response) => {
            if (response.ok) {
                const userFetched: UserInfo[] = await response.json();

                const list = userFetched.filter((user) => user.user_id != id);

                onResult(list);
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
