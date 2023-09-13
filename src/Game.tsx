import { memo } from "react";
import { useGame } from "./useGame";
import { GameModal } from "./GameModal";

export const Game = memo(() => {
  const { isOver, win, crumbsCount, canvasRef } = useGame();

  return (
    <div>
      <GameModal isOver={isOver} isWin={win} stage={crumbsCount} />
      <canvas
        ref={canvasRef}
        style={{ filter: `hue-rotate(${crumbsCount * -30}deg)` }}
      ></canvas>
    </div>
  );
});
