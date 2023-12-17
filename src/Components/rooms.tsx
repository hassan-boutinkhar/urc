import React, {useEffect, useState} from "react";
import '../css/Messages.css';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Input,
    Snackbar,
    Stack,
    TextField
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {selectUsersList} from "../slices/usersListSlice";
import {Message, SalonInfo, UserInfo} from "../model/common";
import {CustomError} from "../model/CustomError";
import {getMessages} from "./messagesAPI";
import {messagesList} from "../slices/messagesSlice";
import {selectSalonsList} from "../slices/salonsListSlice";
import {getRooms} from "./roomsAPI";
import {addRoom} from "./addRoomAPI";
import MuiAlert, {AlertProps} from "@mui/material/Alert";
import {addMessage} from "./addMessage";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function Rooms() {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const userInfos = useSelector(selectUsersList);
    const messageList = useSelector(messagesList);
    const [users, setUsersList] = useState<UserInfo[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState({} as CustomError);
    const id = sessionStorage.getItem('idConnectedUser');
    const dispatch = useDispatch();

    const salonsList = useSelector(selectSalonsList);
    const [salons, setSalons] = useState<SalonInfo[]>([]);
    const [open, setOpen] = React.useState(false);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [openSnackbarSuccess, setOpenSnackbarSuccess] = React.useState(false);

    const [salonInfo, setSalonInfo] = useState({
        room_id: '',
        name: '',
        created_on: '',
        created_by: '',
    });

    const [idUser, setIdUser] = useState<string | null>(null);
    const [idRoom, setIdRoom] = useState<string | null>(null);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        setSalonInfo((prevSalonInfo) => ({
            ...prevSalonInfo,
            [id]: value,
        }));
    };

    const idConnectedUser = sessionStorage.getItem('idConnectedUser');

    const handleSubscribe = () => {
        const objectSalon: SalonInfo = {
            room_id: salonInfo.room_id,
            name: salonInfo.name,
            created_on: salonInfo.created_on,
            created_by: idConnectedUser!,
        };

        addRoom(
            objectSalon,
            (success) => {
                setOpenSnackbarSuccess(true);
                handleClose();
                getRooms(
                    (result: SalonInfo[]) => {
                        setError(new CustomError(""));
                        setSalons(result);
                    },
                    (loginError: CustomError) => {
                        console.log(loginError);
                        setError(loginError);
                    }
                );
            },
            (error) => {
                console.error('Error adding room:', error);
                setError(error);
                handleClick();
            }
        );
    };

    useEffect(() => {
        getRooms(
            (result: SalonInfo[]) => {
                setError(new CustomError(""));
                setSalons(result);
            },
            (loginError: CustomError) => {
                console.log(loginError);
                setError(loginError);
            }
        );
        setSalons(salonsList);
        setMessages(messageList);
    }, [salonsList, messageList]);

    if (id != null) {
        useEffect(() => {
            getRooms(
                (result: SalonInfo[]) => {
                    setError(new CustomError(""));
                    setSalons(result);
                },
                (loginError: CustomError) => {
                    console.log(loginError);
                    setError(loginError);
                }
            );
            refreshData();
        }, [navigate, salonsList, messageList]);
    }

    const handleClick = () => {
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const selectDiscussion = (idRoom: string) => {
        setIdUser(idConnectedUser);
        setIdRoom(idRoom);
        refreshData();
    };

    const refreshData = () => {
        if (idUser && idRoom) {
            getMessages(
                idUser,
                idRoom,
                (result: Message[]) => {
                    setError(new CustomError(""));
                    setMessages(result.reverse());
                },
                (loginError: CustomError) => {
                    console.log(loginError);
                    setError(loginError);
                }
            );
            setMessages(messageList);
        }
    };

    const sendMessage = () => {
        if (idUser && idRoom) {
            const messageObject: Message = {
                message_id: 0,
                sender_id: idUser,
                receiver_id: idRoom,
                content: message,
                formatted_timestamp: ' ',
                message_type: 'group_chat',
            };

            addMessage(
                messageObject,
                (result: boolean) => {
                    setMessage('');
                    refreshData();
                },
                (sendMessageError: CustomError) => {
                    console.error("Erreur lors de l'envoi du message :", sendMessageError);
                }
            );
        }
    };

    return (
        <div className="container">
            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card chat-app">
                        <div id="plist" className="people-list">
                            <ul className="list-unstyled chat-list mt-1 mb-0 pr-6 mr-2" id="listUserId">
                                <div>
                                    <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                                        Créer un nouveau salon
                                    </Button>
                                    <Dialog open={open} onClose={handleClose}>
                                        <DialogTitle>Créer un nouveau salon</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText>
                                                Veuillez remplir les détails pour créer une nouvelle salle.
                                            </DialogContentText>
                                            <TextField
                                                margin="dense"
                                                id="name"
                                                label="Nom de salon"
                                                type="text"
                                                fullWidth
                                                variant="standard"
                                                onChange={handleChange}
                                            />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleClose} color="secondary">
                                                Annuler
                                            </Button>
                                            <Button onClick={handleSubscribe} color="primary">
                                                Créer
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </div>
                                {salons.map((salon: SalonInfo) => (
                                    <Button className="name" key={salon.room_id} onClick={() => selectDiscussion(salon.room_id)}>
                                        <li className="clearfix">
                                            <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
                                            <div className="about">
                                                <div className="name">{salon.name}</div>
                                                <div className="status">
                                                    <i className="fa fa-circle offline"></i> {salon.room_id}
                                                </div>
                                            </div>
                                        </li>
                                    </Button>
                                ))}
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
                                        style={{ width: '700px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                        {error && error.message ? error.message : "Un salon existe déjà avec le même nom"}
                    </Alert>
                </Snackbar>
                <Snackbar open={openSnackbarSuccess} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                        {"Le salon a été ajouté avec succès"}
                    </Alert>
                </Snackbar>
            </Stack>
        </div>
    );
}
