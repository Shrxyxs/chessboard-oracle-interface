
class MCTSNode {
  state: any;
  parent: MCTSNode | null;
  move: any;
  children: MCTSNode[];
  visits: number;
  wins: number;

  constructor(state: any, parent: MCTSNode | null = null, move: any = null) {
    this.state = state;
    this.parent = parent;
    this.move = move;
    this.children = [];
    this.visits = 0;
    this.wins = 0.0;
  }

  isFullyExpanded(): boolean {
    return this.children.length === this.state.moves().length;
  }

  bestChild(cParam: number = 1.4): MCTSNode {
    let bestScore = -Infinity;
    let bestChild: MCTSNode | null = null;
    
    for (const child of this.children) {
      const exploitation = child.wins / child.visits;
      const exploration = cParam * Math.sqrt(Math.log(this.visits) / child.visits);
      const score = exploitation + exploration;
      
      if (score > bestScore) {
        bestScore = score;
        bestChild = child;
      }
    }
    
    return bestChild!;
  }

  expand(): MCTSNode | null {
    const triedMoves = this.children.map(child => child.move.san);
    const legalMoves = this.state.moves();
    
    for (const move of legalMoves) {
      if (!triedMoves.includes(move)) {
        const nextState = new (this.state.constructor as any)(this.state.fen());
        nextState.move(move);
        const childNode = new MCTSNode(nextState, this, { san: move, uci: move });
        this.children.push(childNode);
        return childNode;
      }
    }
    
    return null;
  }

  rollout(): number {
    const currentState = new (this.state.constructor as any)(this.state.fen());
    
    while (!currentState.isGameOver()) {
      const moves = currentState.moves();
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      currentState.move(randomMove);
    }
    
    if (currentState.isCheckmate()) {
      return currentState.turn() === 'w' ? 0.0 : 1.0;
    }
    
    return 0.5; // Draw
  }

  backpropagate(result: number): void {
    this.visits += 1;
    this.wins += result;
    
    if (this.parent) {
      this.parent.backpropagate(1.0 - result);
    }
  }
}

export class MCTS {
  timeLimit: number;
  cParam: number;

  constructor(timeLimit: number = 3, cParam: number = 1.4) {
    this.timeLimit = timeLimit;
    this.cParam = cParam;
  }

  search(initialState: any): string {
    const root = new MCTSNode(initialState);
    const endTime = Date.now() + this.timeLimit * 1000;
    
    while (Date.now() < endTime) {
      let node = root;
      
      // Selection
      while (node.isFullyExpanded() && node.children.length > 0) {
        node = node.bestChild(this.cParam);
      }
      
      // Expansion
      if (!node.state.isGameOver()) {
        const expandedNode = node.expand();
        if (expandedNode) {
          node = expandedNode;
        }
      }
      
      // Simulation
      const result = node.rollout();
      
      // Backpropagation
      node.backpropagate(result);
    }
    
    if (root.children.length === 0) {
      const moves = root.state.moves();
      return moves[Math.floor(Math.random() * moves.length)];
    }
    
    const best = root.children.reduce((prev, current) => 
      current.visits > prev.visits ? current : prev
    );
    
    return best.move.san;
  }
}
