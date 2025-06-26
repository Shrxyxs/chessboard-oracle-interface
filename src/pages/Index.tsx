
import { ChessBoard } from "@/components/ChessBoard";
import { GameInfo } from "@/components/GameInfo";
import { GameHeader } from "@/components/GameHeader";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <GameHeader />
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 flex justify-center">
            <ChessBoard />
          </div>
          <div className="lg:col-span-1">
            <GameInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
