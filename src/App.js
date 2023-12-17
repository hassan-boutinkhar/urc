// App.tsx

import React from 'react';
import {Route, Routes} from 'react-router-dom';
import {LoginPage} from './login/LoginPage';
import {Inscription} from './user/inscription';
import Navbar from './Components/navbar';
import UserConnectedPage from "./Components/UserConnectedPage";

const App = () => {
    return (
        <>
            <Navbar />
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" index element={<LoginPage />} />
                    <Route path="/inscription" element={<Inscription />} />
                    <Route path="/userConnectedPage" element={<UserConnectedPage />} />
                </Routes>

        </>
    );
};

export default App;
