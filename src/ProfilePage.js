import React from 'react';
import axios from 'axios';
import react from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export const ProfilePage = () => {
    const [user, setUser] = React.useState()
    const [latestGameLink, setLatestGameLink] = React.useState()
    const id = localStorage.getItem("user_id")
    React.useEffect(() => {
        fetchUser(id)
    }, [id])

    function handleSubmit(event){
        event.preventDefault()
        const data = new FormData(event.currentTarget);
        const postParams = {
            creator_id: localStorage.getItem("user_id"),
            opponent_email: data.get("opponent_email"),
            game_name: "Tic Tac Toe",
            data: {}
        }
        axios.post("http://localhost:8000/users/matches/", postParams).then((response) => {
            console.log(response)
            setLatestGameLink(`/tic-tac-toe/${response.data.id}`)
        }
        )
    }

    if(user){
        return (
            <>
                {"Hello " + user.name}
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="opponent_email"
                        label="Opponent Email Address"
                        name="opponent_email"
                        autoComplete="email"
                        autoFocus
                    />
                    <Button type="submit">
                        submit
                    </Button>
                </Box>
                <a href={latestGameLink}>
                    Go to game
                </a>
            </>
        )
    }
    return <a href="/sign-in">
        Go to login
    </a>
    
    function fetchUser(id){
        axios.get(`http://localhost:8000/users/users/${id}`).then(response => setUser(response.data));
    }
}