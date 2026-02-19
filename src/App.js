import { useState } from "react";

function Square({ value, onClick }) {
  return (
    <button
      className="square"
      onClick={onClick}
      style={{
        color: value === "X" ? "#4cc9f0" : value === "O" ? "#f72585" : "white",
      }}
    >
      {value}
    </button>
  );
}

function Board({ n, currentMove, board, onMove }) {
  const result = calculateWinner(n, board);
  const winner = result?.winner;
  const winningLine = result?.line;

  function handleClick(i) {
    if (board[i] || winner) return;

    const nextSquares = board.slice();
    nextSquares[i] = currentMove % 2 === 0 ? "X" : "O";

    onMove(nextSquares);
  }

  const status = winner
    ? `Winner: ${winner}`
    : `Next Player: ${currentMove % 2 === 0 ? "X" : "O"}`;

  return (
    <div className="board-wrapper">
      <div className="status">{status}</div>

      <div className="board">
        {board.map((_, index) => (
          <Square
            key={index}
            value={board[index]}
            onClick={() => handleClick(index)}
          />
        ))}

        {winningLine && (
          <div
            className={`strike strike-${getStrikeType(n, winningLine)}`}
          ></div>
        )}
      </div>
    </div>
  );
}

export default function Game() {
  const n = 3;
  const [history, setHistory] = useState([Array(n * n).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setCurrentMove(currentMove + 1);
  }

  function jumpTo(move) {
    const nextHistory = history.slice(0, move + 1);
    setHistory(nextHistory);
    setCurrentMove(move);
  }

  const moves = history.map((_, move) => (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>
        {move > 0 ? `Go to move #${move}` : "Go to game start"}
      </button>
    </li>
  ));

  return (
    <div className="game">
      <Board
        n={n}
        currentMove={currentMove}
        board={currentSquares}
        onMove={handlePlay}
      />

      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

/* ================= WIN LOGIC ================= */

function calculateWinner(n, squares) {
  const lines = [];

  // Rows
  for (let r = 0; r < n; r++) {
    lines.push([...Array(n)].map((_, i) => r * n + i));
  }

  // Columns
  for (let c = 0; c < n; c++) {
    lines.push([...Array(n)].map((_, i) => i * n + c));
  }

  // Diagonal \
  lines.push([...Array(n)].map((_, i) => i * (n + 1)));

  // Diagonal /
  lines.push([...Array(n)].map((_, i) => (i + 1) * (n - 1)));

  for (let line of lines) {
    const first = squares[line[0]];
    if (first && line.every((i) => squares[i] === first)) {
      return { winner: first, line };
    }
  }

  return null;
}

function getStrikeType(n, line) {
  const row0 = Math.floor(line[0] / n);
  const row1 = Math.floor(line[1] / n);

  if (row0 === row1) return `row-${row0}`;
  if (line[0] % n === line[1] % n) return `col-${line[0] % n}`;
  if (line[0] === 0) return "diag-main";
  return "diag-anti";
}
