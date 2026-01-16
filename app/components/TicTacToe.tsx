'use client';

import { useState, useCallback, useEffect } from 'react';

type Player = 'X' | 'O' | null;
type Board = Player[];
type GameStatus = 'playing' | 'won' | 'draw';

const BOARD_SIZE = 9;

const WIN_CONDITIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(BOARD_SIZE).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [scores, setScores] = useState({ player: 0, bot: 0, draws: 0 });

  // Check for a win condition
  const checkWin = useCallback((player: Player, currentBoard: Board): number[] | null => {
    for (const condition of WIN_CONDITIONS) {
      if (
        currentBoard[condition[0]] === player &&
        currentBoard[condition[1]] === player &&
        currentBoard[condition[2]] === player
      ) {
        return condition;
      }
    }
    return null;
  }, []);

  // Check for draw
  const checkDraw = useCallback((currentBoard: Board): boolean => {
    return currentBoard.every(cell => cell !== null);
  }, []);

  // Bot player logic - adapted from provided code
  const botPlayer = useCallback((currentBoard: Board): number => {
    // First, check if bot can win
    for (const condition of WIN_CONDITIONS) {
      let oCount = 0;
      let emptyIndex = -1;

      for (const idx of condition) {
        if (currentBoard[idx] === 'O') {
          oCount++;
        } else if (currentBoard[idx] === null) {
          emptyIndex = idx;
        }
      }

      if (oCount === 2 && emptyIndex !== -1) {
        return emptyIndex; // Win the game!
      }
    }

    // Middle move priority
    if (currentBoard[4] === null) {
      return 4;
    }

    // Block player's winning move
    const blockableMoves: number[] = [];
    for (const condition of WIN_CONDITIONS) {
      let xCount = 0;
      let emptyIndex = -1;

      for (const idx of condition) {
        if (currentBoard[idx] === 'X') {
          xCount++;
        } else if (currentBoard[idx] === null) {
          emptyIndex = idx;
        }
      }

      if (xCount === 2 && emptyIndex !== -1) {
        return emptyIndex; // Block winning move
      }

      if (xCount === 1 && emptyIndex !== -1) {
        blockableMoves.push(emptyIndex);
      }
    }

    // Return the first valid blockable move
    if (blockableMoves.length > 0) {
      return blockableMoves[0];
    }

    // Find any available move
    for (let i = 0; i < BOARD_SIZE; i++) {
      if (currentBoard[i] === null) {
        return i;
      }
    }

    return -1;
  }, []);

  // Handle bot's turn
  useEffect(() => {
    if (!isPlayerTurn && gameStatus === 'playing') {
      const timer = setTimeout(() => {
        const move = botPlayer(board);
        if (move !== -1) {
          const newBoard = [...board];
          newBoard[move] = 'O';
          setBoard(newBoard);

          const winLine = checkWin('O', newBoard);
          if (winLine) {
            setWinningLine(winLine);
            setWinner('O');
            setGameStatus('won');
            setScores(prev => ({ ...prev, bot: prev.bot + 1 }));
          } else if (checkDraw(newBoard)) {
            setGameStatus('draw');
            setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
          } else {
            setIsPlayerTurn(true);
          }
        }
      }, 500); // Small delay for better UX

      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, gameStatus, board, botPlayer, checkWin, checkDraw]);

  // Handle player's move
  const handleCellClick = (index: number) => {
    if (board[index] !== null || !isPlayerTurn || gameStatus !== 'playing') {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const winLine = checkWin('X', newBoard);
    if (winLine) {
      setWinningLine(winLine);
      setWinner('X');
      setGameStatus('won');
      setScores(prev => ({ ...prev, player: prev.player + 1 }));
    } else if (checkDraw(newBoard)) {
      setGameStatus('draw');
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    } else {
      setIsPlayerTurn(false);
    }
  };

  // Reset the game
  const resetGame = () => {
    setBoard(Array(BOARD_SIZE).fill(null));
    setIsPlayerTurn(true);
    setGameStatus('playing');
    setWinner(null);
    setWinningLine(null);
  };

  // Get status message
  const getStatusMessage = () => {
    if (gameStatus === 'won') {
      return winner === 'X' ? '🎉 You Win!' : '🤖 Bot Wins!';
    }
    if (gameStatus === 'draw') {
      return "🤝 It's a Draw!";
    }
    return isPlayerTurn ? 'Your Turn (X)' : 'Bot Thinking...';
  };

  return (
    <div className="game-container">
      <h1 className="game-title">Tic-Tac-Toe</h1>
      
      <div className="scoreboard">
        <div className="score-item player">
          <span className="score-label">You (X)</span>
          <span className="score-value">{scores.player}</span>
        </div>
        <div className="score-item draws">
          <span className="score-label">Draws</span>
          <span className="score-value">{scores.draws}</span>
        </div>
        <div className="score-item bot">
          <span className="score-label">Bot (O)</span>
          <span className="score-value">{scores.bot}</span>
        </div>
      </div>

      <div className={`status-message ${gameStatus !== 'playing' ? 'game-over' : ''}`}>
        {getStatusMessage()}
      </div>

      <div className="board">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`cell ${cell ? 'filled' : ''} ${cell === 'X' ? 'x' : ''} ${cell === 'O' ? 'o' : ''} ${winningLine?.includes(index) ? 'winning' : ''}`}
            onClick={() => handleCellClick(index)}
            disabled={cell !== null || !isPlayerTurn || gameStatus !== 'playing'}
          >
            {cell && (
              <span className="cell-content">
                {cell === 'X' ? '✕' : '○'}
              </span>
            )}
          </button>
        ))}
      </div>

      {gameStatus !== 'playing' && (
        <button className="reset-button" onClick={resetGame}>
          Play Again
        </button>
      )}

      <div className="instructions">
        <p>Click any empty cell to place your X</p>
      </div>
    </div>
  );
}
