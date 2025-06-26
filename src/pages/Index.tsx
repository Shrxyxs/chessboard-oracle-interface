
import { useState } from "react";
import { Chess } from "chess.js";
import { ChessBoard } from "@/components/ChessBoard";
import { GameInfo } from "@/components/GameInfo";
import { GameHeader } from "@/components/GameHeader";

const Index = () => {
  const [gameMode, setGameMode] = useState<'human-vs-ai' | 'human-vs-human'>('human-vs-ai');
  const [game, setGame] = useState<Chess>(new Chess());
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);

  const handleGameStateChange = (newGame: Chess) => {
    setGame(newGame);
    const history = newGame.history();
    setMoveHistory(history);
    console.log("Game state updated, move history:", history);
  };

  const handleNewGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([]);
    console.log("New game started from Index");
  };

  const handleResetBoard = () => {
    const newGame = new Chess();
    setGame(newGame);
    setMoveHistory([]);
    console.log("Board reset from Index");
  };

  const handleGameModeChange = (mode: 'human-vs-ai' | 'human-vs-human') => {
    setGameMode(mode);
    console.log("Game mode changed to:", mode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <GameHeader />
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 flex justify-center">
            <ChessBoard 
              gameMode={gameMode}
              onGameStateChange={handleGameStateChange}
              onNewGame={handleNewGame}
              onResetBoard={handleResetBoard}
            />
          </div>
          <div className="lg:col-span-1">
            <GameInfo 
              gameMode={gameMode}
              onGameModeChange={handleGameModeChange}
              onNewGame={handleNewGame}
              onResetBoard={handleResetBoard}
              game={game}
              isAiThinking={isAiThinking}
              moveHistory={moveHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
