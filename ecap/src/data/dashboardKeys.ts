// All available dashboard keys from the navigation structure
// Used for auto-suggest in admin configuration

export const dashboardKeys = [
  // TREND & INSIGHTS
  { key: 'FLASH_CARDS', label: 'Auto-detect flash cards', category: 'TREND & INSIGHTS' },
  { key: 'ACTIONS', label: 'Action dashboard', category: 'TREND & INSIGHTS' },
  { key: 'EXECUTIVE', label: 'Executive', category: 'TREND & INSIGHTS' },
  { key: 'FIN_EXEC', label: 'Financial Executive', category: 'TREND & INSIGHTS' },
  
  // Restated Financial
  { key: 'RFR_COMM', label: 'Restated Financial - Commercial', category: 'TREND & INSIGHTS' },
  { key: 'RFR_MEDD', label: 'Restated Financial - Medicaid', category: 'TREND & INSIGHTS' },
  { key: 'RFR_MEDC', label: 'Restated Financial - Medicare', category: 'TREND & INSIGHTS' },
  { key: 'RFR_FGS', label: 'Restated Financial - FGS', category: 'TREND & INSIGHTS' },
  { key: 'RFR_EP', label: 'Restated Financial - Excel Pivots', category: 'TREND & INSIGHTS' },
  
  // Restated Financial Matrix
  { key: 'RFR_MTRX_COMM', label: 'Restated Financial Matrix - Commercial', category: 'TREND & INSIGHTS' },
  { key: 'RFR_MTRX_MEDD', label: 'Restated Financial Matrix - Medicaid', category: 'TREND & INSIGHTS' },
  { key: 'RFR_MTRX_MEDC', label: 'Restated Financial Matrix - Medicare', category: 'TREND & INSIGHTS' },
  { key: 'RFR_MTRX_FGS', label: 'Restated Financial Matrix - FGS', category: 'TREND & INSIGHTS' },
  
  // Cost of Care Visual
  { key: 'COC_VISUAL_COMM', label: 'Cost of Care Visual - Commercial', category: 'TREND & INSIGHTS' },
  { key: 'COC_VISUAL_MEDD', label: 'Cost of Care Visual - Medicaid', category: 'TREND & INSIGHTS' },
  { key: 'COC_VISUAL_MEDC', label: 'Cost of Care Visual - Medicare', category: 'TREND & INSIGHTS' },
  { key: 'COC_VISUAL_FGS', label: 'Cost of Care Visual - FGS', category: 'TREND & INSIGHTS' },
  
  // Cost of Care Matrix
  { key: 'COC_MTRX_COMM', label: 'Cost of Care Matrix - Commercial', category: 'TREND & INSIGHTS' },
  { key: 'COC_MTRX_MEDD', label: 'Cost of Care Matrix - Medicaid', category: 'TREND & INSIGHTS' },
  { key: 'COC_MTRX_MEDC', label: 'Cost of Care Matrix - Medicare', category: 'TREND & INSIGHTS' },
  
  // Clinical Condition
  { key: 'COC_CCON_COMM', label: 'Clinical Condition - Commercial', category: 'TREND & INSIGHTS' },
  { key: 'COC_CCON_MEDD', label: 'Clinical Condition - Medicaid', category: 'TREND & INSIGHTS' },
  { key: 'COC_CCON_MEDC', label: 'Clinical Condition - Medicare', category: 'TREND & INSIGHTS' },
  
  // Capitation
  { key: 'CPTN_COMM', label: 'Capitation - Commercial', category: 'TREND & INSIGHTS' },
  { key: 'CPTN_MEDD', label: 'Capitation - Medicaid', category: 'TREND & INSIGHTS' },
  { key: 'CPTN_MEDC', label: 'Capitation - Medicare', category: 'TREND & INSIGHTS' },
  
  // Specialty
  { key: 'SPECIALTY_PHAR', label: 'Specialty RX - Speciality Pharmacy', category: 'TREND & INSIGHTS' },
  
  // IDEATION & INTERVENTIONS
  { key: 'IDEATION_ENGINE', label: 'Ideation Engine', category: 'IDEATION & INTERVENTIONS' },
  
  // SAVINGS
  { key: 'IMPACT_TRACKING', label: 'Impact Tracking', category: 'SAVINGS' },
  { key: 'COC_TRACKER', label: 'Cost of Care Tracker', category: 'SAVINGS' },
  
  // Quality & Health Equity
  { key: 'QUAIL', label: 'Quail', category: 'Quality & Health Equity' },
  
  // INTELLIGENT INQUIRY
  { key: 'INTELLIQ', label: 'IntelliQ', category: 'INTELLIGENT INQUIRY' },
  
  // PLATFORM METRICS
  { key: 'USER_ACTIVITY', label: 'User Activity Dashboard', category: 'PLATFORM METRICS' },
  { key: 'FEATURE_ADOPTION', label: 'Feature Adoption', category: 'PLATFORM METRICS' },
  { key: 'PROMPT_USAGE', label: 'Prompt Usage Analytics', category: 'PLATFORM METRICS' },
  { key: 'USER_TRENDS', label: 'User Engagement Trends', category: 'PLATFORM METRICS' },
  { key: 'MODEL_METRICS', label: 'Model Usage & Costs', category: 'PLATFORM METRICS' },
  { key: 'TOKEN_METRICS', label: 'Token Consumption', category: 'PLATFORM METRICS' },
  { key: 'API_PERFORMANCE', label: 'API Performance', category: 'PLATFORM METRICS' },
  { key: 'COST_ANALYSIS', label: 'Cost Analysis', category: 'PLATFORM METRICS' },
];

export const categoryPresets = [
  'Cost of Care Analytics',
  'Financial Analytics',
  'Clinical Analytics',
  'AI & Analytics',
  'Platform Metrics',
  'Quality & Health Equity',
  'Ideation & Interventions',
  'Savings & Impact',
];
