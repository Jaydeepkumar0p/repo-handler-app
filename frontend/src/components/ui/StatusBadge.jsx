export const STATUS = {
  Live:     { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/25', dot: 'bg-emerald-400' },
  Beta:     { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/25',   dot: 'bg-amber-400'   },
  Archived: { bg: 'bg-zinc-500/15',    text: 'text-zinc-400',    border: 'border-zinc-500/25',    dot: 'bg-zinc-500'    },
};

export function StatusBadge({ status, animate = false }) {
  const s = STATUS[status] || STATUS.Live;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${animate && status === 'Live' ? 'animate-pulse' : ''}`} />
      {status}
    </span>
  );
}
