import { useCallback, useEffect, useRef, useState } from "react";

const cellSize = 20;
const playerSize = (cellSize * 3) / 4;

export const useGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D>();
  const [isOver, setIsOver] = useState(false);
  const [win, setWin] = useState(false);
  const [crumbsCount, setCrumbsCount] = useState(0);
  const [maze, setMaze] = useState<number[][]>();
  const [player, setPlayer] = useState<{ x: number; y: number }>();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = document.body.offsetWidth;
    canvas.height = document.body.offsetHeight * 3;
    ctx.current = canvas.getContext("2d") as CanvasRenderingContext2D;
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const size = getSizeUtil(canvasRef.current)();
    setPlayer({ y: 0, x: Math.floor(size?.cols / 2) });
    setMaze(createMaze(size.rows, size.cols));
  }, []);

  const drawMaze = useCallback(() => {
    if (!maze || !canvasRef.current || !ctx.current) return;

    const size = getSizeUtil(canvasRef.current)();

    for (let row = 0; row < size.rows; row++) {
      for (let col = 0; col < size.cols; col++) {
        if (maze[row]?.[col] === 1) {
          ctx.current.fillStyle = "#ffbae8";
          ctx.current.fillRect(
            col * cellSize,
            row * cellSize,
            cellSize,
            cellSize
          );
        }

        if (maze[row]?.[col] === 2) {
          ctx.current.fillStyle = "cyan";
          ctx.current.fillRect(
            col * cellSize,
            row * cellSize,
            cellSize,
            cellSize
          );
        }

        if (maze[row]?.[col] === 3) {
          ctx.current.fillStyle = "white";
          ctx.current.fillRect(
            col * cellSize,
            row * cellSize,
            cellSize,
            cellSize
          );
        }
      }
    }
  }, [maze]);

  const drawPlayer = useCallback(() => {
    if (!player || !ctx.current) return;

    ctx.current.fillStyle = "red";
    ctx.current.fillRect(
      player.x * cellSize + cellSize / 2 - playerSize / 2,
      player.y * cellSize + cellSize / 2 - playerSize / 2,
      playerSize,
      playerSize
    );
  }, [player]);

  const checkCrumb = useCallback(
    (x: number, y: number) => {
      if (!maze) return;

      if (maze[y]?.[x] === 2) {
        setCrumbsCount((cur) => cur + 1);
        setMaze((cur) => {
          if (!cur) return cur;

          const mazeClone = structuredClone(cur);
          mazeClone[y][x] = 1;
          return mazeClone;
        });
      }
    },
    [maze]
  );

  const updateGameArea = useCallback(() => {
    if (!canvasRef.current || !ctx.current) return;

    ctx.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    drawMaze();
    drawPlayer();
  }, [drawMaze, drawPlayer]);

  const movePlayer = useCallback(
    (event: KeyboardEvent) => {
      if (isOver || !maze || !canvasRef.current) return;

      const size = getSizeUtil(canvasRef.current)();

      setPlayer((cur) => {
        if (!cur) return cur;

        const next = { ...cur };

        switch (event.key) {
          case "ArrowUp":
            event.preventDefault();
            if (cur.y > 0 && maze[cur.y - 1][cur.x] !== 0) {
              next.y--;
            } else {
              next.y--;
              setIsOver(true);
            }
            break;
          case "ArrowDown":
            event.preventDefault();
            if (cur.y < size.rows - 1 && maze[cur.y + 1][cur.x] !== 0) {
              next.y++;

              if (
                cur.y * cellSize + 300 >
                window.innerHeight + window.scrollY
              ) {
                window.scrollBy({ left: 0, top: 400, behavior: "smooth" });
              }
            } else {
              next.y++;
              setIsOver(true);
            }
            break;
          case "ArrowLeft":
            event.preventDefault();
            if (cur.x > 0 && maze[cur.y][cur.x - 1] !== 0) {
              next.x--;
            } else {
              next.x--;
              setIsOver(true);
            }
            break;
          case "ArrowRight":
            event.preventDefault();
            if (cur.x < size.cols - 1 && maze[cur.y][cur.x + 1] !== 0) {
              next.x++;
            } else {
              next.x++;
              setIsOver(true);
            }
            break;
        }

        checkCrumb(next.x, next.y);
        if (maze[next.y][next.x] === 3) {
          setWin(true);
        }
        return next;
      });

      updateGameArea();
    },
    [checkCrumb, isOver, maze, updateGameArea]
  );

  useEffect(() => {
    window.addEventListener("keydown", movePlayer);
    drawMaze();
    drawPlayer();

    return () => {
      window.removeEventListener("keydown", movePlayer);
    };
  }, [drawMaze, drawPlayer, movePlayer]);

  return { isOver, win, crumbsCount, canvasRef };
};

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
  let crumbPlaced = true;

  while (r < rows - 1) {
    let type = 1;

    if (!(r % 15) && !crumbPlaced && isValid(r, c)) {
      type = 2;
      crumbPlaced = true;
    }

    if (r === rows - 2) {
      type = 3;
    }

    maze[r][c] = maze[r][c] === 0 ? type : maze[r][c];
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
          crumbPlaced = false;
        }
        break;
      default:
        break;
    }
  }

  return maze;
}

function getSizeUtil(canvas: HTMLCanvasElement) {
  let size = {} as { cols: number; rows: number } | undefined;
  return function getSize() {
    if (size?.cols && size.rows) return size;
    const numRows = Math.floor(canvas.height / cellSize);
    const numCols = Math.floor(canvas.width / cellSize);
    size = { rows: numRows, cols: numCols };
    return size;
  };
}
