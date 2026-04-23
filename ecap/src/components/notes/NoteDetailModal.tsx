import {
  X,
  FileText,
  Pin,
  Sparkles,
  CheckCircle,
  Target,
  User,
  Clock,
  Tag,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";
import { Note } from "../../types/notes";

interface NoteDetailModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  onViewAllNotes?: () => void;
}

const getNoteTypeIcon = (type: string) => {
  switch (type) {
    case "executive":
      return <Sparkles className="w-6 h-6 text-purple-600" />;
    case "decision":
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    case "analysis":
      return <FileText className="w-6 h-6 text-blue-600" />;
    case "action_item":
      return <Target className="w-6 h-6 text-orange-600" />;
    default:
      return <FileText className="w-6 h-6 text-gray-600" />;
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

const priorityColors = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
  critical: "bg-purple-100 text-purple-700 border-purple-200",
};

const priorityBorderColors = {
  high: "border-l-red-500",
  medium: "border-l-amber-500",
  low: "border-l-blue-500",
  critical: "border-l-purple-500",
};

export default function NoteDetailModal({
  note,
  isOpen,
  onClose,
  onViewAllNotes,
}: NoteDetailModalProps) {
  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div
          className={`border-l-4 ${priorityBorderColors[note.priority]} bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {getNoteTypeIcon(note.type)}
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-bold text-gray-600">
                    {getNoteTypeLabel(note.type)}
                  </span>
                  {note.pinned && (
                    <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                      <Pin className="w-3 h-3 fill-amber-700" />
                      Pinned
                    </span>
                  )}
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-semibold border ${priorityColors[note.priority]}`}
                  >
                    {note.priority.toUpperCase()}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#231E33]">
                  {note.title || note.content.substring(0, 60) + "..."}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Note Content */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {note.content}
            </p>
          </div>

          {/* Linked Flash Card */}
          {note.flash_card_title && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-blue-600" />
              <div>
                <span className="text-xs text-blue-600 font-semibold">
                  LINKED INSIGHT
                </span>
                <p className="text-sm text-blue-900 font-semibold">
                  {note.flash_card_title}
                </p>
              </div>
            </div>
          )}

          {/* Author & Metadata */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style={{
                    backgroundColor: note.author.avatar_color || "#1A3673",
                  }}
                >
                  {note.author.avatar_initials ||
                    note.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                </div>
                <div>
                  <p className="font-semibold text-[#231E33]">
                    {note.author.name}
                  </p>
                  <p className="text-xs text-gray-600">{note.author.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{formatDate(note.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-600 mb-2">TAGS</p>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full flex items-center gap-1"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Expiration */}
          {note.expires_at && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <div>
                <span className="text-xs text-amber-600 font-semibold">
                  EXPIRES
                </span>
                <p className="text-sm text-amber-900">
                  {formatDate(note.expires_at)}
                </p>
              </div>
            </div>
          )}

          {/* Attachments */}
          {note.attachments && note.attachments.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 mb-2">
                ATTACHMENTS
              </p>
              <div className="space-y-2">
                {note.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {attachment.filename}
                    </span>
                    <span className="text-xs text-gray-500 ml-auto">
                      {(attachment.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onViewAllNotes}
            className="text-sm text-[#1A3673] hover:text-[#2861BB] font-semibold transition-colors"
          >
            View All Notes →
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1A3673] text-white rounded-lg hover:bg-[#2861BB] transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
