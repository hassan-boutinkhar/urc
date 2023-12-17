import * as React from 'react';
import {useEffect, useState} from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import EmailIcon from '@mui/icons-material/Email';
import GroupsIcon from '@mui/icons-material/Groups';
import LoginIcon from '@mui/icons-material/Login';
import {Route, Routes, useNavigate} from 'react-router-dom';
import {LoginPage} from '../login/LoginPage';
import {Messages} from './messages';
import {Rooms} from './rooms';
import {logoutUser} from '../user/loginApi';

export default function UserConnectedPage() {
    const [value, setValue] = useState('Messages');
    const [currentComponent, setCurrentComponent] = useState(<Messages />);
    const navigate = useNavigate();

    useEffect(() => {
        // navigate('/message');
    }, []);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
        // Redirige vers /rooms si le bouton "Messages" est cliqué
        switch (newValue) {
            case 'Messages':
                //navigate('/message');
                setCurrentComponent(<Messages />);
                break;
            case 'Salons':
                //navigate('/rooms');
                setCurrentComponent(<Rooms />);
                break;
            case 'Se déconnecter':
                logoutUser();
                navigate('/login');
                break;
            default:
                break;
        }
    };

    return (
        <>
            <BottomNavigation sx={{ width: '100%',marginBottom:'0.5%' }} value={value} onChange={handleChange}>
                <BottomNavigationAction label="Messages" value="Messages" icon={<EmailIcon />} />
                <BottomNavigationAction label="Salons" value="Salons" icon={<GroupsIcon />} />
                <BottomNavigationAction label="Se déconnecter" value="Se déconnecter" icon={<LoginIcon />} />
            </BottomNavigation>

            {currentComponent}

            <Routes>
                <Route path="/message" element={<Messages />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </>
    );
}
