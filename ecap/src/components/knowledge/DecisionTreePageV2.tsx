import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  GitBranch,
  Lightbulb,
  TrendingUp,
  Users,
  Activity,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
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

interface DecisionTreePageV2Props {
  onChatWithDecisionTree?: () => void;
  onNavigate?: (page: string) => void;
}
W;
export default function DecisionTreePageV2({
  onChatWithDecisionTree,
  onNavigate,
}: DecisionTreePageV2Props) {
  const [data, setData] = useState<AnalystDecisionTreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | "IP" | "OP" | "Phys"
  >("All");
  const [selectedParentCategory, setSelectedParentCategory] =
    useState<string>("All");
  const [expandedServices, setExpandedServices] = useState<Set<string>>(
    new Set(),
  );
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<DecisionTreeNode | null>(
    null,
  );
  const [copiedQuestionId, setCopiedQuestionId] = useState<string | null>(null);

  useEffect(() => {
    loadAnalystDecisionTreeData()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredServices = useMemo(() => {
    if (!data) return [];

    let services = data.type_of_service;

    if (selectedCategory !== "All") {
      services = services.filter((s) => s.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      services = services.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.hcc_code.toLowerCase().includes(query),
      );
    }

    return services;
  }, [data, selectedCategory, searchQuery]);

  const getNodesForService = (serviceId: string) => {
    if (!data) return [];

    let nodes = data.nodes.filter((n) => n.type_of_service === serviceId);

    if (selectedParentCategory !== "All") {
      nodes = nodes.filter((n) => n.parent_category === selectedParentCategory);
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
  };

  const toggleService = (serviceId: string) => {
    const newExpanded = new Set(expandedServices);
    if (newExpanded.has(serviceId)) {
      newExpanded.delete(serviceId);
    } else {
      newExpanded.add(serviceId);
    }
    setExpandedServices(newExpanded);
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "IP":
        return <Activity className="w-4 h-4" />;
      case "OP":
        return <Stethoscope className="w-4 h-4" />;
      case "Phys":
        return <Users className="w-4 h-4" />;
      default:
        return <GitBranch className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "IP":
        return "from-blue-500 to-indigo-600";
      case "OP":
        return "from-green-500 to-emerald-600";
      case "Phys":
        return "from-purple-500 to-violet-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  const getParentCategoryColor = (categoryId: string) => {
    const colors: Record<string, string> = {
      P1: "bg-blue-100 text-blue-800 border-blue-300",
      P2: "bg-green-100 text-green-800 border-green-300",
      P3: "bg-purple-100 text-purple-800 border-purple-300",
      P4: "bg-orange-100 text-orange-800 border-orange-300",
      P5: "bg-pink-100 text-pink-800 border-pink-300",
      P6: "bg-indigo-100 text-indigo-800 border-indigo-300",
    };
    return colors[categoryId] || "bg-gray-100 text-gray-800 border-gray-300";
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Decision Tree...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load Decision Tree data</p>
        </div>
      </div>
    );
  }

  const ipCount = data.type_of_service.filter(
    (t) => t.category === "IP",
  ).length;
  const opCount = data.type_of_service.filter(
    (t) => t.category === "OP",
  ).length;
  const physCount = data.type_of_service.filter(
    (t) => t.category === "Phys",
  ).length;
  const totalQuestions = data.nodes.length;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <GitBranch className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Analyst Decision Tree
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Comprehensive analytical questions for Cost of Care variance
                  analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleOpenChat}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
              >
                <MessageSquare className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-semibold">Chat Assistant</div>
                  <div className="text-xs opacity-90">
                    Ask questions about any analysis
                  </div>
                </div>
              </button>
              <div className="h-12 w-px bg-gray-300"></div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {totalQuestions}
                </div>
                <div className="text-xs text-gray-500">Total Questions</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {data.type_of_service.length}
                </div>
                <div className="text-xs text-gray-500">Services</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">
                  {data.parent_categories.length}
                </div>
                <div className="text-xs text-gray-500">Categories</div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3">
                <Activity className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-900">
                    {ipCount}
                  </div>
                  <div className="text-sm text-blue-700">
                    Inpatient Services
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <Stethoscope className="w-8 h-8 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-900">
                    {opCount}
                  </div>
                  <div className="text-sm text-green-700">
                    Outpatient Services
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-900">
                    {physCount}
                  </div>
                  <div className="text-sm text-purple-700">
                    Physician Services
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions, reasons, or programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="All">All Services</option>
              <option value="IP">Inpatient ({ipCount})</option>
              <option value="OP">Outpatient ({opCount})</option>
              <option value="Phys">Physician ({physCount})</option>
            </select>
            <select
              value={selectedParentCategory}
              onChange={(e) => setSelectedParentCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="All">All Categories</option>
              {data.parent_categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No services found matching your criteria
              </p>
            </div>
          ) : (
            filteredServices.map((service) => {
              const nodes = getNodesForService(service.id);
              const isExpanded = expandedServices.has(service.id);
              const parentNodes = nodes.filter((n) => n.is_parent);

              if (nodes.length === 0 && searchQuery) return null;

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Service Header */}
                  <div
                    onClick={() => toggleService(service.id)}
                    className="cursor-pointer bg-gradient-to-r hover:opacity-90 transition-opacity p-4"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${getCategoryColor(service.category).replace("from-", "var(--tw-gradient-from, ").replace(" to-", "), var(--tw-gradient-to, ").replace(")", "))")})`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-white" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-white" />
                        )}
                        <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                          {getCategoryIcon(service.category)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {service.name}
                          </h3>
                          <p className="text-sm text-white text-opacity-90">
                            {service.hcc_code}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                          <span className="text-white font-medium">
                            {nodes.length} questions
                          </span>
                        </div>
                        <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                          <span className="text-white font-medium">
                            {parentNodes.length} parent
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Questions Tree */}
                  {isExpanded && (
                    <div className="p-6 bg-gray-50">
                      {parentNodes.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          No questions found
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {parentNodes.map((parentNode) => {
                            const childNodes = nodes.filter(
                              (n) => n.parent_node_id === parentNode.id,
                            );
                            const isNodeExpanded = expandedNodes.has(
                              parentNode.id,
                            );
                            const category = data.parent_categories.find(
                              (c) => c.id === parentNode.parent_category,
                            );

                            return (
                              <div
                                key={parentNode.id}
                                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                              >
                                {/* Parent Node */}
                                <div className="p-4 border-l-4 border-blue-500 hover:bg-blue-50 transition-colors group">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span
                                          className={`px-2 py-1 rounded text-xs font-medium border ${getParentCategoryColor(parentNode.parent_category)}`}
                                        >
                                          {category?.name ||
                                            parentNode.parent_category}
                                        </span>
                                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <h4 className="font-semibold text-gray-900 mb-2 flex-1">
                                          {parentNode.research_question}
                                        </h4>
                                        <button
                                          onClick={() =>
                                            handleCopyQuestion(
                                              parentNode.research_question,
                                              parentNode.id,
                                            )
                                          }
                                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-blue-100 rounded"
                                          title="Copy question"
                                        >
                                          {copiedQuestionId ===
                                          parentNode.id ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                          ) : (
                                            <Copy className="w-4 h-4 text-gray-600" />
                                          )}
                                        </button>
                                      </div>
                                      <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium">
                                          Reason:
                                        </span>{" "}
                                        {parentNode.reason}
                                      </p>
                                      {parentNode.suggested_program && (
                                        <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded border border-green-200">
                                          <span className="font-medium">
                                            Program:
                                          </span>{" "}
                                          {parentNode.suggested_program}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                      {childNodes.length > 0 && (
                                        <button
                                          onClick={() =>
                                            toggleNode(parentNode.id)
                                          }
                                          className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                                        >
                                          {isNodeExpanded ? (
                                            <ChevronDown className="w-4 h-4" />
                                          ) : (
                                            <ChevronRight className="w-4 h-4" />
                                          )}
                                          {childNodes.length} child
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Child Nodes */}
                                {isNodeExpanded && childNodes.length > 0 && (
                                  <div className="bg-gray-50 p-4 border-t border-gray-200">
                                    <div className="space-y-3">
                                      {childNodes.map((childNode, idx) => (
                                        <div
                                          key={childNode.id}
                                          className="bg-white p-4 rounded-lg border border-gray-200 border-l-4 border-l-green-400 hover:bg-green-50 transition-colors group"
                                        >
                                          <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                              <div className="flex items-center gap-2 mb-2">
                                                <ArrowRight className="w-4 h-4 text-green-500" />
                                                <span className="text-xs font-medium text-gray-500">
                                                  Child Question {idx + 1}
                                                </span>
                                              </div>
                                              <div className="flex items-start gap-2">
                                                <h5 className="font-medium text-gray-900 mb-2 flex-1">
                                                  {childNode.research_question}
                                                </h5>
                                                <button
                                                  onClick={() =>
                                                    handleCopyQuestion(
                                                      childNode.research_question,
                                                      childNode.id,
                                                    )
                                                  }
                                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-green-100 rounded"
                                                  title="Copy question"
                                                >
                                                  {copiedQuestionId ===
                                                  childNode.id ? (
                                                    <Check className="w-4 h-4 text-green-600" />
                                                  ) : (
                                                    <Copy className="w-4 h-4 text-gray-600" />
                                                  )}
                                                </button>
                                              </div>
                                              <p className="text-sm text-gray-600 mb-2">
                                                <span className="font-medium">
                                                  Reason:
                                                </span>{" "}
                                                {childNode.reason}
                                              </p>
                                              {childNode.suggested_program && (
                                                <p className="text-sm text-green-700 bg-green-50 px-3 py-2 rounded border border-green-200">
                                                  <span className="font-medium">
                                                    Program:
                                                  </span>{" "}
                                                  {childNode.suggested_program}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
