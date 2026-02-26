import type { Cell, Position, SudokuGrid } from '@/features/sudoku/model/types';
import SudokuCell from './SudokuCell';

type Props = {
  grid: SudokuGrid;
  selected?: Position | null;
  conflicts?: Set<string>;
  onCellClick?: (cell: Cell) => void;
};

function borderClasses(row: number, col: number) {
  const top = row % 3 === 0 ? 'border-t-2' : '';
  const left = col % 3 === 0 ? 'border-l-2' : '';
  const right = col === 8 ? 'border-r-2' : '';
  const bottom = row === 8 ? 'border-b-2' : '';
  return [top, left, right, bottom, 'border-slate-600'].filter(Boolean).join(' ');
}

export default function SudokuGrid({ grid, selected, conflicts, onCellClick }: Props) {
  const key = (r: number, c: number) => `${r}-${c}`;

  return (
    <div className="inline-block rounded-xl bg-slate-950 p-2 border border-slate-800">
      <div className="grid grid-cols-9 gap-0">
        {grid.flat().map((cell) => {
          const isSelected = !!selected && cell.row === selected.row && cell.col === selected.col;
          const isError = !!conflicts && conflicts.has(key(cell.row, cell.col));

          return (
            <div key={`${cell.row}-${cell.col}`} className={borderClasses(cell.row, cell.col)}>
              <SudokuCell cell={cell} isSelected={isSelected} isError={isError} onClick={onCellClick} />
            </div>
          );
        })}
      </div>
    </div>
  );
}