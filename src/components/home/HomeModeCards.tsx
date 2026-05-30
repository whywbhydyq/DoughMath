'use client';

import type { HomeModeId } from './homeModes';
import { homeModes } from './homeModes';

type HomeModeCardsProps = {
  activeMode: HomeModeId;
  onSelect: (mode: HomeModeId) => void;
};

export function HomeModeCards({ activeMode, onSelect }: HomeModeCardsProps) {
  return (
    <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:grid lg:grid-cols-5 lg:overflow-visible">
      {homeModes.map((mode) => {
        const active = mode.id === activeMode;
        return (
          <button
            key={mode.id}
            type="button"
            onClick={() => onSelect(mode.id)}
            aria-pressed={active}
            className={`min-w-[10rem] rounded-2xl border px-3 py-2.5 text-left transition lg:min-w-0 ${
              active
                ? 'border-dough-700 bg-amber-100/90 shadow-soft'
                : 'border-amber-200/80 bg-white/85 hover:border-dough-500/60 hover:bg-amber-50/70'
            }`}
          >
            <span className="block text-sm font-black leading-5 text-stone-950">{mode.title}</span>
            <span className="mt-0.5 block text-xs font-medium leading-4 text-stone-600">{mode.description}</span>
          </button>
        );
      })}
    </div>
  );
}
