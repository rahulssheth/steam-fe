import React from 'react';
import axios from 'axios';

    const handleSubmit = event => {
      const name = event.target[0].value
      const email = event.target[2].value
      const password = event.target[1].value
      console.log(event)
      event.preventDefault()
      alert(`Your name is ${name}. Your email is ${email}. Your password is ${password}`)
      const postParams = {
        name: name,
        email: email,
        password: password,
      }
      axios.post("http://localhost:8000/users/users/", postParams).then(response => console.log(response))
    }


export class CreateAccountForm extends React.Component {
    constructor(props){
      console.log(localStorage.getItem("rememberMe"))
      super(props)
    }
    
    render() {
    
      return (
        <div>
          <form onSubmit={handleSubmit}>
          <label for="name">Name:</label><br></br>
          <input type="text" id="name" name="name" /><br></br>
          <label for="password">Password:</label><br></br>
          <input type="password" id="password" name="password" /><br></br>
          <label for="email">Email:</label><br></br>
          <input type="text" id="email" name="email" /><br></br>
          <input type="submit" value="Create Account"></input>
          </form>
        </div>
      );
    }
  }