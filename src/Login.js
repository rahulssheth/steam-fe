import React from 'react';
import axios from 'axios';

    const handleSubmit = event => {
      const email = event.target[0].value
      const password = event.target[1].value
      console.log(event)
      event.preventDefault()
      const postParams = {
        email: email,
        password: password,
      }
      axios.post("http://localhost:8000/users/login", postParams).then(response => console.log(response))
    }



export class LoginForm extends React.Component {
    constructor(props){
      super(props)
    }
    
    render() {
    
      return (
        <div>
          <form onSubmit={handleSubmit}>
          <label for="email">Email:</label><br></br>
          <input type="text" id="email" name="email" /><br></br>              
          <label for="password">Password:</label><br></br>
          <input type="password" id="password" name="password" /><br></br>
          <input type="submit" value="Login"></input>
          </form>
        </div>
      );
    }
  }

