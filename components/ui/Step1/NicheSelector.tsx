import React from 'react';
import { niches } from '../../../lib/niches';
import { NicheCard } from '../NicheCard';

interface NicheSelectorProps {
  selectedNiche: string;
  onSelect: (nicheId: string) => void;
}

export function NicheSelector({ selectedNiche, onSelect }: NicheSelectorProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2 pb-2">
      {niches.map(niche => (
        <NicheCard
          key={niche.niche_id}
          niche={niche}
          selected={selectedNiche === niche.niche_id}
          onClick={() => onSelect(niche.niche_id)}
        />
      ))}
    </div>
  );
}
