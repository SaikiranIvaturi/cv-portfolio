import { useState, useEffect } from "react";
import {
  AlertCircle,
  TrendingUp,
  Activity,
  MessageCircle,
  Star,
  Lock,
  Share2,
  X,
  Heart,
  Database,
} from "lucide-react";
import { FlashCard as FlashCardType, FlashCardLock } from "../../types";
import {
  getFlashCardCollaborationData,
  rateFlashCard,
  lockFlashCard,
  unlockFlashCard,
  shareFlashCard,
  getMockUser,
} from "../../services/collaborationStorage";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8001/api";

interface FlashCardProps {
  card: FlashCardType;
  onClick: () => void;
  onAskAI?: (e: React.MouseEvent) => void;
  onCloseChat?: () => void;
  showCollaboration?: boolean;
  onFavoriteToggle?: () => void;
}

export default function FlashCard({
  card,
  onClick,
  onAskAI,
  onCloseChat,
  showCollaboration = false,
  onFavoriteToggle,
}: FlashCardProps) {
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [currentLock, setCurrentLock] = useState<FlashCardLock | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(card.is_favorite || false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareMessage, setShareMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const currentUserEmail = getMockUser().email;

  useEffect(() => {
    if (showCollaboration) {
      loadCollaborationData();
    }
  }, [card.id, showCollaboration]);

  const loadCollaborationData = async () => {
    try {
      const data = await getFlashCardCollaborationData(card.id);
      setAverageRating(data.averageRating);
      setRatingCount(data.ratingCount);
      setUserRating(data.userRating || 0);
      setCurrentLock(data.currentLock);
      setIsLocked(!!data.currentLock);
    } catch (error) {
      console.error("Error loading collaboration data:", error);
    }
  };

  const handleRate = async (rating: number) => {
    try {
      setIsLoading(true);
      await rateFlashCard(card.id, rating);
      setUserRating(rating);
      await loadCollaborationData();
    } catch (error) {
      console.error("Error rating card:", error);
      alert("Failed to rate card");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/flash-cards/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          flashcard_id: card.id,
          is_favorite: !isFavorite,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setIsFavorite(!isFavorite);
        if (onFavoriteToggle) {
          onFavoriteToggle();
        }
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLock = async () => {
    try {
      setIsLoading(true);
      if (isLocked && currentLock?.user_email === currentUserEmail) {
        await unlockFlashCard(card.id);
        setIsLocked(false);
        setCurrentLock(null);
      } else if (!isLocked) {
        const lock = await lockFlashCard(card.id);
        setIsLocked(true);
        setCurrentLock(lock);
      }
    } catch (error: any) {
      console.error("Error toggling lock:", error);
      alert(error.message || "Failed to toggle lock");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!shareEmail.trim()) {
      alert("Please enter an email address");
      return;
    }

    try {
      setIsLoading(true);
      await shareFlashCard(card.id, shareEmail, shareMessage);
      setShowShareDialog(false);
      setShareEmail("");
      setShareMessage("");
      alert("Flash card shared successfully!");
    } catch (error) {
      console.error("Error sharing card:", error);
      alert("Flash card shared successfully!");
    } finally {
      setIsLoading(false);
    }
  };

  const isLockedByOther =
    isLocked && currentLock?.user_email !== currentUserEmail;

  const priorityColors = {
    high: "border-l-[#E3725F]",
    medium: "border-l-amber-500",
    low: "border-l-[#00BBBA]",
  };

  const priorityBg = {
    high: "bg-[#FBEAE7]",
    medium: "bg-amber-50",
    low: "bg-[#D9F5F5]",
  };

  const priorityBadgeColors = {
    high: "bg-[#E3725F] text-white",
    medium: "bg-amber-500 text-white",
    low: "bg-[#00BBBA] text-white",
  };

  const Icon =
    card.category.toLowerCase().includes("cost") ||
    card.category.toLowerCase().includes("financial")
      ? TrendingUp
      : card.category.toLowerCase().includes("utilization")
        ? Activity
        : AlertCircle;

  const isRealData = card.data_source === "production";

  return (
    <div
      onClick={onClick}
      className={`relative bg-white ${isRealData ? "border-l-4 bg-gradient-to-r from-emerald-50/30 via-white to-white" : "border-l-4"} ${isRealData ? "border-l-emerald-500" : priorityColors[card.priority]} rounded-lg p-4 shadow-sm hover:shadow-md transition-all ${onClick ? "cursor-pointer" : ""} border border-gray-200 ${onAskAI ? "pb-16" : ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1">
          <h3 className="font-semibold text-[#231E33] text-base">
            {card.category} - {card.line_of_business}
          </h3>
        </div>
        <div className="text-right ml-3">
          {showCollaboration && !onCloseChat && (
            <div className="flex gap-1 mt-2 justify-end">
              <button
                onClick={handleToggleFavorite}
                className={`p-1.5 rounded transition-colors ${
                  isFavorite
                    ? "bg-red-100 hover:bg-red-200 text-red-600"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                }`}
                title={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
                disabled={isLoading}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`}
                />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLock();
                }}
                className={`p-1.5 rounded transition-colors ${
                  isLocked && currentLock?.user_email === currentUserEmail
                    ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-700"
                    : "bg-green-50 hover:bg-green-100 text-green-700"
                }`}
                disabled={isLoading || isLockedByOther}
                title={
                  isLockedByOther
                    ? `Locked by ${currentLock?.user_email}`
                    : isLocked
                      ? "Unlock"
                      : "Lock"
                }
              >
                <Lock className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowShareDialog(true);
                }}
                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition-colors"
                title="Share"
                disabled={isLoading}
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="bg-[#E1EDFF] rounded-lg p-2.5">
          <div className="text-xs text-gray-600 mb-0.5">
            {card.metric_label}
          </div>
          <div className="text-lg font-semibold text-[#1A3673]">
            {card.metric_value}
          </div>
        </div>

        <div className="bg-[#E1EDFF] rounded-lg p-2.5">
          <div className="text-xs text-gray-600 mb-0.5">{card.trend_label}</div>
          <div className="text-lg font-semibold text-[#1A3673]">
            {card.trend}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3 text-[#E3725F]" />
          </div>
        </div>

        <div className="bg-[#E1EDFF] rounded-lg p-2.5">
          {card.category === "Inpatient Authorization" ||
          card.category === "Outpatient Authorization" ? (
            <>
              <div className="text-xs text-gray-600 mb-0.5">Auth Claim CNT</div>
              <div className="text-sm font-medium text-[#1A3673] mt-1">
                {card.kpis?.auth_claim_count ||
                  card.time_series?.rolling_3?.auth_claim_count ||
                  "N/A"}
              </div>
            </>
          ) : (
            <>
              <div className="text-xs text-gray-600 mb-0.5">Updated</div>
              <div className="text-sm font-medium text-[#1A3673] mt-1">
                {new Date(card.updated_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-2">
        <p className="text-xs text-gray-700 leading-relaxed">
          {card.description}
        </p>
      </div>

      {card.insights && card.insights.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-3 mb-2">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">
            Key Insights:
          </h4>
          <ul className="space-y-1.5">
            {card.insights.map((insight, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs text-gray-700"
              >
                <span className="text-[#00BBBA] mt-0.5 flex-shrink-0">•</span>
                <span className="leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Rating Display - Left Bottom */}
      {showCollaboration && !onCloseChat && (
        <div
          className="absolute bottom-3 left-3 flex items-center gap-1 bg-white border-2 border-[#1A3673] px-3 py-2 rounded-lg shadow-lg z-50"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleRate(star);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="hover:scale-125 transition-transform cursor-pointer p-0.5"
              disabled={isLoading}
              title={`Rate ${star} star${star > 1 ? "s" : ""}`}
              type="button"
            >
              <Star
                className={`w-5 h-5 ${
                  star <= userRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 hover:text-yellow-400"
                }`}
              />
            </button>
          ))}
          {userRating > 0 && (
            <span className="text-sm font-bold text-[#1A3673] ml-2">
              {userRating}.0
            </span>
          )}
        </div>
      )}

      {/* Lock Status - Bottom Middle */}
      {showCollaboration && isLocked && !onCloseChat && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-amber-50 border border-amber-300 px-3 py-1 rounded-full z-10">
          <Lock className="w-3 h-3 text-amber-700" />
          <span className="text-xs font-bold text-amber-700">
            Locked by{" "}
            {currentLock?.user_email === currentUserEmail
              ? "You"
              : currentLock?.user_email?.split("@")[0]}
          </span>
        </div>
      )}

      {/* AI Chat Button - Right Bottom */}
      {onAskAI && (
        <div className="absolute bottom-3 right-3 flex items-center gap-2">
          {isRealData && (
            <span className="px-2 py-1 text-xs font-semibold rounded bg-gradient-to-r from-emerald-500 to-teal-500 text-white uppercase flex items-center gap-1">
              REAL DATA
            </span>
          )}
          {onCloseChat && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCloseChat();
              }}
              className="p-2.5 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-all hover:scale-110 shadow-md z-10"
              title="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onAskAI}
            className="p-2.5 bg-gradient-to-r from-[#1A3673] to-[#2861BB] text-white rounded-full hover:shadow-lg transition-all hover:scale-110 shadow-md z-10"
            title="Ask AI Assistant"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {showShareDialog && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowShareDialog(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-[#231E33] mb-4">
              Share Flash Card
            </h3>
            <p className="text-sm text-gray-600 mb-4">{card.title}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3673]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message (optional)
                </label>
                <textarea
                  value={shareMessage}
                  onChange={(e) => setShareMessage(e.target.value)}
                  placeholder="Add a note..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A3673]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-[#1A3673] hover:bg-[#2861BB] text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? "Sharing..." : "Share"}
                </button>
                <button
                  onClick={() => setShowShareDialog(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
