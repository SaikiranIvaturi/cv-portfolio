import { useState, useEffect, useMemo } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  GitBranch,
  Lightbulb,
  Users,
  Activity,
  Stethoscope,
  Copy,
  Check,
  Filter,
  Zap,
  TrendingUp,
  Target,
  AlertTriangle,
} from "lucide-react";
import {
  loadAnalystDecisionTreeData,
  AnalystDecisionTreeData,
  TypeOfService,
  ParentCategory,
  DecisionTreeNode,
} from "../../services/analystDecisionTreeChatResponses";

interface DecisionTreePageV3Props {
  onChatWithDecisionTree?: () => void;
  onNavigate?: (page: string) => void;
}

export default function DecisionTreePageV3({
  onChatWithDecisionTree,
  onNavigate,
}: DecisionTreePageV3Props) {
  const [data, setData] = useState<AnalystDecisionTreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<TypeOfService | null>(
    null,
  );
  const [selectedParentCategory, setSelectedParentCategory] =
    useState<ParentCategory | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"tree" | "list">("tree");

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
      nodes = nodes.filter((n) => n.type_of_service === selectedService.id);
    }

    if (selectedParentCategory) {
      nodes = nodes.filter(
        (n) => n.parent_category === selectedParentCategory.id,
      );
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
  }, [data, selectedService, selectedParentCategory, searchQuery]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "IP":
        return <Activity className="w-5 h-5" />;
      case "OP":
        return <Stethoscope className="w-5 h-5" />;
      case "Phys":
        return <Users className="w-5 h-5" />;
      default:
        return <GitBranch className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "IP":
        return {
          bg: "bg-blue-500",
          text: "text-blue-700",
          border: "border-blue-300",
          light: "bg-blue-50",
        };
      case "OP":
        return {
          bg: "bg-green-500",
          text: "text-green-700",
          border: "border-green-300",
          light: "bg-green-50",
        };
      case "Phys":
        return {
          bg: "bg-purple-500",
          text: "text-purple-700",
          border: "border-purple-300",
          light: "bg-purple-50",
        };
      default:
        return {
          bg: "bg-gray-500",
          text: "text-gray-700",
          border: "border-gray-300",
          light: "bg-gray-50",
        };
    }
  };

  const getParentCategoryIcon = (categoryId: string) => {
    const icons: Record<string, any> = {
      P1: <Users className="w-4 h-4" />,
      P2: <Target className="w-4 h-4" />,
      P3: <Activity className="w-4 h-4" />,
      P4: <Zap className="w-4 h-4" />,
      P5: <TrendingUp className="w-4 h-4" />,
      P6: <AlertTriangle className="w-4 h-4" />,
    };
    return icons[categoryId] || <Lightbulb className="w-4 h-4" />;
  };

  const getParentCategoryColor = (categoryId: string) => {
    const colors: Record<string, string> = {
      P1: "from-blue-500 to-blue-600",
      P2: "from-green-500 to-green-600",
      P3: "from-purple-500 to-purple-600",
      P4: "from-orange-500 to-orange-600",
      P5: "from-pink-500 to-pink-600",
      P6: "from-indigo-500 to-indigo-600",
    };
    return colors[categoryId] || "from-gray-500 to-gray-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <GitBranch className="w-8 h-8 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-gray-700 font-medium">Loading Decision Tree...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700 font-medium">
            Failed to load Decision Tree
          </p>
        </div>
      </div>
    );
  }

  const parentNodes = filteredNodes.filter((n) => n.is_parent);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="px-8 py-6">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <GitBranch className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Analyst Decision Tree
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  AI-powered variance analysis guidance for healthcare cost
                  optimization
                </p>
              </div>
            </div>
            <button
              onClick={handleOpenChat}
              className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
            >
              <MessageSquare className="w-5 h-5" />
              <div className="text-left">
                <div className="font-semibold text-sm">Chat Assistant</div>
                <div className="text-xs opacity-90">Ask AI anything</div>
              </div>
            </button>
          </div>

          {/* Search and Filters Row */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions, reasons, or programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={() => setViewMode(viewMode === "tree" ? "list" : "tree")}
              className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-2 font-medium"
            >
              <Filter className="w-5 h-5" />
              {viewMode === "tree" ? "Tree View" : "List View"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex gap-6 p-8">
          {/* Left Sidebar - Service & Category Selection */}
          <div className="w-80 flex flex-col gap-4 overflow-y-auto">
            {/* Type of Service Cards */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
                Type of Service
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedService(null)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    !selectedService
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="font-semibold">All Services</div>
                  <div className="text-xs opacity-80">
                    {data.type_of_service.length} total
                  </div>
                </button>

                {/* IP Services */}
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-blue-600 px-2 py-1">
                    INPATIENT
                  </div>
                  {data.type_of_service
                    .filter((s) => s.category === "IP")
                    .map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 ${
                          selectedService?.id === service.id
                            ? "bg-blue-100 border-2 border-blue-500 text-blue-900"
                            : "bg-gray-50 hover:bg-blue-50 text-gray-700 border-2 border-transparent"
                        }`}
                      >
                        <Activity className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {service.name}
                          </div>
                          <div className="text-xs opacity-70">
                            {service.hcc_code}
                          </div>
                        </div>
                      </button>
                    ))}
                </div>

                {/* OP Services */}
                <div className="space-y-1 mt-3">
                  <div className="text-xs font-semibold text-green-600 px-2 py-1">
                    OUTPATIENT
                  </div>
                  {data.type_of_service
                    .filter((s) => s.category === "OP")
                    .slice(0, 5)
                    .map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 ${
                          selectedService?.id === service.id
                            ? "bg-green-100 border-2 border-green-500 text-green-900"
                            : "bg-gray-50 hover:bg-green-50 text-gray-700 border-2 border-transparent"
                        }`}
                      >
                        <Stethoscope className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {service.name}
                          </div>
                          <div className="text-xs opacity-70">
                            {service.hcc_code}
                          </div>
                        </div>
                      </button>
                    ))}
                </div>

                {/* Phys Services */}
                <div className="space-y-1 mt-3">
                  <div className="text-xs font-semibold text-purple-600 px-2 py-1">
                    PHYSICIAN
                  </div>
                  {data.type_of_service
                    .filter((s) => s.category === "Phys")
                    .map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`w-full text-left px-4 py-2.5 rounded-lg transition-all flex items-center gap-3 ${
                          selectedService?.id === service.id
                            ? "bg-purple-100 border-2 border-purple-500 text-purple-900"
                            : "bg-gray-50 hover:bg-purple-50 text-gray-700 border-2 border-transparent"
                        }`}
                      >
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {service.name}
                          </div>
                          <div className="text-xs opacity-70">
                            {service.hcc_code}
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Parent Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">
                Analysis Category
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedParentCategory(null)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    !selectedParentCategory
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <div className="font-semibold">All Categories</div>
                  <div className="text-xs opacity-80">
                    {data.parent_categories.length} total
                  </div>
                </button>

                {data.parent_categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedParentCategory(category)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      selectedParentCategory?.id === category.id
                        ? "bg-gradient-to-r " +
                          getParentCategoryColor(category.id) +
                          " text-white shadow-md"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getParentCategoryIcon(category.id)}
                      <div className="flex-1">
                        <div className="font-semibold text-sm">
                          {category.name}
                        </div>
                        <div className="text-xs opacity-80 line-clamp-1">
                          {category.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Tree View */}
          <div className="flex-1 overflow-y-auto">
            {parentNodes.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No questions found</p>
                  <p className="text-gray-400 text-sm">
                    Try adjusting your filters or search
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 pb-8">
                {parentNodes.map((parentNode, parentIdx) => {
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
                  const colors = service
                    ? getCategoryColor(service.category)
                    : getCategoryColor("IP");

                  return (
                    <div key={parentNode.id} className="relative">
                      {/* Parent Node Card */}
                      <div
                        className={`bg-white rounded-2xl shadow-lg border-2 ${colors.border} overflow-hidden hover:shadow-xl transition-all group`}
                      >
                        {/* Card Header */}
                        <div
                          className={`${colors.light} border-b-2 ${colors.border} px-6 py-4`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div
                                className={`p-3 ${colors.bg} rounded-xl text-white shadow-md`}
                              >
                                {service && getCategoryIcon(service.category)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getParentCategoryColor(parentNode.parent_category)} text-white shadow-sm`}
                                  >
                                    {category?.name ||
                                      parentNode.parent_category}
                                  </span>
                                  {service && (
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-white border-2 border-gray-200 text-gray-700">
                                      {service.name}
                                    </span>
                                  )}
                                </div>
                                <h3
                                  className={`text-lg font-bold ${colors.text} mb-1`}
                                >
                                  {parentNode.research_question}
                                </h3>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  handleCopyQuestion(
                                    parentNode.research_question,
                                    parentNode.id,
                                  )
                                }
                                className="p-2 hover:bg-white rounded-lg transition-all"
                                title="Copy question"
                              >
                                {copiedQuestionId === parentNode.id ? (
                                  <Check className="w-5 h-5 text-green-600" />
                                ) : (
                                  <Copy className="w-5 h-5 text-gray-600" />
                                )}
                              </button>
                              {childNodes.length > 0 && (
                                <button
                                  onClick={() => toggleNode(parentNode.id)}
                                  className="p-2 hover:bg-white rounded-lg transition-all"
                                >
                                  {isExpanded ? (
                                    <ChevronDown className="w-6 h-6 text-gray-700" />
                                  ) : (
                                    <ChevronRight className="w-6 h-6 text-gray-700" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="px-6 py-5">
                          <div className="space-y-4">
                            <div>
                              <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                Analysis Reason
                              </div>
                              <p className="text-gray-700 leading-relaxed">
                                {parentNode.reason}
                              </p>
                            </div>

                            {parentNode.suggested_program && (
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                  <Lightbulb className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <div className="text-xs font-bold text-green-700 uppercase tracking-wide mb-1">
                                      Suggested Program
                                    </div>
                                    <p className="text-green-800 font-medium">
                                      {parentNode.suggested_program}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {childNodes.length > 0 && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <GitBranch className="w-4 h-4" />
                                <span className="font-medium">
                                  {childNodes.length} follow-up questions
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Child Nodes - Tree Branches */}
                      {isExpanded && childNodes.length > 0 && (
                        <div className="ml-12 mt-4 space-y-4 relative">
                          {/* Vertical Line */}
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-transparent"></div>

                          {childNodes.map((childNode, childIdx) => (
                            <div key={childNode.id} className="relative pl-8">
                              {/* Horizontal Branch Line */}
                              <div className="absolute left-0 top-6 w-8 h-0.5 bg-gray-300"></div>

                              <div className="bg-white rounded-xl shadow-md border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all group">
                                <div className="px-5 py-4">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-700">
                                          Follow-up {childIdx + 1}
                                        </span>
                                      </div>
                                      <h4 className="font-bold text-gray-900 mb-2">
                                        {childNode.research_question}
                                      </h4>
                                      <p className="text-sm text-gray-600 mb-3">
                                        <span className="font-semibold">
                                          Reason:
                                        </span>{" "}
                                        {childNode.reason}
                                      </p>
                                      {childNode.suggested_program && (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                          <p className="text-sm text-green-800">
                                            <span className="font-semibold">
                                              Program:
                                            </span>{" "}
                                            {childNode.suggested_program}
                                          </p>
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
                                      className="p-2 hover:bg-gray-100 rounded-lg transition-all flex-shrink-0"
                                      title="Copy question"
                                    >
                                      {copiedQuestionId === childNode.id ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                      ) : (
                                        <Copy className="w-4 h-4 text-gray-600" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
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
    </div>
  );
}
