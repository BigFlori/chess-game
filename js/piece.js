import SVGLoader from "./svgLoader.js";
import { isInCheck, findKing } from "./board.js";

class Piece {
  constructor(type, color) {
    this.color = color;
    this.type = type;
    this.hasMoved = false;
  }

  move(board, fromCellDiv, toCellDiv) {
    // Memóriában léptetés
    const [fromRow, fromCol] = fromCellDiv.id.split("-");
    const [toRow, toCol] = toCellDiv.id.split("-");
    board[toRow][toCol] = board[fromRow][fromCol];
    board[fromRow][fromCol] = 0;
    this.hasMoved = true;
  }

  getPawnMoves(board, row, col) {
    // Paraszt lépései
    const moves = [];
    const direction = this.color === "white" ? -1 : 1;
    const nextRow = row + direction;

    if (!board[nextRow]) {
      return moves;
    }

    if (board[nextRow][col] === 0) {
      moves.push([nextRow, col]);
      if (!this.hasMoved) {
        const nextNextRow = nextRow + direction;
        if (board[nextNextRow][col] === 0) {
          moves.push([nextNextRow, col]);
        }
      }
    }
    if (board[nextRow][col - 1] && board[nextRow][col - 1].color !== this.color) {
      moves.push([nextRow, col - 1]);
    }
    if (board[nextRow][col + 1] && board[nextRow][col + 1].color !== this.color) {
      moves.push([nextRow, col + 1]);
    }
    return moves;
  }

  getRookMoves(board, [row, col]) {
    // Bástya lépései
    const moves = [];
    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    directions.forEach((direction) => {
      const [rowDir, colDir] = direction;
      let nextRow = row + rowDir;
      let nextCol = col + colDir;
      while (board[nextRow] && board[nextRow][nextCol] === 0) {
        moves.push([nextRow, nextCol]);
        nextRow += rowDir;
        nextCol += colDir;
      }
      if (board[nextRow] && board[nextRow][nextCol]) {
        if (board[nextRow] && board[nextRow][nextCol].color !== this.color) {
          moves.push([nextRow, nextCol]);
        }
      }
    });
    return moves;
  }

  getKnightMoves(board, [row, col]) {
    // Ló lépései
    const moves = [];
    const directions = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];
    directions.forEach((direction) => {
      const [rowDir, colDir] = direction;
      const nextRow = row + rowDir;
      const nextCol = col + colDir;

      if (board[nextRow] && board[nextRow][nextCol]) {
        if (board[nextRow][nextCol].color !== this.color) {
          moves.push([nextRow, nextCol]);
        }
      }

      if (board[nextRow] && board[nextRow][nextCol] === 0) {
        moves.push([nextRow, nextCol]);
      }
    });
    return moves;
  }

  getBishopMoves(board, [row, col]) {
    // Futó lépései
    const moves = [];
    const directions = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];
    directions.forEach((direction) => {
      const [rowDir, colDir] = direction;
      let nextRow = row + rowDir;
      let nextCol = col + colDir;
      while (board[nextRow] && board[nextRow][nextCol] === 0) {
        moves.push([nextRow, nextCol]);
        nextRow += rowDir;
        nextCol += colDir;
      }
      if (board[nextRow] && board[nextRow][nextCol]) {
        if (board[nextRow][nextCol].color !== this.color) {
          moves.push([nextRow, nextCol]);
        }
      }
    });
    return moves;
  }

  getQueenMoves(board, [row, col]) {
    // Királynő lépései
    const moves = [];
    const directions = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    directions.forEach((direction) => {
      const [rowDir, colDir] = direction;
      let nextRow = row + rowDir;
      let nextCol = col + colDir;
      while (board[nextRow] && board[nextRow][nextCol] === 0) {
        moves.push([nextRow, nextCol]);
        nextRow += rowDir;
        nextCol += colDir;
      }
      if (board[nextRow] && board[nextRow][nextCol]) {
        if (board[nextRow][nextCol].color !== this.color) {
          moves.push([nextRow, nextCol]);
        }
      }
    });

    return moves;
  }

  getKingMoves(board, [row, col]) {
    // Király lépései
    const moves = [];
    const directions = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    directions.forEach((direction) => {
      const [rowDir, colDir] = direction;
      const nextRow = row + rowDir;
      const nextCol = col + colDir;

      if (board[nextRow] && board[nextRow][nextCol] === 0) {
        if (board[nextRow][nextCol].color !== this.color) {
          // lépés szimulálása
          const tempPiece = board[nextRow][nextCol];
          board[nextRow][nextCol] = this;
          board[row][col] = 0;

          // szimulált lépésben ellenőrizzük, hogy a király sakkban van-e
          if (!isInCheck(board, this.color)) {
            moves.push([nextRow, nextCol]);
          }

          // lépés visszaállítása
          board[row][col] = this;
          board[nextRow][nextCol] = tempPiece;
        }
      }
    });
    return moves;
  }

  isCheckmate(board, color) {
    // sakk-matt ellenőrzése
    const [kingRow, kingCol] = findKing(board, color);
    const king = board[kingRow][kingCol];
    const kingMoves = king.getAvailableMoves(board, kingRow, kingCol);
    const kingInCheck = isInCheck(board, color);

    if (kingInCheck && kingMoves.length === 0) {
      return true;
    }

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[0].length; col++) {
        const piece = board[row][col];
        if (piece && piece.color === color) {
          const availableMoves = piece.getAvailableMoves(board, row, col);
          if (availableMoves.length > 0) {
            return false;
          }
        }
      }
    }
    return true;
  }

  getAvailableMovesDiv(board, cellDiv) {
    // Lépések meghatározása
    const [rowStr, colStr] = cellDiv.id.split("-");
    const row = parseInt(rowStr);
    const col = parseInt(colStr);
    return this.getAvailableMoves(board, row, col);
  }

  getAvailableMoves(board, row, col) {
    // Lépések meghatározása
    if (this.type === "pawn") {
      return this.getPawnMoves(board, row, col);
    }
    if (this.type === "rook") {
      return this.getRookMoves(board, [row, col]);
    }
    if (this.type === "knight") {
      return this.getKnightMoves(board, [row, col]);
    }
    if (this.type === "bishop") {
      return this.getBishopMoves(board, [row, col]);
    }
    if (this.type === "queen") {
      return this.getQueenMoves(board, [row, col]);
    }
    if (this.type === "king") {
      return this.getKingMoves(board, [row, col]);
    }
  }

  loadSvg() {
    // SVG betöltése
    const absPath = document.location.origin + document.location.pathname.replace(/\/index\.php$/, "");
    const svgPath = `${absPath}/assets/${this.color}-${this.type}.svg`;
    const loader = new SVGLoader(svgPath);
    return loader.loadSVG();
  }
}
export default Piece;
