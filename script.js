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
    if (!availableCells.length) {
      alert("Cell is not empty!");
      return;
    }

    board[row][column].addMark(player);
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    console.log(boardWithCellValues);
  };

  return { getBoard, dropMark, printBoard };
}

function Cell() {
  let value = 0;

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
    return !boardValues.includes(0);
  };

  const playRound = (row, column) => {
    console.log(
      `Dropping ${
        getActivePlayer().name
      }'s mark into row ${row} and column ${column}...`
    );

    board.dropMark(row, column, getActivePlayer().mark);

    if (checkWin(getActivePlayer().mark)) {
      console.log(`${getActivePlayer().name} wins!`);
      return;
    }

    if (checkTie()) {
      console.log("It's a tie!");
      return;
    }

    switchPlayerTurn();
    printNewRound();
  };

  printNewRound();

  return { playRound, getActivePlayer };
}

const game = GameController();
