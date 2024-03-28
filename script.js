function Gameboard() {
  const rows = 3;
  const columns = 3;
  board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  dropMark = (row, column, player) => {
    const availableCells = board
      .filter((row) => row[column].getValue() === 0)
      .map((row) => row[column]);
    if (board[row][column].getValue() !== "") {
      alert("Cell is already marked!");
      return;
    }

    board[row][column].addMark(player);
  };

  const printBoard = () => {
    board.map((row) => row.map((cell) => cell.getValue()));
  };

  return { getBoard, dropMark, printBoard };
}

function Cell() {
  let value = "";

  const addMark = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addMark, getValue };
}

function GameController(playerOneName = "P1", playerTwoName = "P2") {
  const board = Gameboard();

  const players = [
    { name: playerOneName, mark: "x" },
    { name: playerTwoName, mark: "o" },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const checkWin = (playerMark) => {
    const boardValues = board
      .getBoard()
      .map((row) => row.map((cell) => cell.getValue()));

    for (let i = 0; i < 3; i++) {
      if (boardValues[i].every((val) => val === playerMark)) return true;
    }

    for (let i = 0; i < 3; i++) {
      if (boardValues.every((row) => row[i] === playerMark)) return true;
    }

    if (
      (boardValues[0][0] === playerMark &&
        boardValues[1][1] === playerMark &&
        boardValues[2][2] === playerMark) ||
      (boardValues[0][2] === playerMark &&
        boardValues[1][1] === playerMark &&
        boardValues[2][0] === playerMark)
    ) {
      return true;
    }

    return false;
  };

  const checkTie = () => {
    const boardValues = board
      .getBoard()
      .map((row) => row.map((cell) => cell.getValue()))
      .flat();
    return !boardValues.includes("");
  };

  const playRound = (row, column) => {
    console.log(
      `Dropping ${
        getActivePlayer().name
      }'s mark into row ${row} and column ${column}...`
    );

    board.dropMark(row, column, getActivePlayer().mark);

    if (checkWin(getActivePlayer().mark)) {
      alert(`${getActivePlayer().name} wins!`);
      return;
    }

    if (checkTie()) {
      alert("It's a tie!");
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return { playRound, getActivePlayer, getBoard: board.getBoard };
}

function ScreenController() {
  let game = null;
  const player1Input = document.getElementById("player1");
  const player2Input = document.getElementById("player2");
  const startGameButton = document.getElementById("start-game");
  const gameResultsDisplay = document.getElementById("game-results");
  const playerTurnDiv = document.querySelector(".turn");
  const boardDiv = document.querySelector(".board");

  function startGame() {
    const player1Name = player1Input.value || "Player 1";
    const player2Name = player2Input.value || "Player 2";
    game = GameController(player1Name, player2Name);
    updateScreen();
  }
  startGameButton.addEventListener("click", startGame);

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex + 1;
        cellButton.dataset.column = columnIndex + 1;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      });
    });
  };

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    if (!selectedRow || !selectedColumn) return;

    game.playRound(selectedRow - 1, selectedColumn - 1);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen();
}

ScreenController();
