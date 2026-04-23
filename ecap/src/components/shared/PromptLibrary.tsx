import React, { useState, useEffect } from "react";
import { API_CONFIG } from "../../config";
import {
  BookOpen,
  Star,
  Clock,
  Search,
  X,
  ChevronRight,
  Copy,
  Heart,
  TrendingUp,
  DollarSign,
  Activity,
  Users,
  MapPin,
  Shield,
  Building,
  Zap,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

interface Prompt {
  id: string;
  category_id: string;
  title: string;
  prompt: string;
  description: string;
  tags: string[];
  use_count: number;
  last_used: string | null;
  is_favorite: boolean;
  expected_response?: string;
}

interface PromptLibraryProps {
  onSelectPrompt: (promptText: string, promptId: string) => void;
  onClose: () => void;
}

const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; className?: string }>
> = {
  DollarSign,
  Activity,
  Users,
  MapPin,
  Shield,
  Building,
  Heart,
  Zap,
  BookOpen,
};

const API_BASE_URL = API_CONFIG.BASE_URL;

export default function PromptLibrary({
  onSelectPrompt,
  onClose,
}: PromptLibraryProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
    loadPrompts();
  }, []);

  useEffect(() => {
    loadPrompts();
  }, [selectedCategory, showFavoritesOnly]);

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/prompts/categories`);
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadPrompts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category_id", selectedCategory);
      if (showFavoritesOnly) params.append("favorites_only", "true");

      const response = await fetch(`${API_BASE_URL}/prompts?${params}`);
      const data = await response.json();
      setPrompts(data.prompts || []);
    } catch (error) {
      console.error("Error loading prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPrompt = async (prompt: Prompt) => {
    try {
      await fetch(`${API_BASE_URL}/prompts/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt_id: prompt.id,
          prompt_text: prompt.prompt,
          session_id: null,
        }),
      });
    } catch (error) {
      console.error("Error logging prompt:", error);
    }

    onSelectPrompt(prompt.prompt, prompt.id);
    onClose();
  };

  const toggleFavorite = async (promptId: string, currentStatus: boolean) => {
    try {
      await fetch(`${API_BASE_URL}/prompts/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt_id: promptId,
          is_favorite: !currentStatus,
        }),
      });
      loadPrompts();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredPrompts = prompts.filter(
    (prompt) =>
      searchQuery === "" ||
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const getCategoryIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || BookOpen;
    return Icon;
  };

  const selectedCategoryData = categories.find(
    (c) => c.id === selectedCategory,
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <BookOpen className="text-blue-600" size={28} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Prompt Library
              </h2>
              <p className="text-sm text-gray-600">
                Choose from {prompts.length} pre-built prompts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="px-6 py-4 border-b border-gray-200 space-y-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search prompts by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                showFavoritesOnly
                  ? "bg-pink-100 text-pink-700 border border-pink-300"
                  : "bg-gray-100 text-gray-700 border border-gray-300"
              }`}
            >
              <Star
                size={16}
                fill={showFavoritesOnly ? "currentColor" : "none"}
              />
              <span className="text-sm font-medium">Favorites Only</span>
            </button>

            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
              >
                <span className="text-sm font-medium">Clear Category</span>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Categories Sidebar */}
          <div className="w-64 border-r border-gray-200 overflow-y-auto bg-gray-50">
            <div className="p-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Categories
              </h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = getCategoryIcon(category.icon);
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? "bg-white shadow-sm border border-gray-200"
                          : "hover:bg-white hover:shadow-sm"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={
                          selectedCategory === category.id
                            ? ""
                            : "text-gray-500"
                        }
                        style={{
                          color:
                            selectedCategory === category.id
                              ? category.color
                              : undefined,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {category.name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {
                            prompts.filter((p) => p.category_id === category.id)
                              .length
                          }{" "}
                          prompts
                        </div>
                      </div>
                      {selectedCategory === category.id && (
                        <ChevronRight size={16} className="text-gray-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Prompts List */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedCategoryData && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {React.createElement(
                    getCategoryIcon(selectedCategoryData.icon),
                    {
                      size: 20,
                      style: { color: selectedCategoryData.color },
                    },
                  )}
                  <h3 className="font-semibold text-gray-900">
                    {selectedCategoryData.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedCategoryData.description}
                </p>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-3 text-gray-600">Loading prompts...</p>
              </div>
            ) : filteredPrompts.length === 0 ? (
              <div className="text-center py-12">
                <Search className="mx-auto text-gray-400 mb-3" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No prompts found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredPrompts.map((prompt) => (
                  <div
                    key={prompt.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all bg-white"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {prompt.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {prompt.description}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(prompt.id, prompt.is_favorite);
                        }}
                        className="ml-2"
                      >
                        <Star
                          size={20}
                          className={
                            prompt.is_favorite
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                          fill={prompt.is_favorite ? "currentColor" : "none"}
                        />
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded p-3 mb-3 border border-gray-200">
                      <p className="text-sm text-gray-700 font-mono">
                        {prompt.prompt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>Used {prompt.use_count} times</span>
                        </div>
                        {prompt.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {prompt.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-gray-200 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(prompt.prompt)}
                          className="p-2 hover:bg-gray-100 rounded transition-colors"
                          title="Copy prompt"
                        >
                          <Copy size={16} className="text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleSelectPrompt(prompt)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Use Prompt
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
