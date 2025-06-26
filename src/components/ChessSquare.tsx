
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChessSquareProps {
  square: string;
  isLight: boolean;
  isSelected: boolean;
  isPossibleMove: boolean;
  isDraggedOver: boolean;
  onClick: () => void;
  onDrop: () => void;
  children?: ReactNode;
}

export const ChessSquare = ({
  square,
  isLight,
  isSelected,
  isPossibleMove,
  isDraggedOver,
  onClick,
  onDrop,
  children
}: ChessSquareProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop();
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center cursor-pointer transition-all duration-200",
        "w-12 h-12 md:w-15 md:h-15",
        isLight ? "bg-amber-100" : "bg-amber-700",
        isSelected && "ring-4 ring-blue-400 ring-opacity-70",
        isPossibleMove && "after:content-[''] after:absolute after:w-3 after:h-3 after:bg-green-500 after:rounded-full after:opacity-70",
        isDraggedOver && "bg-green-300",
        "hover:brightness-110"
      )}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      {/* Square label for debugging */}
      <span className="absolute top-0 left-0 text-xs opacity-20 pointer-events-none">
        {square}
      </span>
    </div>
  );
};
