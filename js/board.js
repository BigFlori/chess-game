import Piece from "./piece.js";

const gameBoard = document.getElementById("game-board");
const checkInfo = document.getElementById("check-info");
const turnText = document.getElementById("turn-text");
let turn = "none";
let checkmate = false;

document.getElementById("new-game").addEventListener("click", () => resetGame());

export const board = [
  // A  B  C  D  E  F  G  H
  [0, 0, 0, 0, 0, 0, 0, 0], // row 0
  [0, 0, 0, 0, 0, 0, 0, 0], // row 1
  [0, 0, 0, 0, 0, 0, 0, 0], // row 2
  [0, 0, 0, 0, 0, 0, 0, 0], // row 3
  [0, 0, 0, 0, 0, 0, 0, 0], // row 4
  [0, 0, 0, 0, 0, 0, 0, 0], // row 5
  [0, 0, 0, 0, 0, 0, 0, 0], // row 6
  [0, 0, 0, 0, 0, 0, 0, 0], // row 7
];

export const initializeBoard = (board) => {
  // Parasztok felállítása
  for (let i = 0; i < 8; i++) {
    board[1][i] = new Piece("pawn", "black");
    board[6][i] = new Piece("pawn", "white");
  }

  // Bástyák felállítása
  board[0][0] = new Piece("rook", "black");
  board[0][7] = new Piece("rook", "black");
  board[7][0] = new Piece("rook", "white");
  board[7][7] = new Piece("rook", "white");

  // Lovak felállítása
  board[0][1] = new Piece("knight", "black");
  board[0][6] = new Piece("knight", "black");
  board[7][1] = new Piece("knight", "white");
  board[7][6] = new Piece("knight", "white");

  // Futók felállítása
  board[0][2] = new Piece("bishop", "black");
  board[0][5] = new Piece("bishop", "black");
  board[7][2] = new Piece("bishop", "white");
  board[7][5] = new Piece("bishop", "white");

  // Királynők felállítása
  board[0][3] = new Piece("queen", "black");
  board[7][3] = new Piece("queen", "white");

  // Királyok felállítása
  board[0][4] = new Piece("king", "black");
  board[7][4] = new Piece("king", "white");
};

//A board matrix alapján visszaadja a bábut, ami a megadott id-jű divben van
const getBoardPieceById = (id) => {
  const [row, col] = id.split("-");
  return board[row][col];
};

// A board matrix alapján visszaadja a megadott koordinátájú divet
const getBoardDivByCoords = (row, col) => {
  return document.getElementById(`${row}-${col}`);
};

//Köröket rajzol a lehetséges lépésekre
const addCircle = (cellDiv) => {
  const circle = document.createElement("span");
  circle.classList.add("circle");
  cellDiv.appendChild(circle);
};

//Köröket töröl a lehetséges lépésekről
const removeCircle = (cellDiv) => {
  const circle = cellDiv.querySelector(".circle");
  cellDiv.removeChild(circle);
};

//Megjelöli a lehetséges lépéseket, ha a bábu kijelölve van
const showAvailableMoves = (fromCellDiv, show) => {
  const selectedPiece = getBoardPieceById(fromCellDiv.id);

  if (!selectedPiece) {
    return;
  }

  const availableMoves = selectedPiece.getAvailableMovesDiv(board, fromCellDiv);
  availableMoves.forEach((move) => {
    const [row, col] = move;
    const moveableCellDiv = document.getElementById(`${row}-${col}`);
    if (show) {
      moveableCellDiv.classList.add("available");
      addCircle(moveableCellDiv);
    } else {
      moveableCellDiv.classList.remove("available");
      removeCircle(moveableCellDiv);
    }
  });
};

//Lépésnél fut le, átmozgatja vizuálisan a bábut (egyik divből másikba az svg-t)
const gameboardMovePiece = (fromCellDiv, toCellDiv) => {
  fromCellDiv.classList.remove("selected");
  const availableMoves = gameBoard.querySelectorAll(".available");
  availableMoves.forEach((availableMoveDiv) => {
    availableMoveDiv.classList.remove("available");
    removeCircle(availableMoveDiv);
  });
  toCellDiv.innerHTML = fromCellDiv.innerHTML;
  fromCellDiv.innerHTML = "";
};

//A pálya összes mezőjére kattintásakor lefut, ha a mező available, akkor a bábu átmozgatása
//Ha a mezőn nincs bábu, akkor nem történik semmi
//Ha a mezőn van bábu, akkor a bábu kijelölése
//Ha a kijelölt bábu mezőjére kattintunk, akkor a kijelölés törlődik

const gameboardCellClick = (clickedCellDiv) => {
  if (checkmate) {
    return;
  }
  if (clickedCellDiv.classList.contains("available")) {
    // Van kijelölt bábu, és a kattintott mező available
    // Tehát lépés

    // Ha korábban volt check, akkor töröljük
    const checkedCellDiv = gameBoard.querySelector(".check");
    if (checkedCellDiv) {
      checkedCellDiv.classList.remove("check");
      checkInfo.innerHTML = "";
    }

    const selectedPieceDiv = gameBoard.querySelector(".selected");
    const selectedPiece = getBoardPieceById(selectedPieceDiv.id);

    selectedPiece.move(board, selectedPieceDiv, clickedCellDiv);
    gameboardMovePiece(selectedPieceDiv, clickedCellDiv);

    setTurn(turn === "white" ? "black" : "white");
    if (isInCheck(board, turn)) {
      const kingCoords = findKing(board, turn);
      const king = board[kingCoords[0]][kingCoords[1]];
      if (king.isCheckmate(board, turn)) {
        checkmate = true;
        setTurn("end");
        getBoardDivByCoords(kingCoords[0], kingCoords[1]).classList.add("checkmate");
        checkInfo.innerHTML = "SAKK-MATT!";
      } else {
        getBoardDivByCoords(kingCoords[0], kingCoords[1]).classList.add("check");
        checkInfo.innerHTML = "Sakk!";
      }
    }
    return;
  }
  if (!getBoardPieceById(clickedCellDiv.id)) {
    // Üres cella, nem történik semmi
    return;
  }

  const selectedCellDiv = gameBoard.querySelector(".selected");

  if (clickedCellDiv === selectedCellDiv) {
    // Kijelölt bábu mezőjére kattintottunk, elvetjük a kijelölést
    clickedCellDiv.classList.remove("selected");
    showAvailableMoves(clickedCellDiv, false);
    return;
  }

  if (selectedCellDiv) {
    // Másik bábut választottunk ki, elvetjük a kijelölést
    selectedCellDiv.classList.remove("selected");
    showAvailableMoves(selectedCellDiv, false);
  }
  // Kijelöljük a másik bábut, ha az a lépés jön
  const selectedPiece = getBoardPieceById(clickedCellDiv.id);
  if (selectedPiece.color !== turn) {
    return;
  }

  clickedCellDiv.classList.add("selected");
  showAvailableMoves(clickedCellDiv, true);
};

//A pálya kirajzolása, SVG-k betöltése, a board matrix alapján
export const generateGameboard = (board) => {
  gameBoard.innerHTML = "";

  board.forEach((row, i) => {
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("row");

    row.forEach((cell, j) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.setAttribute("id", `${i}-${j}`);
      cellDiv.addEventListener("click", () => {
        gameboardCellClick(cellDiv);
      });
      cellDiv.innerHTML = "";
      if (cell) {
        cell.loadSvg().then((svgDoc) => {
          cellDiv.appendChild(svgDoc);
        });
      }
      rowDiv.appendChild(cellDiv);
    });

    gameBoard.appendChild(rowDiv);
  });
};

// A királyok koordinátáinak meghatározása
export const findKing = (board, color) => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      const piece = board[row][col];
      if (piece && piece.type === "king" && piece.color === color) {
        return [row, col];
      }
    }
  }
};

// ellenőrzi, hogy a megadott színű király sakkban van-e
export const isInCheck = (board, color) => {
  const [kingRow, kingCol] = findKing(board, color);

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      const piece = board[row][col];
      if (piece && piece.color !== color) {
        if (piece.type === "king") {
          if (distanceBetweenKings(board) > 1) {
            continue;
          } else {
            return true;
          }
        }
        const availableMoves = piece.getAvailableMoves(board, row, col);
        if (availableMoves.some(([r, c]) => r === kingRow && c === kingCol)) {
          return true;
        }
      }
    }
  }
  return false;
};

// A két király közötti távolság meghatározása
export const distanceBetweenKings = (board) => {
  const [whiteKingRow, whiteKingCol] = findKing(board, "white");
  const [blackKingRow, blackKingCol] = findKing(board, "black");
  const rowDiff = Math.abs(whiteKingRow - blackKingRow);
  const colDiff = Math.abs(whiteKingCol - blackKingCol);
  return Math.max(rowDiff, colDiff);
};

const setTurn = (color) => {
  turn = color;
  switch(turn) {
    case "white":
      turnText.innerHTML = "Fehér játékos következik!";
      return;
    case "black":
      turnText.innerHTML = "Fekete játékos következik!";
      return;
    case "end":
      turnText.innerHTML = "Vége a játéknak!";
      return;
    default:
      turnText.innerHTML = "Nincs játék...";
      return;
  }
};

const resetGame = () => {
  board.forEach((row, i) => {
    row.forEach((cell, j) => {
      board[i][j] = 0;
    });
  });
  initializeBoard(board);
  generateGameboard(board);
  setTurn("white");
  checkInfo.innerHTML = "";
  checkmate = false;
}

const startGame = () => {
  console.log("Starting game...");
  initializeBoard(board);
  generateGameboard(board);
  setTurn("white");
}

startGame();
