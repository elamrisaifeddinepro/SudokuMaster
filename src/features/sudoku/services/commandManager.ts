import { Command, GridState } from '@/features/sudoku/model/types';

export class CommandManager {
  private history: Command[] = [];
  private currentIndex = -1;
  
  executeCommand(command: Command): GridState {
    // Remove any commands after current index (for redo functionality)
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    // Add new command
    this.history.push(command);
    this.currentIndex++;
    
    return command.execute();
  }
  
  canUndo(): boolean {
    return this.currentIndex >= 0;
  }
  
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }
  
  undo(): GridState | null {
    if (!this.canUndo()) {
      return null;
    }
    
    const command = this.history[this.currentIndex];
    this.currentIndex--;
    
    return command.undo();
  }
  
  redo(): GridState | null {
    if (!this.canRedo()) {
      return null;
    }
    
    this.currentIndex++;
    const command = this.history[this.currentIndex];
    
    return command.execute();
  }
  
  clear(): void {
    this.history = [];
    this.currentIndex = -1;
  }
}