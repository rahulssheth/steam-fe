import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import { CreateAccountForm } from './AccountCreation.js';
import { LoginForm } from './Login.js';
import { App } from "./App.js";
 
function getUsers(){
  axios.get("http://localhost:8000/users/users").then(response => console.log(response));
}

const determineTicTacToeWinner = (grid, number) => {
  const row = Math.floor(number/3);
  const column = number%3
  let rowTrue = true;
  let columnTrue = true;
  let diagTrue = false;
  let antiTrue = false;
  const letter = grid[row][column]

  for(let i = 0; i < 3; i++){
    if(grid[row][i] !== letter){
      rowTrue = false;
      break
    }
  }
  for(let i = 0; i < 3; i++){
    if(grid[i][column] !== letter){
      columnTrue = false;
      break
    }
  }
  if(number%2 === 0){
    diagTrue = true;
    antiTrue = true;
    for(let i = 0; i < 3; i++){
      if(grid[i][i] !== letter){
        diagTrue = false
        break
      }
    }
    for(let i = 0; i < 3; i++){
      if(grid[i][2-i] !== letter){
        antiTrue = false
        break
      }
    }
  }

  if(rowTrue || columnTrue || diagTrue || antiTrue){
    return letter;
  }
  return "N";

}
/*
let reed = [["x","x","x"],["-","-","-"],["-","-","-"]];
let seed = [["X","-","-"],["X","-","-"],["X","-","-"]];
let deed = [["O","x","x"],["-","O","-"],["-","-","O"]];
let need = [["x","x","O"],["-","-","-"],["-","-","-"]];
let weed = [["-","x","O"],["-","O","-"],["O","-","-"]];
console.log(determineTicTacToeWinner(reed, 0) === "x");
console.log(determineTicTacToeWinner(seed, 0) === "X");
console.log(determineTicTacToeWinner(deed, 0) === "O");
console.log(determineTicTacToeWinner(need, 0) === "N");
console.log(determineTicTacToeWinner(weed, 2) === "O");
*/
class Square extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      number: props.number,
    };
  }
    render() {
      return (
        <button className="square" onClick={() => {
          if(this.state.number !== "X" && this.state.number !== "O"){
            this.setState({number: this.props.nextLetter});
            this.props.updateNextLetter(this.state.number);
          }

        }}>
          {this.state.number}
        </button>
      );
    }
  }
  
  class Board extends React.Component {
    constructor(props){
      super(props)
      getUsers();
      this.state = {
        nextLetter: "X",
        turns: 0,
        grid: [["-", "-", "-"], ["-","-","-"], ["-","-","-"]],
        winningLetter: "-",
      };
      this.updateNextLetter = this.updateNextLetter.bind(this)
    }
    updateNextLetter(number){
      let newGrid = this.state.grid;
      newGrid[Math.floor(number/3)][number % 3] = this.state.nextLetter
      this.setState(() => ({ grid: newGrid }))
      if(determineTicTacToeWinner(this.state.grid, number) === this.state.nextLetter){
        this.setState(() => ({winningLetter: this.state.nextLetter}))
      }
      this.setState((prevState) => ({ nextLetter: prevState.nextLetter === 'O' ? 'X' : 'O', turns: prevState.turns + 1}))
      console.log(this.state.nextLetter)
    }
    renderSquare(i) {
      return <Square number={i} updateNextLetter={this.updateNextLetter} nextLetter={this.state.nextLetter}/>
    }
    render() {
      const status = this.state.turns === 9 ? "Draw (Probably)" : `Next player: ${this.state.nextLetter}`;
    
      return (
        <div>
          <div className="status">{this.state.winningLetter !== '-' ? this.state.winningLetter : status}</div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
  