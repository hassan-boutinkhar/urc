import React, {useState} from 'react';
import {Button, TextField} from '@mui/material';
import {createUser} from './registrationApi';
import {Account} from '../model/common';
import {CustomError} from "../model/CustomError";
import {useNavigate} from 'react-router-dom';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, {AlertProps} from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export function Inscription() {
    const [error, setError] = useState({} as CustomError);
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = React.useState(false);



    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);

        const password = data.get("password") as string;
        const confirmPassword = data.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            setError(new CustomError("Les mots de passe ne correspondent pas."));
            handleClick();
            return;
        }

        const account: Account = {
            username: data.get("username") as string,
            email: data.get("email") as string,
            password: password,
        };

        createUser(account, (result: boolean) => {
            console.log(account);
            if (result === true) {
                form.reset();
                setError(new CustomError(""));
                navigate('/login');
            } else {
                console.error("La création de l'utilisateur a échoué.");
            }
        }, (createAccountError: CustomError) => {
            console.log(createAccountError);
            handleClick();
            setError(createAccountError);
        });
    };
    const handleClick = () => {
        setOpenSnackbar(true);
    };

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSnackbar(false);
    };
    return (
        <>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh',marginLeft:'600px',width: '400px'}} >
                <Box
                    component="form"
                    sx={{
                        "& > :not(style)": { m: 1, width: "190%" },
                    }}
                    noValidate
                    autoComplete="off"
                    onSubmit={handleSubmit} // Ajoutez cette ligne pour gérer la soumission
                >
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        <Alert severity="info">Créer un compte </Alert>
                    </Stack>
                    <TextField
                        name="username"
                        label="username"
                        placeholder="Saisissez votre nom utilisateur"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="email"
                        label="E-mail"
                        type="email"
                        placeholder="Entrez votre adresse e-mail"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="password"
                        label="Mot de passe"
                        type="password"
                        placeholder="Entrez votre mot de passe"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        required
                    />
                    <TextField
                        name="confirmPassword"
                        label="Confirmer le mot de passe"
                        type="password"
                        placeholder="Confirmez votre mot de passe"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        required
                    />
                    <Button type="submit" variant="contained" color="primary" >
                        Créer un compte
                    </Button>
                </Box>

            </Box>

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

