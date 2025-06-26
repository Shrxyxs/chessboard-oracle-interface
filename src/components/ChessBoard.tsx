import { useState, useEffect, useCallback } from "react";
import { Chess } from "chess.js";
import { ChessSquare } from "./ChessSquare";
import { ChessPiece } from "./ChessPiece";
import { useToast } from "@/hooks/use-toast";
import { MCTS } from "@/utils/mcts";

interface ChessBoardProps {
  gameMode: 'human-vs-ai' | 'human-vs-human';
  onGameStateChange?: (game: Chess) => void;
  onNewGame?: () => void;
  onResetBoard?: () => void;
}

export const ChessBoard = ({ 
  gameMode, 
  onGameStateChange,
  onNewGame,
  onResetBoard 
}: ChessBoardProps) => {
  const [game, setGame] = useState(new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [draggedPiece, setDraggedPiece] = useState<string | null>(null);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const { toast } = useToast();

  const mcts = new MCTS(3, 1.4);
  const board = game.board();
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  // Handle new game from parent
  useEffect(() => {
    if (onNewGame) {
      const handleNewGame = () => {
        const newGame = new Chess();
        setGame(newGame);
        setSelectedSquare(null);
        setPossibleMoves([]);
        setDraggedPiece(null);
        onGameStateChange?.(newGame);
        console.log("New game started in ChessBoard");
      };
      // Store the handler so parent can call it
      (window as any).chessBoardNewGame = handleNewGame;
    }
  }, [onNewGame, onGameStateChange]);

  // Handle reset board from parent
  useEffect(() => {
    if (onResetBoard) {
      const handleResetBoard = () => {
        const newGame = new Chess();
        setGame(newGame);
        setSelectedSquare(null);
        setPossibleMoves([]);
        setDraggedPiece(null);
        onGameStateChange?.(newGame);
        console.log("Board reset in ChessBoard");
      };
      // Store the handler so parent can call it
      (window as any).chessBoardResetBoard = handleResetBoard;
    }
  }, [onResetBoard, onGameStateChange]);

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
        promotion: 'q'
      });
      
      if (move) {
        const newGame = new Chess(game.fen());
        setGame(newGame);
        setSelectedSquare(null);
        setPossibleMoves([]);
        
        onGameStateChange?.(newGame);
        console.log("Move made:", move.san, "New history:", newGame.history());
        
        if (newGame.isCheckmate()) {
          toast({
            title: "Checkmate!",
            description: `${newGame.turn() === 'w' ? 'Black' : 'White'} wins!`,
          });
        } else if (newGame.isCheck()) {
          toast({
            title: "Check!",
            description: `${newGame.turn() === 'w' ? 'White' : 'Black'} is in check.`,
          });
        }
        
        return true;
      }
    } catch (error) {
      console.log("Invalid move:", error);
    }
    return false;
  }, [game, toast, onGameStateChange]);

  const makeAiMove = useCallback(async () => {
    if (game.isGameOver() || isAiThinking) return;
    
    setIsAiThinking(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const aiMove = mcts.search(game);
      console.log("AI suggests move:", aiMove);
      
      if (aiMove) {
        const move = game.move(aiMove);
        if (move) {
          const newGame = new Chess(game.fen());
          setGame(newGame);
          onGameStateChange?.(newGame);
          console.log("AI move made:", move.san, "New history:", newGame.history());
          
          if (newGame.isCheckmate()) {
            toast({
              title: "Checkmate!",
              description: `${newGame.turn() === 'w' ? 'Black' : 'White'} wins!`,
            });
          } else if (newGame.isCheck()) {
            toast({
              title: "Check!",
              description: `${newGame.turn() === 'w' ? 'White' : 'Black'} is in check.`,
            });
          }
        }
      }
    } catch (error) {
      console.error("AI move error:", error);
      const moves = game.moves();
      if (moves.length > 0) {
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        game.move(randomMove);
        const newGame = new Chess(game.fen());
        setGame(newGame);
        onGameStateChange?.(newGame);
      }
    } finally {
      setIsAiThinking(false);
    }
  }, [game, mcts, isAiThinking, toast, onGameStateChange]);

  // Handle AI moves based on game mode
  useEffect(() => {
    if (game.isGameOver()) return;
    
    const shouldAiMove = (gameMode === 'human-vs-ai' && game.turn() === 'b');
    
    if (shouldAiMove && !isAiThinking) {
      const timeout = setTimeout(() => {
        makeAiMove();
      }, 500);
      
      return () => clearTimeout(timeout);
    }
  }, [game.fen(), gameMode, makeAiMove, isAiThinking]);

  const handleSquareClick = (square: string) => {
    if (isAiThinking) return;
    
    if (gameMode === 'human-vs-ai' && game.turn() === 'b') return;
    
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
    if (isAiThinking) return;
    if (gameMode === 'human-vs-ai' && game.turn() === 'b') return;
    
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
          {isAiThinking ? 'AI thinking...' : `${game.turn() === 'w' ? 'White' : 'Black'} to move`}
        </p>
        {gameMode === 'human-vs-ai' && game.turn() === 'b' && (
          <p className="text-amber-200 text-xs mt-1">Computer's turn</p>
        )}
      </div>
    </div>
  );
};
