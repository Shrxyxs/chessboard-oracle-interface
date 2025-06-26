
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, User, RotateCcw, Play } from "lucide-react";

export const GameInfo = () => {
  const [gameMode, setGameMode] = useState<'human-vs-ai' | 'ai-vs-ai' | 'human-vs-human'>('human-vs-ai');
  const [aiThinking, setAiThinking] = useState(false);

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
              onClick={() => setGameMode('human-vs-ai')}
              className="w-full justify-start"
            >
              <User className="w-4 h-4 mr-2" />
              Human vs AI
            </Button>
            <Button
              variant={gameMode === 'ai-vs-ai' ? 'default' : 'outline'}
              onClick={() => setGameMode('ai-vs-ai')}
              className="w-full justify-start"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI vs AI
            </Button>
            <Button
              variant={gameMode === 'human-vs-human' ? 'default' : 'outline'}
              onClick={() => setGameMode('human-vs-human')}
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
              White
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-300">AI Status:</span>
            <Badge variant={aiThinking ? "default" : "secondary"}>
              {aiThinking ? "Thinking..." : "Ready"}
            </Badge>
          </div>
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
          <Button className="w-full" variant="outline">
            <Play className="w-4 h-4 mr-2" />
            Start New Game
          </Button>
          <Button className="w-full" variant="outline">
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
          <div className="text-sm text-slate-300 space-y-1">
            <div className="flex justify-between">
              <span>1.</span>
              <span>e4 e5</span>
            </div>
            <div className="flex justify-between">
              <span>2.</span>
              <span>Nf3 Nc6</span>
            </div>
            <div className="text-xs text-slate-500 mt-2">
              Game just started - make your move!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
