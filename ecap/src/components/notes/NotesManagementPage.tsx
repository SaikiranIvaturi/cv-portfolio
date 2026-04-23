import { useState, useEffect } from "react";
import {
  FileText,
  Pin,
  Search,
  Filter,
  Download,
  Plus,
  Sparkles,
  CheckCircle,
  Target,
  AlertCircle,
  User,
  Clock,
  Tag,
  Link as LinkIcon,
  X,
} from "lucide-react";
import { useAllNotes, saveNoteToBackend } from "../../hooks/useNotesAPI";
import CreateNoteModal from "./CreateNoteModal";
import { Note } from "../../types/notes";

interface ToastNotification {
  type: "success" | "error";
  message: string;
  title: string;
}

const getNoteTypeIcon = (type: string, size: string = "w-4 h-4") => {
  switch (type) {
    case "executive":
      return <Sparkles className={`${size} text-purple-600`} />;
    case "decision":
      return <CheckCircle className={`${size} text-green-600`} />;
    case "analysis":
      return <FileText className={`${size} text-blue-600`} />;
    case "action_item":
      return <Target className={`${size} text-orange-600`} />;
    default:
      return <FileText className={`${size} text-gray-600`} />;
  }
};

const getNoteTypeLabel = (type: string) => {
  return type.replace("_", " ").toUpperCase();
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function NotesManagementPage() {
  const { notes, loading, error, refetch } = useAllNotes();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  const showToast = (
    type: "success" | "error",
    title: string,
    message: string,
  ) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    if (notes && notes.length > 0) {
      setAllNotes(notes);
    }
  }, [notes]);

  const handleSaveNote = async (newNote: Partial<Note>) => {
    try {
      const result = await saveNoteToBackend(newNote);

      if (result.success && result.note) {
        setAllNotes([result.note, ...allNotes]);
        showToast(
          "success",
          "Note Saved",
          "Your note has been saved and will persist across sessions.",
        );
      } else {
        showToast(
          "error",
          "Save Failed",
          result.message || "Unable to save note. Please try again.",
        );
      }
    } catch (error) {
      console.error("Error creating note:", error);
      showToast(
        "error",
        "Error",
        "An unexpected error occurred. Please try again.",
      );
    }
  };

  const filteredNotes = allNotes.filter((note) => {
    const matchesSearch =
      searchQuery === "" ||
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "all" || note.type === filterType;
    const matchesPriority =
      filterPriority === "all" || note.priority === filterPriority;

    return matchesSearch && matchesType && matchesPriority;
  });

  const pinnedNotes = filteredNotes.filter((note) => note.pinned);
  const regularNotes = filteredNotes.filter((note) => !note.pinned);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Notes</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-xl shadow-xl border ${
            toast.type === "success"
              ? "bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200"
              : "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
          } animate-in slide-in-from-right duration-300`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`p-2 rounded-full ${toast.type === "success" ? "bg-emerald-100" : "bg-red-100"}`}
            >
              {toast.type === "success" ? (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <h4
                className={`text-sm font-bold ${toast.type === "success" ? "text-emerald-900" : "text-red-900"}`}
              >
                {toast.title}
              </h4>
              <p
                className={`text-xs mt-0.5 ${toast.type === "success" ? "text-emerald-700" : "text-red-700"}`}
              >
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="p-1 hover:bg-gray-200 rounded-lg"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#1A3673]" />
              Notes & Logs
            </h1>
            <p className="text-xs text-gray-600 mt-0.5">
              Manage global notes, executive communications, and analysis logs
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-[#1A3673] text-white rounded-lg hover:bg-[#2861BB] transition-colors font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Global Note
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes by title, content, or author..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3673] focus:border-transparent"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3673]"
          >
            <option value="all">All Types</option>
            <option value="executive">Executive</option>
            <option value="decision">Decision</option>
            <option value="analysis">Analysis</option>
            <option value="action_item">Action Item</option>
            <option value="global">Global</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3673]"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Pinned Notes */}
      {pinnedNotes.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Pin className="w-4 h-4 text-amber-600" />
            <h2 className="text-sm font-bold text-gray-900">
              Pinned Notes ({pinnedNotes.length})
            </h2>
          </div>
          <div className="space-y-3">
            {pinnedNotes.map((note) => (
              <NoteCard key={note.id} note={note} isPinned />
            ))}
          </div>
        </div>
      )}

      {/* Regular Notes */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-gray-600" />
          <h2 className="text-sm font-bold text-gray-900">
            {filterType !== "all" || filterPriority !== "all" || searchQuery
              ? "Filtered"
              : "All"}{" "}
            Notes ({regularNotes.length})
          </h2>
        </div>

        {regularNotes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FileText className="w-16 h-16 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-600">
              No notes found matching your criteria
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {regularNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>

      {/* Create Note Modal */}
      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveNote}
      />
    </div>
  );
}

function NoteCard({
  note,
  isPinned = false,
}: {
  note: Note;
  isPinned?: boolean;
}) {
  const priorityColors = {
    high: "border-l-red-500",
    medium: "border-l-amber-500",
    low: "border-l-blue-500",
  };

  const priorityBadges = {
    high: "bg-red-100 text-red-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-blue-100 text-blue-700",
  };

  return (
    <div
      className={`bg-white border-l-4 ${priorityColors[note.priority]} rounded-lg shadow-sm hover:shadow-md transition-shadow p-3`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-start gap-2 flex-1">
          {getNoteTypeIcon(note.type, "w-4 h-4")}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="text-[10px] font-bold text-gray-600">
                {getNoteTypeLabel(note.type)}
              </span>
              {isPinned && (
                <span className="flex items-center gap-0.5 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                  <Pin className="w-2.5 h-2.5 fill-amber-700" />
                  Pinned
                </span>
              )}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${priorityBadges[note.priority]}`}
              >
                {note.priority.toUpperCase()}
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-0.5">
              {note.title || note.content.substring(0, 80) + "..."}
            </h3>
            {note.title && (
              <p className="text-xs text-gray-700 leading-relaxed mb-1.5">
                {note.content}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span className="font-medium">{note.author.name}</span>
          <span className="text-gray-400">•</span>
          <span>{note.author.role}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{formatDate(note.created_at)}</span>
        </div>
      </div>

      {/* Linked Flash Card */}
      {note.flash_card_title && (
        <div className="mb-2 p-1.5 bg-blue-50 border border-blue-200 rounded flex items-center gap-1.5">
          <LinkIcon className="w-3 h-3 text-blue-600" />
          <span className="text-xs text-blue-900">
            Linked to:{" "}
            <span className="font-semibold">{note.flash_card_title}</span>
          </span>
        </div>
      )}

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded flex items-center gap-0.5"
            >
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
