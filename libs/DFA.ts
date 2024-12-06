export class DFA<T, S> {
  private currentState: T;
  private stateMap: Map<T, Map<S, T>>;

  constructor(initalState: T) {
    this.currentState = initalState;
    this.stateMap = new Map<T, Map<S, T>>();
  }

  transition(symbol: S) {
    const newState = this.stateMap.get(this.currentState)?.get(symbol);
    if (newState) this.currentState = newState;
  }

  runSequence(symbols: S[]) {
    symbols.forEach(this.transition);
  }

  private addState(state: T) {
    let newState = this.stateMap.get(state);
    if (!newState) {
      newState = new Map<S, T>();
      this.stateMap.set(state, newState);
    }
    return newState;
  }

  addTransition(state: T, symbol: S, outcome: T) {
    let stateTransitions = this.addState(state);
    stateTransitions.set(symbol, outcome);
  }

  getCurrentState() {
    return this.currentState;
  }
}
