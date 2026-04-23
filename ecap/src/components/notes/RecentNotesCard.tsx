import { useState } from "react";
import { FileText, Pin, Sparkles, CheckCircle, Target } from "lucide-react";
import { useRecentNotes, usePinnedNotes } from "../../hooks/useNotesAPI";
import { Note } from "../../types/notes";
import NoteDetailModal from "./NoteDetailModal";

interface RecentNotesCardProps {
  onViewAll?: () => void;
}

const getNoteTypeIcon = (type: string) => {
  switch (type) {
    case "executive":
      return <Sparkles className="w-4 h-4 text-purple-600" />;
    case "decision":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "analysis":
      return <FileText className="w-4 h-4 text-blue-600" />;
    case "action_item":
      return <Target className="w-4 h-4 text-orange-600" />;
    default:
      return <FileText className="w-4 h-4 text-gray-600" />;
  }
};

const getNoteTypeLabel = (type: string) => {
  switch (type) {
    case "executive":
      return "EXECUTIVE";
    case "decision":
      return "DECISION";
    case "analysis":
      return "ANALYSIS";
    case "action_item":
      return "ACTION ITEM";
    case "global":
      return "GLOBAL";
    default:
      return type.toUpperCase();
  }
};

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Leadership roles that qualify for Leadership Notes display
// This can be configured via Admin Settings (users.json -> leadership_config)
const LEADERSHIP_ROLES = ["VP", "Staff VP", "Director"];

export default function RecentNotesCard({ onViewAll }: RecentNotesCardProps) {
  const { notes: pinnedNotes, loading: pinnedLoading } = usePinnedNotes();
  const { notes: recentNotes, loading: recentLoading } = useRecentNotes(10);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter to show only leadership notes (Sr Leaders)
  // Uses is_leadership flag OR checks if author role is in LEADERSHIP_ROLES
  const isLeadershipNote = (note: Note) => {
    return (
      note.is_leadership || LEADERSHIP_ROLES.includes(note.author?.role || "")
    );
  };

  const leadershipPinnedNotes = pinnedNotes.filter(isLeadershipNote);
  const leadershipRecentNotes = recentNotes.filter(isLeadershipNote);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const loading = pinnedLoading || recentLoading;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-100 rounded"></div>
            <div className="h-20 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#1A3673]" />
          <h3 className="text-sm font-bold text-[#231E33]">Leadership Notes</h3>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs text-[#1A3673] hover:text-[#2861BB] font-semibold transition-colors"
          >
            View All →
          </button>
        )}
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {/* Pinned Leadership Notes */}
        {leadershipPinnedNotes.length > 0 && (
          <>
            {leadershipPinnedNotes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isPinned
                onClick={() => handleNoteClick(note)}
              />
            ))}
          </>
        )}

        {/* Recent Leadership Notes */}
        {leadershipRecentNotes.length > 0 && (
          <>
            {leadershipRecentNotes.slice(0, 10).map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                onClick={() => handleNoteClick(note)}
              />
            ))}
          </>
        )}

        {leadershipPinnedNotes.length === 0 &&
          leadershipRecentNotes.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <p className="text-xs">No leadership notes available</p>
            </div>
          )}
      </div>

      {/* Note Detail Modal */}
      <NoteDetailModal
        note={selectedNote}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onViewAllNotes={onViewAll}
      />
    </div>
  );
}

function NoteItem({
  note,
  isPinned = false,
  onClick,
}: {
  note: Note;
  isPinned?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className="border-l-2 border-[#00BBBA] pl-3 cursor-pointer hover:bg-gray-50 rounded p-2 -ml-2 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-1">
        {getNoteTypeIcon(note.type)}
        <span className="text-[10px] font-bold text-gray-600 uppercase">
          {getNoteTypeLabel(note.type)}
        </span>
        {isPinned && <Pin className="w-3 h-3 text-amber-600 fill-amber-600" />}
        <span className="text-[10px] text-gray-500 ml-auto">
          {formatTimeAgo(note.created_at)}
        </span>
      </div>
      <h4
        className="text-xs font-bold text-[#231E33] mb-1"
        title={note.title || note.content}
      >
        {note.title || note.content.substring(0, 50)}
      </h4>
      {note.title && (
        <p
          className="text-xs text-gray-600 leading-relaxed mb-1 line-clamp-3 cursor-help"
          title={note.content}
        >
          {note.content}
        </p>
      )}
      <div className="text-[10px] text-gray-500">
        {note.author.name} • {note.author.role}
      </div>
    </div>
  );
}
