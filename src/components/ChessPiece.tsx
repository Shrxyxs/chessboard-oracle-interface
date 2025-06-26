
import { cn } from "@/lib/utils";

interface ChessPieceProps {
  piece: {
    type: string;
    color: string;
  };
  square: string;
  isDragged: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

const pieceSymbols = {
  'p': { white: '♙', black: '♟' },
  'r': { white: '♖', black: '♜' },
  'n': { white: '♘', black: '♞' },
  'b': { white: '♗', black: '♝' },
  'q': { white: '♕', black: '♛' },
  'k': { white: '♔', black: '♚' },
};

export const ChessPiece = ({
  piece,
  square,
  isDragged,
  onDragStart,
  onDragEnd
}: ChessPieceProps) => {
  const symbol = pieceSymbols[piece.type as keyof typeof pieceSymbols];
  const pieceChar = piece.color === 'w' ? symbol.white : symbol.black;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', square);
    onDragStart();
  };

  return (
    <div
      className={cn(
        "text-4xl md:text-5xl select-none cursor-grab active:cursor-grabbing",
        "transition-all duration-200 hover:scale-110",
        isDragged && "opacity-50 scale-110",
        piece.color === 'w' ? "text-white drop-shadow-lg" : "text-gray-900 drop-shadow-lg"
      )}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
    >
      {pieceChar}
    </div>
  );
};
