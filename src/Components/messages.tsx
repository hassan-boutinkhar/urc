import React, { useEffect, useState } from "react";
import '../css/Messages.css';
import { Input } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUsersList } from "../slices/usersListSlice";
import { Message, UserInfo } from "../model/common";
import { CustomError } from "../model/CustomError";
import { getUsers } from "../user/usersApi";
import Button from "@mui/material/Button";
import { messagesList } from "../slices/messagesSlice";
import { getMessages } from "./messagesAPI";
import { addMessage } from "./addMessage";

export function Messages() {
    const navigate = useNavigate();
    const userInfos = useSelector(selectUsersList);
    const [users, setUsersList] = useState<UserInfo[]>([]);
    const [error, setError] = useState({} as CustomError);
    const id = sessionStorage.getItem('idConnectedUser');
    const [messages, setMessages] = useState<Message[]>([]);
    const messageList = useSelector(messagesList);
    const [idUser, setIdUser] = useState<string | null>(null);
    const [idUserDisscution, setIdUserDisscution] = useState<string | null>(null);
    const [message, setMessage] = useState('');

    console.log(id);

    if (id != null) {
        useEffect(() => {
            getUsers(
                id,
                (result: UserInfo[]) => {
                    setError(new CustomError(""));
                    setUsersList(result);
                },
                (loginError: CustomError) => {
                    console.log(loginError);
                    setError(loginError);
                }
            );

            setMessages(messageList);

        }, [navigate, userInfos, messageList]);
        console.log(users);
    }

    // Fonction pour sélectionner une discussion
    const selectDisscusion = (idReceiver: string) => {
        setIdUserDisscution(idReceiver);
        setIdUser(id ? id : '');
        console.log("hello " + idUser + " helle2: " + idUserDisscution);
        refreshData();
    }

    // Fonction pour envoyer un message
    const sendMessage = () => {
        console.log("hello " + idUser + " helle2: " + idUserDisscution);
        if (idUser && idUserDisscution) {
            const messageObject: Message = {
                message_id: 0,
                sender_id: idUser,
                receiver_id: idUserDisscution,
                content: message,
                formatted_timestamp: ' ', // Remplacez par la date et l'heure réelles
                message_type: 'user_to_user',
            };

            console.log(messageObject);

            addMessage(messageObject, (result: boolean) => {
                console.log("Message envoyé avec succès :", result);
                setMessage('');
                refreshData();
            }, (sendMessageError: CustomError) => {
                console.error("Erreur lors de l'envoi du message :", sendMessageError);
            });
        }
    }

    const refreshData = () => {
        if (idUser != null && idUserDisscution != null) {
            getMessages(idUser, idUserDisscution,
                (result: Message[]) => {
                    setError(new CustomError(""));
                    setMessages(result.reverse());
                    console.log(result);
                },
                (loginError: CustomError) => {
                    console.log(loginError);
                    setError(loginError);
                }
            )
            setMessages(messageList);
            console.log(messageList);

        }
    }

    return (
        <div className="container">
            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card chat-app">
                        <div id="plist" className="people-list">
                            <ul className="list-unstyled chat-list mt-2 mb-0 " id="listUserId">
                                {users.map((user: UserInfo) => (
                                    <Button className="name" onClick={() => selectDisscusion(user.user_id)} key={user.user_id}>
                                        <li className="clearfix " >
                                            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
                                            <div className="about">
                                                <div className="name">{user.username}</div>
                                                <div className="status"> <i className="fa fa-circle offline"></i> {user.last_login} </div>
                                            </div>
                                        </li>
                                    </Button>))}
                            </ul>
                        </div>
                        <div className="chat">
                            <div className="chat-header clearfix"></div>
                            <div className="chat-history">
                                <ul className="m-b-0">
                                    {messages.map((message: Message) => (
                                        <li className="clearfix" key={message.message_id}>
                                            <div className="message-data text-left">
                                                <span className="message-data-time">{message.formatted_timestamp}</span>
                                                {message.sender_id === id ? (
                                                    <>
                                                        <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
                                                        <div className="message other-message float-right">{message.content}</div>
                                                    </>
                                                ) : (
                                                    <div className="message my-message">{message.content}</div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="chat-message clearfix w-100" id="sendMessage">
                                <div className="input-group " id="inptSend">
                                    <Button onClick={sendMessage}>
                                        <span className="input-group-text">
                                            <i className="fa fa-send"></i>
                                        </span>
                                    </Button>
                                    <Input
                                        type="text"
                                        className="form-control"
                                        placeholder="Saisir votre message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        style={{ width: '700px' }} // Remplacez '300px' par la valeur de la largeur souhaitée
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
