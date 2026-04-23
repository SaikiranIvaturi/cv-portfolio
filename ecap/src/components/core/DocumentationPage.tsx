import { useState, useEffect } from "react";
import {
  BookOpen,
  Sparkles,
  Key,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { API_CONFIG } from "../../config";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Subsection {
  title: string;
  content?: string;
  items?: string[];
  technical?: string;
}

interface SectionContent {
  heading: string;
  description: string;
  subsections?: Subsection[];
  faqs?: FAQ[];
}

interface DocSection {
  id: string;
  title: string;
  icon: string;
  order: number;
  content: SectionContent;
}

interface Documentation {
  sections: DocSection[];
  home_faqs: string[];
  last_updated: string;
  version: string;
}

const API_BASE_URL = API_CONFIG.BACKEND_URL;

const iconMap: Record<string, typeof BookOpen> = {
  BookOpen,
  Sparkles,
  Key,
  HelpCircle,
};

export default function DocumentationPage() {
  const [documentation, setDocumentation] = useState<Documentation | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] =
    useState<string>("project-overview");
  const [expandedFaqs, setExpandedFaqs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchDocumentation = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/documentation`);
        if (!response.ok) throw new Error("Failed to fetch documentation");
        const data = await response.json();
        setDocumentation(data);
        if (data.sections?.length > 0) {
          setActiveSection(data.sections[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchDocumentation();
  }, []);

  const toggleFaq = (faqId: string) => {
    setExpandedFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(faqId)) {
        next.delete(faqId);
      } else {
        next.add(faqId);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#1A3673]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error loading documentation: {error}
        </div>
      </div>
    );
  }

  const sections =
    documentation?.sections?.sort((a, b) => a.order - b.order) || [];
  const currentSection = sections.find((s) => s.id === activeSection);

  const renderIcon = (iconName: string) => {
    const Icon = iconMap[iconName] || BookOpen;
    return <Icon className="w-5 h-5" />;
  };

  const renderSubsection = (subsection: Subsection, index: number) => (
    <div
      key={index}
      className="border border-gray-200 rounded-lg p-5 hover:border-[#44B8F3] transition-colors"
    >
      <h4 className="font-semibold text-[#1A3673] mb-2">{subsection.title}</h4>
      {subsection.content && (
        <p className="text-sm text-gray-700 mb-3">{subsection.content}</p>
      )}
      {subsection.items && (
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 pl-2">
          {subsection.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      {subsection.technical && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-1">
            Technical Details
          </p>
          <p className="text-xs text-gray-600">{subsection.technical}</p>
        </div>
      )}
    </div>
  );

  const renderFAQs = (faqs: FAQ[]) => (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <div
          key={faq.id}
          className="border border-gray-200 rounded-lg overflow-hidden"
        >
          <button
            onClick={() => toggleFaq(faq.id)}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left"
          >
            <span className="font-medium text-[#231E33] text-sm">
              {faq.question}
            </span>
            {expandedFaqs.has(faq.id) ? (
              <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />
            )}
          </button>
          {expandedFaqs.has(faq.id) && (
            <div className="px-4 py-3 bg-white">
              <p className="text-sm text-gray-700">{faq.answer}</p>
              <span className="inline-block mt-2 px-2 py-0.5 bg-[#E1EDFF] text-[#1A3673] text-xs rounded-full">
                {faq.category}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#231E33]">Documentation</h1>
        <p className="text-gray-500 text-sm">
          Platform guides, features, and frequently asked questions
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <nav className="bg-white rounded-xl border border-gray-200 p-4 sticky top-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Sections
            </h3>
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? "bg-[#E1EDFF] text-[#1A3673] font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {renderIcon(section.icon)}
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
            {documentation?.version && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Version {documentation.version}
                </p>
              </div>
            )}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {currentSection && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-[#231E33] mb-2">
                    {currentSection.content.heading}
                  </h2>
                  <p className="text-gray-600">
                    {currentSection.content.description}
                  </p>
                </div>

                {/* Render subsections or FAQs */}
                {currentSection.content.subsections && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {currentSection.content.subsections.map(
                      (subsection, index) =>
                        renderSubsection(subsection, index),
                    )}
                  </div>
                )}

                {currentSection.content.faqs &&
                  renderFAQs(currentSection.content.faqs)}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
