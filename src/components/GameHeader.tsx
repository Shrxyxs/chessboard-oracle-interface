
import { Crown, Zap } from "lucide-react";

export const GameHeader = () => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Crown className="text-amber-400 w-8 h-8" />
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Chess Oracle
        </h1>
        <Zap className="text-amber-400 w-8 h-8" />
      </div>
      <p className="text-xl text-slate-300 max-w-2xl mx-auto">
        Challenge the Monte Carlo Tree Search AI in this beautiful chess interface
      </p>
    </div>
  );
};
