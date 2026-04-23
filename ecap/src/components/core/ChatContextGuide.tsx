import {
  MessageCircle,
  Brain,
  History,
  Layers,
  Sparkles,
  X,
} from "lucide-react";

interface ChatContextGuideProps {
  onClose: () => void;
}

export default function ChatContextGuide({ onClose }: ChatContextGuideProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-[#1A3673] to-[#2861BB] text-white p-5 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                Chat about Auto Detected Insights
              </h2>
              <p className="text-sm opacity-90">
                How context-aware conversations work
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gradient-to-r from-[#E1EDFF] to-[#E3F4FD] rounded-lg p-5 border border-[#44B8F3]">
            <h3 className="text-lg font-bold text-[#231E33] mb-2">
              What is Chat about Insight?
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              When you click <strong>"Chat about Insight"</strong> on any
              Auto-Detected Insight, the Universal Chat enters a{" "}
              <strong>focused conversation mode</strong> where it understands
              the complete context of that specific Insight. It's like having a
              subject-matter expert who has already studied all the details of
              that particular anomaly, trend, or insight.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#231E33] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1A3673]" />
              How It Works
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <div className="bg-[#1A3673] w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-sm text-[#231E33] mb-2">
                  1. Context Capture
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  When you start a chat with a Flash Card, the system captures:
                </p>
                <ul className="mt-2 space-y-1 text-xs text-gray-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#00BBBA] mt-0.5">•</span>
                    <span>Flash Card title, category, and priority</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#00BBBA] mt-0.5">•</span>
                    <span>All metrics, trends, and data points</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#00BBBA] mt-0.5">•</span>
                    <span>Insights and recommendations</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#00BBBA] mt-0.5">•</span>
                    <span>Line of business and market information</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <div className="bg-[#44B8F3] w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-sm text-[#231E33] mb-2">
                  2. Intelligent Memory
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  The Universal Chat remembers everything about this Insight:
                </p>
                <ul className="mt-2 space-y-1 text-xs text-gray-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#00BBBA] mt-0.5">•</span>
                    <span>All your questions and the agent's responses</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#00BBBA] mt-0.5">•</span>
                    <span>Follow-up questions maintain full context</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#00BBBA] mt-0.5">•</span>
                    <span>Conversation history stays with the Flash Card</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#00BBBA] mt-0.5">•</span>
                    <span>Context persists across sessions</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <div className="bg-[#00BBBA] w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-sm text-[#231E33] mb-2">
                  3. Multiple Card Contexts
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  You can chat with multiple Insights simultaneously:
                </p>
                <ul className="mt-2 space-y-1 text-xs text-gray-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#00BBBA] mt-0.5">•</span>
                    <span>Each Flash Card has its own conversation thread</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#00BBBA] mt-0.5">•</span>
                    <span>
                      Switch between card chats without losing context
                    </span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#00BBBA] mt-0.5">•</span>
                    <span>All conversations are saved and retrievable</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#00BBBA] mt-0.5">•</span>
                    <span>Compare insights across different cards</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
                <div className="bg-[#E3725F] w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                  <History className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-sm text-[#231E33] mb-2">
                  4. Session Management
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Smart session handling keeps your work organized:
                </p>
                <ul className="mt-2 space-y-1 text-xs text-gray-600">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#00BBBA] mt-0.5">•</span>
                    <span>Active chat sessions shown in chat panel</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#00BBBA] mt-0.5">•</span>
                    <span>Resume any previous conversation instantly</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#00BBBA] mt-0.5">•</span>
                    <span>Close chats when done, reopen anytime</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#00BBBA] mt-0.5">•</span>
                    <span>All chat history saved to your profile</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-5">
            <h3 className="text-sm font-bold text-[#231E33] mb-3">
              📚 Example Use Case: Similar to NotebookLM
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-start gap-2 mb-2">
                  <div className="bg-[#1A3673] text-white text-xs font-bold px-2 py-0.5 rounded">
                    Step 1
                  </div>
                  <p className="text-xs text-gray-700 flex-1">
                    <strong>You see a Flash Card:</strong> "IP Med Surg costs
                    trending up 15% in California Medicare"
                  </p>
                </div>
                <div className="flex items-start gap-2 mb-2">
                  <div className="bg-[#44B8F3] text-white text-xs font-bold px-2 py-0.5 rounded">
                    Step 2
                  </div>
                  <p className="text-xs text-gray-700 flex-1">
                    <strong>You click "Chat about Insight":</strong> The agent
                    instantly knows all context about this specific cost trend
                  </p>
                </div>
                <div className="flex items-start gap-2 mb-2">
                  <div className="bg-[#00BBBA] text-white text-xs font-bold px-2 py-0.5 rounded">
                    Step 3
                  </div>
                  <p className="text-xs text-gray-700 flex-1">
                    <strong>You ask:</strong> "Why is this happening?"
                  </p>
                </div>
                <div className="flex items-start gap-2 mb-2">
                  <div className="bg-[#E3725F] text-white text-xs font-bold px-2 py-0.5 rounded">
                    Step 4
                  </div>
                  <p className="text-xs text-gray-700 flex-1">
                    <strong>Agent responds</strong> with specific analysis about
                    California Medicare IP Med Surg, not generic information
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                    Step 5
                  </div>
                  <p className="text-xs text-gray-700 flex-1">
                    <strong>Follow-up:</strong> "What providers are driving
                    this?" - Agent remembers we're talking about CA Medicare IP
                    Med Surg
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-bold text-yellow-900 mb-2">
              ⚠️ Important Notes
            </h3>
            <ul className="space-y-1.5 text-xs text-yellow-800">
              <li className="flex items-start gap-1.5">
                <span className="font-bold mt-0.5">•</span>
                <span>
                  <strong>Context Isolation:</strong> Each Flash Card
                  conversation is completely separate. Questions about Card A
                  won't affect Card B.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold mt-0.5">•</span>
                <span>
                  <strong>Persistent Memory:</strong> Your conversations are
                  saved. You can return to any Flash Card chat days later and
                  continue.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold mt-0.5">•</span>
                <span>
                  <strong>Smart Context:</strong> The agent understands when you
                  reference "this trend," "these costs," or "the providers" - it
                  knows you mean the current Flash Card.
                </span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold mt-0.5">•</span>
                <span>
                  <strong>Multi-Card Analysis:</strong> While each conversation
                  is isolated, you can ask the agent to compare multiple
                  Insights if needed.
                </span>
              </li>
            </ul>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-[#1A3673] to-[#2861BB] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Got It!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
