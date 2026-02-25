import type { Cell, SudokuGrid } from '@/features/sudoku/model/types';
import SudokuCell from './SudokuCell';

type Props = {
  grid: SudokuGrid;
  onCellClick?: (cell: Cell) => void;
};

function borderClasses(row: number, col: number) {
  // Bordures plus épaisses pour les blocs 3x3
  const top = row % 3 === 0 ? 'border-t-2' : '';
  const left = col % 3 === 0 ? 'border-l-2' : '';
  const right = col === 8 ? 'border-r-2' : '';
  const bottom = row === 8 ? 'border-b-2' : '';
  return [top, left, right, bottom, 'border-slate-600'].filter(Boolean).join(' ');
}

export default function SudokuGrid({ grid, onCellClick }: Props) {
  return (
    <div className="inline-block rounded-xl bg-slate-950 p-2 border border-slate-800">
      <div className="grid grid-cols-9 gap-0">
        {grid.flat().map((cell) => (
          <div key={`${cell.row}-${cell.col}`} className={borderClasses(cell.row, cell.col)}>
            <SudokuCell cell={cell} onClick={onCellClick} />
          </div>
        ))}
      </div>
    </div>
  );
}