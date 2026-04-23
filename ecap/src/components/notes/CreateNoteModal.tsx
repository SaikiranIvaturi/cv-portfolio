import React, { useState } from "react";
import {
  X,
  FileText,
  AlertCircle,
  CheckCircle,
  Target,
  Lightbulb,
  Pin,
  Tag,
} from "lucide-react";
import {
  Note,
  NoteType,
  NotePriority,
  NoteVisibility,
} from "../../types/notes";
import { useCurrentUser } from "../../hooks/useUsers";

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Partial<Note>) => void;
  linkedCardId?: string;
  linkedCardTitle?: string;
}

export default function CreateNoteModal({
  isOpen,
  onClose,
  onSave,
  linkedCardId,
  linkedCardTitle,
}: CreateNoteModalProps) {
  const { currentUser } = useCurrentUser();
  const [noteType, setNoteType] = useState<NoteType>("global");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<NotePriority>("medium");
  const [visibility, setVisibility] = useState<NoteVisibility>("public");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    const newNote: Partial<Note> = {
      type: noteType,
      title: title.trim(),
      content: content.trim(),
      priority,
      visibility,
      tags,
      pinned: isPinned,
      flash_card_id: linkedCardId,
      flash_card_title: linkedCardTitle,
      author: currentUser
        ? {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role,
            avatar_initials: currentUser.avatar_initials,
            avatar_color: currentUser.avatar_color,
          }
        : {
            id: "user-002",
            name: "Sarah Chen",
            email: "sarah.chen@company.com",
            role: "CFO",
            avatar_initials: "SC",
            avatar_color: "#2861BB",
          },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSave(newNote);
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setNoteType("global");
    setPriority("medium");
    setVisibility("public");
    setTags([]);
    setTagInput("");
    setIsPinned(false);
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const noteTypeOptions: {
    value: NoteType;
    label: string;
    icon: any;
    color: string;
  }[] = [
    {
      value: "executive",
      label: "Executive Summary",
      icon: Lightbulb,
      color: "text-purple-600",
    },
    {
      value: "decision",
      label: "Decision",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      value: "analysis",
      label: "Analysis",
      icon: FileText,
      color: "text-blue-600",
    },
    {
      value: "action_item",
      label: "Action Item",
      icon: Target,
      color: "text-orange-600",
    },
    {
      value: "global",
      label: "General Note",
      icon: FileText,
      color: "text-gray-600",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#231E33]">
              Create New Note
            </h2>
            {linkedCardTitle && (
              <p className="text-sm text-gray-600 mt-1">
                Linked to:{" "}
                <span className="font-semibold text-[#1A3673]">
                  {linkedCardTitle}
                </span>
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Note Type */}
          <div>
            <label className="block text-sm font-semibold text-[#231E33] mb-3">
              Note Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {noteTypeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setNoteType(option.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      noteType === option.value
                        ? "border-[#1A3673] bg-[#F0F4FF]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${option.color} mb-1`} />
                    <div className="text-xs font-semibold text-[#231E33]">
                      {option.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-[#231E33] mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3673] focus:border-transparent"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-[#231E33] mb-2">
              Content or Analyst Note
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter note content... (Spelling suggestions enabled)"
              rows={8}
              spellCheck={true}
              autoCorrect="on"
              autoCapitalize="sentences"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3673] focus:border-transparent resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Tip: Spelling suggestions are enabled. Right-click misspelled
              words for corrections.
            </p>
          </div>

          {/* Priority and Visibility */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#231E33] mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as NotePriority)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3673] focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#231E33] mb-2">
                Visibility
              </label>
              <select
                value={visibility}
                onChange={(e) =>
                  setVisibility(e.target.value as NoteVisibility)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3673] focus:border-transparent"
              >
                <option value="public">Public (All Users)</option>
                <option value="team">Team Only</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-[#231E33] mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                placeholder="Add tag..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3673] focus:border-transparent"
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-2 bg-[#1A3673] text-white rounded-lg hover:bg-[#2861BB] transition-colors"
              >
                <Tag className="w-4 h-4" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#E1EDFF] text-[#1A3673] text-xs font-semibold rounded-full flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Pin Option */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="pin-note"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 text-[#1A3673] border-gray-300 rounded focus:ring-[#1A3673]"
            />
            <label
              htmlFor="pin-note"
              className="text-sm font-semibold text-[#231E33] flex items-center gap-1"
            >
              <Pin className="w-4 h-4" />
              Pin this note to top
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#1A3673] text-white rounded-lg hover:bg-[#2861BB] transition-colors font-semibold"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
