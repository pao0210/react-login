import React, { useEffect } from 'react';
import Axios from 'axios';
import Button from '@mui/material/Button';

function Home() {
    const temp = localStorage.getItem('user');
    const user = JSON.parse(temp);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location = '/login';
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': 'Bearer ' + token 
        };
        Axios.post('http://localhost:3001/api/authentication', {}, { headers: headers }).then((response) => {
            if (response.data.status === 'ok'){
                console.log('success');
              } else {
                console.log('fail');
                localStorage.removeItem('token');
                window.location = '/login';
              }
        });
    }, [])
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h1 className="text-center">Number of times logged</h1>
                    <hr />
                    <h2 className="text-center">{user.clogin}</h2>
                    <Button variant="contained" onClick={handleLogout}>Logout</Button>
                </div>
            </div>
        </div>
    );
}

export default Home;
