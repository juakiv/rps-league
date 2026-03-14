export function SkeletonRow({ i }: { i: number }) {
  return (
    <div key={i} className="flex flex-row px-4 py-2 gap-2 border-t border-neutral-600 animate-pulse">
      <div className="flex-1 h-5 bg-neutral-700 rounded w-32"></div>
      <div className="flex-1 h-5 bg-neutral-700 rounded w-32"></div>
      <div className="flex-1 h-5 bg-neutral-700 rounded w-24"></div>
      <div className="flex-1 h-5 bg-neutral-700 rounded w-40"></div>
    </div>
  );
}