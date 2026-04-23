export interface MetricData {
  value: number;
  change: number;
  period: string;
  trend: 'up' | 'down' | 'stable';
}

export interface FlashCardKPIs {
  auth_count?: string;
  auth_per_1000?: string;
  admits_per_1000?: string;
  pmpm?: string;
  claim_count?: string;
  cost_per_auth?: string;
  cost_per_admit?: string;
  allowed_cost_per_admit?: string;
  pmpm_allowed?: string;
  pmpm_paid?: string;
  cmi?: string;
  oon_percentage?: string;
  prior_auth_pmpm?: string;
  auth_claim_count?: string;
  visits_per_1000?: string;
  npar_pmpm?: string;
  npar_claims_per_1000?: string;
  npar_pmpm_ratio?: string;
  npar_claim_amount?: string;
  overall_pmpm?: string;
  trend_npar_pmpm?: string;
  trend_npar_claims?: string;
  trend_npar_ratio?: string;
  trend_npar_amount?: string;
}

export interface FlashCardTimeSeries {
  current: FlashCardKPIs;
  prior: FlashCardKPIs;
  rolling_3: FlashCardKPIs;
  rolling_6: FlashCardKPIs;
  rolling_12: FlashCardKPIs;
  ytd: FlashCardKPIs;
  variance?: Record<string, string>;
}

export interface FlashCardDimensions {
  provider: Array<{ name: string; auth_count: string; admits_per_1000: string; pmpm: string }>;
  drg: Array<{ code: string; description: string; auth_count: string; avg_cost: string }>;
  procedure: Array<{ code: string; description: string; volume: string; avg_cost: string }>;
  states?: Array<{ state: string; pmpm_current: string; pmpm_prior: string; diff_pmpm: string; diff_pct: string; key_insight?: string }>;
  drgs_top_5?: Array<{ drg: string; pmpm: string; key_insight?: string }>;
  rendering_providers_top_5?: Array<{ provider: string; pmpm: string; key_insight?: string }>;
  cost_drivers?: Array<{ driver: string; impact: string; description: string; contribution_to_pmpm: string }>;
  period_comparison?: Array<{ metric: string; current: string; prior: string; variance: string }>;
}

export interface AuthDeepDiveDriver {
  name: string;
  contribution_pct: number;
  med_necessity_pct: number;
  service_driver: string;
  service_driver_pct: number;
  primary_status: string;
  primary_status_pct: number;
  reason_group: string;
  reason_group_pct: number;
  denial_overturned_pct: number;
  denial_upheld_pct: number;
  /** Provider-level only: overall denial rate */
  denial_rate_pct?: number;
}

export interface AuthDeepDive {
  national_baseline: {
    total_auth_count: number;
    total_auth_per_k: number;
  };
  top_states: AuthDeepDiveDriver[];
  top_drgs: AuthDeepDiveDriver[];
  top_providers: AuthDeepDiveDriver[];
  key_findings?: {
    state_insights?: string[];
    drg_insights?: string[];
    provider_insights?: string[];
    appeal_insights?: string[];
  };
  strategic_recommendations?: string[];
}

export interface Level1RootCause {
  title: string;
  primary_cause: string;
  contributing_factors: string[];
  evidence_sources: string[];
}

export interface CorrelationItem {
  finding: string;
  explainability: string;
  evidence_claims?: string[];
  evidence_detail?: string;
  evidence_url?: string;
  evidence_label?: string;
  evidence_external?: Array<{
    description: string;
    label: string;
    url: string;
  }>;
}

export interface Level2CorrelationAnalysis {
  title: string;
  correlations: CorrelationItem[];
}

export interface FlashCard {
  id: string;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'under_review' | 'monitoring';
  auth_type?: 'IP Auth' | 'OP Auth';
  metric_value: string;
  metric_label: string;
  trend: string;
  trend_label: string;
  detection_source: string;
  line_of_business: string;
  description: string;
  data_source?: 'production' | 'mock';
  data_quality?: 'verified' | 'unverified';
  confidence?: number;
  insights: string[];
  recommended_actions: string[];
  data_points: Record<string, string>;
  detected_at: string;
  created_at: string;
  updated_at: string;
  snap_date?: string;
  incurred_month_end?: string;
  is_favorite?: boolean;
  root_cause_analysis?: string[];
  kpis?: FlashCardKPIs;
  time_series?: FlashCardTimeSeries;
  dimensions?: FlashCardDimensions;
  llm_summary?: string;
  level1_root_cause?: Level1RootCause;
  level2_correlation_analysis?: Level2CorrelationAnalysis;
  chart_data?: {
    type: string;
    title: string;
    metrics: Array<{
      name: string;
      current: number;
      prior: number;
      variance_pct: number;
      variance_direction: 'up' | 'down';
    }>;
  };
  waterfall_data?: {
    type: string;
    title: string;
    base_value: number;
    target_value: number;
    components: Array<{
      label: string;
      value: number;
      type: 'base' | 'increase' | 'decrease' | 'total';
      description?: string;
    }>;
  };
}

export interface ValidationData {
  flashCardId: string;
  trendAnalysis: {
    financialTrend: MetricData[];
    leadingIndicators: MetricData[];
  };
  deepDive: {
    topProcedures: Array<{ name: string; cost: number; volume: number }>;
    topProviders: Array<{ name: string; cost: number; type: string }>;
  };
  rulesCheck: {
    policies: Array<{ document: string; relevance: number }>;
    contracts: Array<{ provider: string; status: string }>;
  };
  confidence: number;
  thinkingProcess: ThinkingStep[];
}

export interface ThinkingStep {
  id: string;
  step: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  details?: string;
  timestamp: string;
}

export interface ActionRecommendation {
  id: string;
  type: 'member' | 'provider' | 'operational';
  priority: 'high' | 'medium' | 'low';
  action: string;
  expectedImpact: string;
  owner: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ValidationResult extends ValidationData {
  actions: ActionRecommendation[];
}

export interface FlashCardRating {
  id: string;
  flash_card_id: string;
  user_id: string;
  user_email: string;
  rating: number;
  comment?: string;
  created_at: string;
  updated_at: string;
}

export interface FlashCardLock {
  id: string;
  flash_card_id: string;
  user_id: string;
  user_email: string;
  locked_at: string;
  expires_at: string;
}

export interface FlashCardShare {
  id: string;
  flash_card_id: string;
  shared_by_id: string;
  shared_by_email: string;
  shared_with_id: string;
  shared_with_email: string;
  message?: string;
  created_at: string;
  viewed_at?: string;
}

export interface FlashCardActivity {
  id: string;
  flash_card_id: string;
  user_id: string;
  user_email: string;
  activity_type: 'rated' | 'locked' | 'unlocked' | 'shared' | 'viewed' | 'commented';
  metadata: Record<string, any>;
  created_at: string;
}

export interface FlashCardWithCollaboration extends FlashCard {
  averageRating?: number;
  ratingCount?: number;
  userRating?: FlashCardRating;
  currentLock?: FlashCardLock;
  isLockedByCurrentUser?: boolean;
  recentActivity?: FlashCardActivity[];
}
