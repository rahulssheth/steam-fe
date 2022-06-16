import React from 'react';
import ReactDOM from 'react-dom';
import './TicTacToe.css';
import axios from 'axios';
import {useParams} from 'react-router-dom';
// Doesn't check for winner when refreshing
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

class Square extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      number: props.number,
      value: props.value,
    };
  }
    render() {
      return (
        <button className="square" onClick={() => {
          console.log(this.props)
          if ((this.props.match.players[0] === parseInt(this.props.user_id) && this.props.nextLetter !== 'X') || (this.props.match.players[1] === parseInt(this.props.user_id) && this.props.nextLetter !== 'O')) {
            alert('You should not be playing this letter.')
          } else if(this.props.value !== "X" && this.props.value !== "O" && this.props.is_match_in_progress){
            const move = {
              player: this.props.user_id,
              value: this.props.nextLetter,
              position: this.state.number
            }
            updateMatch(this.props.match, this.props.user_id, move)
            this.setState({number: this.props.nextLetter, value: this.props.nextLetter});
            this.props.updateNextLetter?.(this.state.number);
            this.props.updateMovesArray(move);
          }

        }}>
          {this.props.value}
        </button>
      );
    }
  }
  
  class Board extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        nextLetter: "X",
        turns: 0,
        grid: [["-", "-", "-"], ["-","-","-"], ["-","-","-"]],
        winningLetter: "-",
        match: {},
        movesArray: [0, 1, 2, 3, 4, 5, 6, 7, 8]
      };
      this.user_id = localStorage.getItem("user_id")
      this.updateNextLetter = this.updateNextLetter.bind(this)
      this.fetchMatch = this.fetchMatch.bind(this)
      this.createMovesArray = this.createMovesArray.bind(this)
      this.updateMovesArray = this.updateMovesArray.bind(this)
    }
    componentDidMount(){
      this.fetchMatch(this.props.id, this.user_id)
    }
    fetchMatch(id, user_id){
      axios.get(`http://localhost:8000/users/matches/${id}`, { params: { user_id: user_id } }).then(response => {
        this.setState(() => ({ match: response.data }))
        this.createMovesArray(response.data.data?.moves ?? [])
      });
    }
    updateNextLetter(number){
        let newGrid = this.state.grid;
        newGrid[Math.floor(number/3)][number % 3] = this.state.nextLetter
        this.setState(() => ({ grid: newGrid }))

        if(determineTicTacToeWinner(this.state.grid, number) === this.state.nextLetter){
          this.setState(() => ({winningLetter: this.state.nextLetter}))
          completeMatch(this.state.match)
        }
        this.setState((prevState) => ({ nextLetter: prevState.nextLetter === 'O' ? 'X' : 'O', turns: prevState.turns + 1}))
        console.log(this.state.nextLetter)
    }
    updateMovesArray(move){
      this.state.movesArray[move.position] = move.value
      this.setState(() => ({movesArray: this.state.movesArray}))
      if(!this.state.movesArray.some((val) => Number.isInteger(val))){
        completeMatch(this.state.match)
      }
    }
    renderSquare(i) {
      console.log(this.state.movesArray)
      return <Square
        number={i} value={this.state.movesArray[i]} 
        updateNextLetter={this.updateNextLetter} 
        nextLetter={this.state.nextLetter} user_id={this.user_id} match={this.state.match}
        updateMovesArray={this.updateMovesArray}
        is_match_in_progress={this.state.match.is_match_in_progress}
      />
    }
    createMovesArray(moves){
      /* First: create array of 9 elements prefilled 0-8 
      Second: Iterate over moves list from api and set array element based on value
      Third: Set moves array to state  */
      const moves_array = this.state.movesArray
      moves?.forEach((move) => {
        moves_array[move.position] = move.value
        const row = Math.floor(move.position/3);
        const column = move.position%3
        this.state.grid[row][column] = move.value
      })
      console.log(moves)
      this.setState({
        movesArray: moves_array,
        grid: this.state.grid,
        nextLetter: moves[moves.length-1]?.value === 'X' ? 'O' : 'X'
      })
    }
    render() {
      let status = this.state.turns === 9 ? "Draw (Probably)" : `Next player: ${this.state.nextLetter}`;
      status = this.state.match.is_match_in_progress ? status: "Game Over";
      console.log(status)
      console.log(this.state.match)
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


  function updateMatch(match, user_id, move){
    const data = match.data ?? {}
    const moves = data["moves"] ?? []
    moves.push(move)
    data["moves"] = moves
    match.data = data
    axios.put(`http://localhost:8000/users/matches/${match.id}/`, match)
  }

  function completeMatch(match){
    match.is_match_in_progress = false;
    axios.put(`http://localhost:8000/users/matches/${match.id}/`, match)
    console.log("fin")
  }

  export const Game = () => {
    const {id} = useParams()
    const user_id = localStorage.getItem("user_id")
    return (
      <div className="game">
        <div className="game-board">
          <h1>
            {id}
          </h1>
          <Board id={id}/>
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }

  