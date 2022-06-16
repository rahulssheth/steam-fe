import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";
  import SignUp from './SignUp.js';
  import SignIn from './SignIn.js';
  import { ProfilePage } from './ProfilePage.js';
  import {Game} from "./TicTacToe.js";

export const App = () => {
    return (
        <Router>
            <Routes>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/tic-tac-toe/:id" element={<Game/>}/>
            </Routes>
        </Router>
    )
}