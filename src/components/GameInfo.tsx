
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, User, RotateCcw, Play } from "lucide-react";
import { Chess } from "chess.js";

interface GameInfoProps {
  gameMode: 'human-vs-ai' | 'human-vs-human';
  onGameModeChange: (mode: 'human-vs-ai' | 'human-vs-human') => void;
  onNewGame: () => void;
  onResetBoard: () => void;
  game?: Chess;
  isAiThinking?: boolean;
  moveHistory?: string[];
}

export const GameInfo = ({
  gameMode,
  onGameModeChange,
  onNewGame,
  onResetBoard,
  game,
  isAiThinking = false,
  moveHistory = []
}: GameInfoProps) => {
  const [currentTurn, setCurrentTurn] = useState('White');

  useEffect(() => {
    if (game) {
      setCurrentTurn(game.turn() === 'w' ? 'White' : 'Black');
    }
  }, [game]);

  const handleNewGame = () => {
    onNewGame();
    // Also trigger the ChessBoard handler
    if ((window as any).chessBoardNewGame) {
      (window as any).chessBoardNewGame();
    }
  };

  const handleResetBoard = () => {
    onResetBoard();
    // Also trigger the ChessBoard handler
    if ((window as any).chessBoardResetBoard) {
      (window as any).chessBoardResetBoard();
    }
  };

  const formatMoveHistory = () => {
    const moves = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
      const moveNumber = Math.floor(i / 2) + 1;
      const whiteMove = moveHistory[i];
      const blackMove = moveHistory[i + 1] || '';
      moves.push({ moveNumber, whiteMove, blackMove });
    }
    return moves.slice(-5);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-amber-400" />
            Game Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Button
              variant={gameMode === 'human-vs-ai' ? 'default' : 'outline'}
              onClick={() => onGameModeChange('human-vs-ai')}
              className="w-full justify-start"
            >
              <User className="w-4 h-4 mr-2" />
              Human vs AI
            </Button>
            <Button
              variant={gameMode === 'human-vs-human' ? 'default' : 'outline'}
              onClick={() => onGameModeChange('human-vs-human')}
              className="w-full justify-start"
            >
              <User className="w-4 h-4 mr-2" />
              Human vs Human
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Game Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Current Turn:</span>
            <Badge variant="outline" className="text-white">
              {currentTurn}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">AI Status:</span>
            <Badge variant={isAiThinking ? "default" : "secondary"}>
              {isAiThinking ? "Thinking..." : "Ready"}
            </Badge>
          </div>
          {game?.isGameOver() && (
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Game Result:</span>
              <Badge variant="destructive">
                {game.isCheckmate() 
                  ? `${game.turn() === 'w' ? 'Black' : 'White'} Wins!`
                  : 'Draw'
                }
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">MCTS Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-300">Time Limit:</span>
            <Badge variant="outline" className="text-white">
              3 seconds
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">C Parameter:</span>
            <Badge variant="outline" className="text-white">
              1.4
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleNewGame}
          >
            <Play className="w-4 h-4 mr-2" />
            Start New Game
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={handleResetBoard}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Board
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Move History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-300 space-y-1 max-h-32 overflow-y-auto">
            {moveHistory.length > 0 ? (
              formatMoveHistory().map((move, index) => (
                <div key={index} className="flex justify-between">
                  <span className="w-8">{move.moveNumber}.</span>
                  <span className="flex-1">{move.whiteMove} {move.blackMove}</span>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500">
                No moves yet - make your first move!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
