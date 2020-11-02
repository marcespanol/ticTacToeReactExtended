import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
     <button className={props.extraClass} onClick={props.onClick}>
        {props.value}
     </button>
  );
}

class Board extends React.Component {
 renderSquare(i) {
   let extraClassName = 'square';
   if (this.props.winnerSquares && this.props.winnerSquares.indexOf(i) > -1 )
   extraClassName = 'square highlighted';
                                                                                  
    return (
      <Square
        key={i}
        extraClass = {extraClassName}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderSquares(i) {
    let squares = [];
    for (let n = i; n < i + 3; n++) {
      squares.push(this.renderSquare(n));
    }
    return squares;
  }

  renderRows(i) {
    return <div className="board-row">{this.renderSquares(i)}</div>;
  }

  render() {
    return (
      <div>
        {this.renderRows(0)}
        {this.renderRows(3)}
        {this.renderRows(6)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      orderAsc: true,
    };
  }
  
  handleClick(i) {
    const locations = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
    ];
    
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: locations[i]
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
  
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }
  
  toggleAction() {
      this.setState({ orderAsc: !this.state.orderAsc, });
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerInfo = calculateWinner(current.squares);                
    const winner = winnerInfo ? winnerInfo[0] : winnerInfo;             
    const winnerSquares = winnerInfo ? winnerInfo.slice(1) : winnerInfo;
    
    let moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + history[move].location : 'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move == this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>
        </li>
      );
    });
    
    let status;
    if (winner) {
      if(winner === 'draw')
          status = 'Draw';
      else
          status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    
    if (this.state.orderAsc === false) {
      moves = moves.reverse();           
    } 
    const order = this.state.orderAsc ? 'descending' : 'ascending';
    let toggleButton = <button onClick={() => this.toggleAction() }>Order: {order}</button>
     
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winnerSquares={winnerSquares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{toggleButton}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [ squares[a], a, b, c ];
    }
  }
  
  for (let i=0; i < 9; i++) {
    if( squares[i] === null)
        return null;
  } 

  return ['draw', null];
}


