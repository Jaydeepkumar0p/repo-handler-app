import { Pencil, Trash2, ExternalLink, GripVertical, Eye } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge.jsx';

export default function AdminWebsiteCard({ website, onEdit, onDelete, dragHandleProps }) {
  return (
    <div className="flex items-center gap-3 glass-card rounded-xl px-3 py-3 border border-border hover:border-border-bright transition-colors group">

      {/* Drag handle */}
      <div {...dragHandleProps}
        className="text-gray-700 hover:text-gray-400 cursor-grab active:cursor-grabbing shrink-0 touch-none">
        <GripVertical size={17} />
      </div>

      {/* Thumbnail */}
      <div className="w-14 h-9 rounded-lg overflow-hidden bg-surface-2 shrink-0 relative border border-border">
        {website.images?.[0] ? (
          <img src={website.images[0]} alt={website.name}
            className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/10 font-black text-xl">
            {website.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-medium text-white truncate">{website.name}</p>
          <StatusBadge status={website.status} />
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-[10px] text-gray-600">
            <Eye size={10} /> {website.visitors || 0}
          </span>
          <span className="text-[10px] text-gray-700">
            {website.techStack?.slice(0, 3).join(' · ')}
            {website.techStack?.length > 3 ? ` +${website.techStack.length - 3}` : ''}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {website.liveUrl && (
          <a href={website.liveUrl} target="_blank" rel="noopener noreferrer"
            className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
            <ExternalLink size={12} />
          </a>
        )}
        <button onClick={() => onEdit(website)}
          className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-indigo-400 transition-colors">
          <Pencil size={12} />
        </button>
        <button onClick={() => onDelete(website._id)}
          className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors">
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}
