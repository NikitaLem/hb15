import { FC, memo, useEffect, useState } from "react";
import Modal, { Styles } from "react-modal";

import krolik from "../public/krolik.jpg";
import svecha from "../public/svecha.jpg";
import wheel from "../public/wheel.png";
import solntse from "../public/solntse.jpg";
import kapusta from "../public/kapusta.jpg";
import glasses from "../public/glasses.png";
import vopros from "../public/vopros.jpg";
import veter from "../public/veter.jpg";
import trava from "../public/trava.jpg";

Modal.setAppElement("#root");

const customStyles: Styles = {
  content: {
    maxWidth: 700,
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    color: "black",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
};

interface GameModalProps {
  isOver: boolean;
  isWin: boolean;
  stage: number;
}

const refresh = () => location.reload();

const script = [
  [
    "**** расстелила на поляне скатерть и поставила на нее прекрасный торт.",
    `"Ух! Как же я сейчас наемся!" - сказала ****.`,
    "Но из ниоткуда появился кролик, схватил торт и прыгнул в нору!",
    "**** сильно удивилась, а потом еще сильнее разолилась и прыгнула за ним.",
  ],
  [
    "**** нашла свечку - одну из тех, что украшали торт.",
    "Свечка все еще горела.",
    "Поэтому **** задула ее!",
    "Исчезающий огонек пожелал **** радости куда бы они ни шла",
  ],
  [
    "Вот и еще одна свечка - видимо кролик специально их разбросал!",
    "**** дунула и свеча погасла.",
    "Эта свечка пожелала приятных подарков от судьбы.",
  ],
  [
    "Держа в руке очередную свечу, **** подумала:",
    `"Как же я найду дорогу наверх, если буду и дальше задувать свечи?"`,
    `"Шуууууух!" - пламя погасло.`,
    `"Я просто маленькая свечка и от меня мало тепла, но пусть у тебя всегда светит большое теплое солнце!"`,
  ],
  [
    "Вот так вот и приходится задувать свечи на торте - неудобно!",
    "Свечи гаснут, а в норе не становится темнее.",
    `"Знаешь, этот торт был очень вкусным! Но кушай правильно и вкусно не только в такие дни, хорошо?"`,
  ],
  [
    "Странно, что цвет вокруг меняется с каждой свечой.",
    `"Социальные связи - это очень важно в нашей жизни. Поэтому пусть у тебя они будут только качественными и позитивными."`,
    `"Ой-ой, какая умная свечка попалась!"`,
  ],
  [
    `"Который раз ты уже пытаешься догнать кролика? Оставайся такой же упорной, ****!"`,
    "Так ли важен тортик, чтобы лезть в такую даль?",
    `"Я с ъ е л а слишком много свечей! Теперь даже фон от картинок видно!`,
  ],
  [
    "**** уже устала задувать свечи - скоро у нее не останется воздуха, чтобы их задувать.",
    `"Мой долг предупредить тебя: все следующие свечи очень странные, но помни о тортике!"`,
  ],
  [
    "Варкалось. Хливкие шорьки",
    "Пырялись по наве",
    "И хрюкотали зелюки",
    "Как мюмзики в мове.",
  ],
  [
    "О, бойся Бармаглота, ****!",
    "Он так свирлеп и дик!",
    "А в глуше рымит исполин —",
    "Злопастный Брандашмыг!",
  ],
  [
    "**** подняла меч ворпал и щит,",
    "Высоких полона дум.",
    "В глущобу путь ее лежит",
    "Под дерево Тумтум.",
  ],
  [
    "Стала под дерево и ждёт.",
    "И вдруг граахнул гром —",
    "Летит ужасный Бармаглот",
    "И пылкает огнём!",
  ],
  [
    "Раз-два, раз-два! Горит трава,",
    "Взы-взы — стрижает меч,",
    "Ува! Ува! И голова",
    "Барабардает с плеч!",
  ],
  [
    "Варкалось. Хливкие шорьки",
    "Пырялись по наве",
    "И хрюкотали зелюки",
    "Как мюмзики в мове.",
  ],
];

const winScript = [
  "**** добралась до самого дна кроличьей норы.",
  "Там она встретила того самого кролика, что стащил ее торт.",
  "Но кролик сказал, что он не брал никакого тортика.",
  "Eще он сказал, что всегда рад видеть ****, а ее тортик всегда был там наверху.",
  "Потом он почеcал пушистыми ушами и **** проснулась.",
];

const pics = [krolik, svecha, wheel, solntse, kapusta, glasses, vopros, veter];

export const GameModal: FC<GameModalProps> = memo(
  ({ isOver, isWin, stage }) => {
    const [open, setOpen] = useState(true);

    const handleModalClose = () => {
      setOpen(false);
    };

    useEffect(() => {
      if (isOver || isWin) {
        setOpen(true);
      }
    }, [isOver, isWin]);

    useEffect(() => {
      if (stage) {
        setOpen(true);
      }
    }, [stage]);

    return (
      <Modal isOpen={open} style={customStyles}>
        {isWin ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {winScript.map((t, i) => (
              <div key={i}>{t}</div>
            ))}
            <img src={krolik} height={150} style={{ objectFit: "contain" }} />
          </div>
        ) : !isOver ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {script[stage]?.map((t, i) => <div key={i}>{t}</div>) ??
              "Ой-ой! Сколько еще идти?"}
            {pics[stage] && (
              <img
                src={pics[stage]}
                height={150}
                style={{ objectFit: "contain" }}
              />
            )}
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div>**** проснулась - это был просто страшный сон!</div>
            <img src={trava} height={150} style={{ objectFit: "contain" }} />
          </div>
        )}
        {isWin ? null : !isOver ? (
          <button onClick={handleModalClose}>🎂</button>
        ) : (
          <button onClick={refresh}>🎈</button>
        )}
      </Modal>
    );
  }
);
