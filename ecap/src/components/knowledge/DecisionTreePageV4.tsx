import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  GitBranch,
  Copy,
  Check,
} from "lucide-react";
import {
  loadAnalystDecisionTreeData,
  AnalystDecisionTreeData,
  TypeOfService,
  ParentCategory,
  DecisionTreeNode,
} from "../../services/analystDecisionTreeChatResponses";

interface DecisionTreePageV4Props {
  onChatWithDecisionTree?: () => void;
  onNavigate?: (page: string) => void;
}

export default function DecisionTreePageV4({
  onChatWithDecisionTree,
  onNavigate,
}: DecisionTreePageV4Props) {
  const [data, setData] = useState<AnalystDecisionTreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);

  useEffect(() => {
    loadAnalystDecisionTreeData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleOpenChat = () => {
    if (onNavigate) {
      onNavigate("chat");
    }
    if (onChatWithDecisionTree) {
      onChatWithDecisionTree();
    }
  };

  const handleCopyQuestion = (question: string, nodeId: string) => {
    navigator.clipboard.writeText(question);
    setCopiedQuestionId(nodeId);
    setTimeout(() => setCopiedQuestionId(null), 2000);
  };

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const filteredNodes = useMemo(() => {
    if (!data) return [];

    let nodes = data.nodes;

    if (selectedService) {
      nodes = nodes.filter((n) => n.type_of_service === selectedService);
    }

    if (selectedCategory) {
      nodes = nodes.filter((n) => n.parent_category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      nodes = nodes.filter(
        (n) =>
          n.research_question.toLowerCase().includes(query) ||
          n.reason.toLowerCase().includes(query) ||
          (n.suggested_program &&
            n.suggested_program.toLowerCase().includes(query)),
      );
    }

    return nodes;
  }, [data, selectedService, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#1A3673] mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Decision Tree...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Failed to load Decision Tree</p>
      </div>
    );
  }

  const parentNodes = filteredNodes.filter((n) => n.is_parent);
  const serviceCategories = ["IP", "OP", "Phys"];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1A3673] rounded-lg">
                <GitBranch className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Analyst Decision Tree
                </h1>
                <p className="text-xs text-gray-500">
                  AI-powered variance analysis guidance
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenChat}
              className="flex items-center gap-2 px-4 py-2 bg-[#1A3673] hover:bg-[#2861BB] text-white rounded-lg transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium text-sm">Chat Assistant</span>
            </button>
          </div>
        </div>
      </div>

      {/* Compact Filters Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3673] focus:border-transparent"
              />
            </div>

            {/* Service Type Filter */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedService(null)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  !selectedService
                    ? "bg-[#1A3673] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {serviceCategories.map((cat) => {
                const count = data.type_of_service.filter(
                  (s) => s.category === cat,
                ).length;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      const firstService = data.type_of_service.find(
                        (s) => s.category === cat,
                      );
                      setSelectedService(firstService?.id || null);
                    }}
                    className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                      data.type_of_service.find((s) => s.id === selectedService)
                        ?.category === cat
                        ? "bg-[#1A3673] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-3 py-2 text-xs font-medium border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1A3673] focus:border-transparent"
            >
              <option value="">All Categories</option>
              {data.parent_categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content - Compact Accordion */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-4">
          {parentNodes.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No questions found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {parentNodes.map((parentNode) => {
                const childNodes = filteredNodes.filter(
                  (n) => n.parent_node_id === parentNode.id,
                );
                const isExpanded = expandedNodes.has(parentNode.id);
                const category = data.parent_categories.find(
                  (c) => c.id === parentNode.parent_category,
                );
                const service = data.type_of_service.find(
                  (s) => s.id === parentNode.type_of_service,
                );

                return (
                  <div
                    key={parentNode.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-[#1A3673] transition-colors"
                  >
                    {/* Parent Question - Compact Row */}
                    <div className="flex items-center gap-3 px-4 py-3">
                      {/* Expand Button */}
                      {childNodes.length > 0 && (
                        <button
                          onClick={() => toggleNode(parentNode.id)}
                          className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                      )}
                      {!childNodes.length && <div className="w-6"></div>}

                      {/* Question Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-[#1A3673] text-white text-[10px] font-semibold rounded">
                            {category?.name || parentNode.parent_category}
                          </span>
                          {service && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-medium rounded">
                              {service.name}
                            </span>
                          )}
                          {childNodes.length > 0 && (
                            <span className="text-[10px] text-gray-500">
                              {childNodes.length} follow-up
                              {childNodes.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {parentNode.research_question}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-1">
                          {parentNode.reason}
                        </p>
                        {parentNode.suggested_program && (
                          <div className="mt-1 flex items-center gap-1">
                            <span className="text-[10px] font-semibold text-green-700">
                              Program:
                            </span>
                            <span className="text-[10px] text-green-600">
                              {parentNode.suggested_program}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Copy Button */}
                      <button
                        onClick={() =>
                          handleCopyQuestion(
                            parentNode.research_question,
                            parentNode.id,
                          )
                        }
                        className="flex-shrink-0 p-2 hover:bg-gray-100 rounded transition-colors"
                        title="Copy question"
                      >
                        {copiedQuestionId === parentNode.id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>

                    {/* Child Questions - Expanded */}
                    {isExpanded && childNodes.length > 0 && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        {childNodes.map((childNode, idx) => (
                          <div
                            key={childNode.id}
                            className={`flex items-start gap-3 px-4 py-3 ${
                              idx !== childNodes.length - 1
                                ? "border-b border-gray-200"
                                : ""
                            }`}
                          >
                            <div className="flex-shrink-0 w-6 pt-1">
                              <div className="w-4 h-4 rounded-full bg-[#1A3673] text-white text-[10px] font-bold flex items-center justify-center">
                                {idx + 1}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 mb-1">
                                {childNode.research_question}
                              </h4>
                              <p className="text-xs text-gray-600 mb-1">
                                {childNode.reason}
                              </p>
                              {childNode.suggested_program && (
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] font-semibold text-green-700">
                                    Program:
                                  </span>
                                  <span className="text-[10px] text-green-600">
                                    {childNode.suggested_program}
                                  </span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                handleCopyQuestion(
                                  childNode.research_question,
                                  childNode.id,
                                )
                              }
                              className="flex-shrink-0 p-2 hover:bg-gray-200 rounded transition-colors"
                              title="Copy question"
                            >
                              {copiedQuestionId === childNode.id ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
