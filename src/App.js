import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";
  import { CreateAccountForm } from './AccountCreation.js';
  import { LoginForm } from './Login.js';

export const App = () => {
    return (
        <Router>
            <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/createaccount" element={<CreateAccountForm />} />
            </Routes>
        </Router>
    )
}