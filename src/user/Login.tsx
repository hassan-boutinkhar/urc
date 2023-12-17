import * as React from "react";
import {useState} from "react";
import {loginUser} from "./loginApi";
import {Session} from "../model/common";
import {CustomError} from "../model/CustomError";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';
import {useNavigate} from "react-router-dom";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function Login() {
    const [error, setError] = useState<CustomError | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const navigate = useNavigate();

    const handleClick = () => {
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        console.log(data.get("login"));

        loginUser(
            {
                user_id: -1,
                username: data.get("login") as string,
                password: data.get("password") as string,
            },
            (result: Session) => {
                console.log(result);
                setSession(result);
                form.reset();
                setError(null);
                navigate('/userConnectedPage');

            },
            (loginError: CustomError) => {
                console.log(loginError);
                setError(loginError);
                setSession(null);
                handleClick();
            }
        );
    };

    return (
        <>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' ,width: '180vh'}}>
                <Box
                    component="form"
                    sx={{
                        "& > :not(style)": { m: 1, width: "190%" },
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit} // Add this line
                >
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity="info" >Se connecter </Alert>
                    </Stack>
                    <TextField
                        id="outlined-basic"
                        label="Login"
                        variant="outlined"
                        name="login"
                        placeholder="login"
                    />
                    <br />
                    <TextField
                        id="filled-basic"
                        label="Password"
                        variant="filled"
                        name="password"
                        placeholder="Password"
                        type="password"
                    />
                    <br />
                    <Button variant="contained" type="submit" disableElevation>
                        Connexion
                    </Button>
                </Box>
            </Box>

            {session && session.token && (
                <span>
                    {session.username} : {session.token}
                </span>
            )}
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                        {error && error.message ? error.message : "Erreur de connexion"}
                    </Alert>
                </Snackbar>
            </Stack>
        </>
    );
}
