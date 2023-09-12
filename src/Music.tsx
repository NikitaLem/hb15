import { FC } from "react";

export const Music: FC = () => {
  return (
    <audio controls autoPlay loop>
      <source src="@/assets/music.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
};
