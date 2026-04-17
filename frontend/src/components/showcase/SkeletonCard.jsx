export default function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-surface-2" />
      <div className="p-4 space-y-3">
        <div className="h-3.5 bg-surface-2 rounded w-1/2" />
        <div className="space-y-1.5">
          <div className="h-2.5 bg-surface-2 rounded w-full" />
          <div className="h-2.5 bg-surface-2 rounded w-4/5" />
        </div>
        <div className="flex gap-1.5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-4 w-14 bg-surface-2 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
