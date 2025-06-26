
import { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { ChessSquare } from "./ChessSquare";
import { ChessPiece } from "./ChessPiece";
import { useToast } from "@/hooks/use-toast";

export const ChessBoard = () => {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const { toast } = useToast();

  const board = game.board();
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const getPieceAt = (square: string) => {
    const piece = game.get(square as any);
    return piece;
  };

  const isValidMove = (from: string, to: string) => {
    const moves = game.moves({ square: from as any, verbose: true });
    return moves.some(move => move.to === to);
  };

  const makeMove = useCallback((from: string, to: string) => {
    try {
      const move = game.move({
        from: from as any,
        to: to as any,
        promotion: 'q' // Always promote to queen for now
      });
      
      if (move) {
        setGame(new Chess(game.fen()));
        setSelectedSquare(null);
        setPossibleMoves([]);
        
        if (game.isCheckmate()) {
          toast({
            title: "Checkmate!",
            description: `${game.turn() === 'w' ? 'Black' : 'White'} wins!`,
          });
        } else if (game.isCheck()) {
          toast({
            title: "Check!",
            description: `${game.turn() === 'w' ? 'White' : 'Black'} is in check.`,
          });
        }
        
        return true;
      }
    } catch (error) {
      console.log("Invalid move:", error);
    }
    return false;
  }, [game, toast]);

  const handleSquareClick = (square: string) => {
    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setPossibleMoves([]);
      } else if (isValidMove(selectedSquare, square)) {
        makeMove(selectedSquare, square);
      } else {
        const piece = getPieceAt(square);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(square);
          const moves = game.moves({ square: square as any, verbose: true });
          setPossibleMoves(moves.map(move => move.to));
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    } else {
      const piece = getPieceAt(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square: square as any, verbose: true });
        setPossibleMoves(moves.map(move => move.to));
      }
    }
  };

  const handleDragStart = (square: string) => {
    const piece = getPieceAt(square);
    if (piece && piece.color === game.turn()) {
      setDraggedPiece(square);
      setSelectedSquare(square);
      const moves = game.moves({ square: square as any, verbose: true });
      setPossibleMoves(moves.map(move => move.to));
    }
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
  };

  const handleDrop = (square: string) => {
    if (draggedPiece && isValidMove(draggedPiece, square)) {
      makeMove(draggedPiece, square);
    }
    setDraggedPiece(null);
  };

  return (
    <div className="bg-amber-900 p-6 rounded-2xl shadow-2xl">
      <div className="grid grid-cols-8 gap-0 w-96 h-96 md:w-[480px] md:h-[480px] bg-amber-800 rounded-lg overflow-hidden shadow-inner">
        {ranks.map((rank, rankIndex) =>
          files.map((file, fileIndex) => {
            const square = `${file}${rank}`;
            const piece = getPieceAt(square);
            const isLight = (rankIndex + fileIndex) % 2 === 0;
            const isSelected = selectedSquare === square;
            const isPossibleMove = possibleMoves.includes(square);
            const isDraggedOver = draggedPiece && possibleMoves.includes(square);

            return (
              <ChessSquare
                key={square}
                square={square}
                isLight={isLight}
                isSelected={isSelected}
                isPossibleMove={isPossibleMove}
                isDraggedOver={isDraggedOver}
                onClick={() => handleSquareClick(square)}
                onDrop={() => handleDrop(square)}
              >
                {piece && (
                  <ChessPiece
                    piece={piece}
                    square={square}
                    isDragged={draggedPiece === square}
                    onDragStart={() => handleDragStart(square)}
                    onDragEnd={handleDragEnd}
                  />
                )}
              </ChessSquare>
            );
          })
        )}
      </div>
      <div className="mt-4 text-center">
        <p className="text-amber-100 text-sm">
          {game.turn() === 'w' ? 'White' : 'Black'} to move
        </p>
      </div>
    </div>
  );
};
