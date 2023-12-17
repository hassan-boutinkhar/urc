import {Session, SessionCallback, ErrorCallback, User} from "../model/common";
import {CustomError} from "../model/CustomError";

export function loginUser(user: User, onResult: SessionCallback, onError: ErrorCallback) {
    fetch("/api/login",
        {
            method: "POST", // ou 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
        .then(async (response) => {
            console.log('Response from /api/login:', response);
            if (response.ok) {
                const session = await response.json() as Session;
                sessionStorage.setItem('token', session.token);
                sessionStorage.setItem('externalId', session.externalId);
                sessionStorage.setItem('username', session.username || "");
                if(session.id!=null){
                    sessionStorage.setItem('idConnectedUser', session.id.toString());
                }
                onResult(session)
            } else {
                const error = await response.json() as CustomError;
                onError(error);
            }
            console.log('Response from /api/login:', response);
        }, onError);
}
export function logoutUser() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('externalId');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('idConnectedUser');
}
