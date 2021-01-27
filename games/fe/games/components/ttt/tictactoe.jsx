import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Square from "./square";
import Game from "./game";
import styles from "./tictactoe.css";

class TicTacToe extends Component {
  state = {
    game: new Game(),
    imageURL: "https://picsum.photos/100",
  };

  startOver = () => {
    this.setState({
      game: new Game(),
    });
  };

  renderSquare(i) {
    let dispVal = this.state.game.squares[i];
    dispVal = dispVal ? dispVal : "";
    return <Square value={dispVal} onClick={() => this.clickHandler(i)} />;
  }

  clickHandler(i) {
    // const game = { ...this.state.gane };
    if (this.state.game.getWinner()) {
      console.log(`Disabling clickHandler as we have a winners `);
      return;
    }
    this.state.game.setAction("X", i);
    const action = this.state.game.getAIAction();
    console.log(`AI recommends: ${action}`);
    this.state.game.setAction("O", action);
    this.setState({
      game: this.state.game,
    });
  }

  renderWinnerScreen(winner) {
    return (
      <div className="app">
        <img src={this.state.imageURL} />
        <div id="winner">{winner} won!</div>
        <Button onClick={this.startOver}>Start Over</Button>
      </div>
    );
  }

  render() {
    let winner;
    if (this.state.game.isOver()) {
      winner = "Nobody";
    } else if (this.state.game.getWinner()) {
      winner = this.state.game.getWinner();
    }
    if (winner) {
      return this.renderWinnerScreen(winner);
    }
    return this.renderGameScreen();
  }

  renderGameScreen() {
    return (
      <div className="App">
        <div>
          <h1>Tic Tac Toe</h1>
          <h4>
            <p className="Status">{status}</p>
          </h4>
        </div>
        <div className="BoardSquare">
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
      </div>
    );
  }
}

export default TicTacToe;
