export function CPMBadge({ range, tier }: { range: string, tier?: string }) {
  const getBadgeClasses = (tierStr?: string) => {
    switch(tierStr) {
      case 'platinum': return "bg-purple-50 text-purple-700 border-purple-200";
      case 'gold': return "bg-amber-50 text-amber-700 border-amber-200";
      case 'silver': return "bg-slate-50 text-slate-700 border-slate-200";
      case 'bronze': return "bg-orange-50 text-orange-700 border-orange-200";
      default: return "bg-green-50 text-green-700 border-green-200";
    }
  };

  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded-full border ${getBadgeClasses(tier)} text-[11px] font-semibold tracking-tight`}>
      <span className="mr-1 font-medium opacity-80">CPM:</span> {range}
    </div>
  );
}
