import { FC, useLayoutEffect } from "react";

export const Game: FC = () => {
  useLayoutEffect(() => {
    createGame();
  }, []);

  return <canvas id="gameCanvas"></canvas>;
};

function createGame() {
  const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight * 3;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

  const cellSize = 20;
  const playerSize = (cellSize * 3) / 4;
  const numRows = Math.floor(canvas.height / cellSize);
  const numCols = Math.floor(canvas.width / cellSize);
  const maze = createMaze(numRows, numCols);

  const player = {
    x: Math.floor(numCols / 2),
    y: 0,
  };

  function drawMaze() {
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (maze[row]?.[col] === 1) {
          ctx.fillStyle = "white";
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }
  }

  function drawPlayer() {
    ctx.fillStyle = "red";
    ctx.fillRect(
      player.x * cellSize + playerSize / 4,
      player.y * cellSize + playerSize / 4,
      playerSize,
      playerSize
    );
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function updateGameArea() {
    clearCanvas();
    drawMaze();
    drawPlayer();
  }

  function movePlayer(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        if (player.y > 0 && maze[player.y - 1][player.x] === 1) {
          player.y--;
        }
        break;
      case "ArrowDown":
        event.preventDefault();
        if (player.y < numRows - 1 && maze[player.y + 1][player.x] === 1) {
          player.y++;

          if (player.y * cellSize > window.innerHeight + window.scrollY) {
            window.scrollBy({ left: 0, top: 400, behavior: "smooth" });
          }
        }
        break;
      case "ArrowLeft":
        event.preventDefault();
        if (player.x > 0 && maze[player.y][player.x - 1] === 1) {
          player.x--;
        }
        break;
      case "ArrowRight":
        event.preventDefault();
        if (player.x < numCols - 1 && maze[player.y][player.x + 1] === 1) {
          player.x++;
        }
        break;
    }
    updateGameArea();
  }

  window.addEventListener("keydown", movePlayer);
  drawMaze();
  drawPlayer();
}

function createMaze(rows: number, cols: number): number[][] {
  const maze: number[][] = new Array(rows)
    .fill(null)
    .map(() => new Array(cols).fill(0));

  function isValid(r: number, c: number): boolean {
    return r >= 0 && r < rows && c >= 0 && c < cols;
  }

  let r = 0;
  let c = Math.floor(cols / 2);
  let maxSide = 0;

  while (c < cols - 1 && r < rows - 1) {
    maze[r][c] = 1;
    const direction = maxSide >= cols ? 2 : Math.floor(Math.random() * 9);

    switch (direction) {
      case 0:
      case 1:
      case 2:
      case 3:
        if (isValid(r, c + 1)) {
          c++;
          maxSide += 1;
        }
        break;
      case 4:
      case 5:
      case 6:
      case 7:
        if (isValid(r, c - 1)) {
          c--;
          maxSide += 1;
        }
        break;
      case 8:
        if (isValid(r + 1, c)) {
          r++;
          maxSide = 0;
        }
        break;
      default:
        break;
    }
  }

  return maze;
}
