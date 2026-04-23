export interface DashboardItem {
  name: string;
  url: string;
  key: string;
}

export interface DashboardGroup {
  group?: string;
  items?: DashboardItem[];
  name?: string;
  url?: string;
  key?: string;
}

export interface DashboardApp {
  app_name: string;
  children: DashboardGroup[];
}

export interface DashboardCategory {
  category: string;
  icon: string;
  apps: DashboardApp[];
}

export interface DashboardAppWithIcon extends DashboardApp {
  icon: string;
}

export const dashboardsData: DashboardCategory[] = [
  {
    category: "TREND & INSIGHTS",
    icon: "TrendingUp",
    apps: [
      {
        app_name: "Auto-detect flash cards",
        icon: "Zap",
        children: [
          {
            name: "Main",
            url: "/dashboard",
            key: "FLASH_CARDS"
          }
        ]
      },
      {
        app_name: "Action dashboard",
        icon: "CheckSquare",
        children: [
          {
            name: "Main",
            url: "/actions",
            key: "ACTIONS"
          }
        ]
      },
      {
        app_name: "Executive",
        icon: "Briefcase",
        children: [
          {
            name: "Main",
            url: "https://coc.dev.internal.das/cocwp/ExecutiveDashboard",
            key: "EXECUTIVE"
          }
        ]
      },
      {
        app_name: "Financial Executive",
        icon: "DollarSign",
        children: [
          {
            name: "Main",
            url: "https://app.powerbi.com/groups/ec00d121-dbb9-4d54-b290-f977fd81f14d/reports/21381fe3-4aa7-43a5-a366-58b48cb12d1a/c9dd65beedc0dac82e60",
            key: "FIN_EXEC"
          }
        ]
      },
      {
        app_name: "Restated Financial",
        icon: "FileText",
        children: [
          {
            group: "Restated Financial Dashboards",
            items: [
              {
                name: "Commercial",
                url: "https://app.powerbi.com/groups/me/apps/ec71eb77-7e02-45d6-95ea-981412d42ffe/reports/7199b937-4320-4fa1-9b4c-2aa845ea6399/ReportSection117a2e3ba184e0062edc?chromeless=1",
                key: "RFR_COMM"
              },
              {
                name: "Medicaid",
                url: "https://app.powerbi.com/groups/me/apps/acffec93-80ce-46c2-afd6-827743cd8f82/reports/2a86a1f1-cf3f-4e2e-936c-96042ac8a94a/ReportSection117a2e3ba184e0062edc?chromeless=1",
                key: "RFR_MEDD"
              },
              {
                name: "Medicare",
                url: "https://app.powerbi.com/groups/me/apps/d4be157a-45c3-4881-a9dc-90c47fa58ded/reports/9fb7ecbf-32a5-4836-b99b-0f97cc4ead05/ReportSection117a2e3ba184e0062edc?chromeless=1",
                key: "RFR_MEDC"
              },
              {
                name: "FGS",
                url: "https://app.powerbi.com/groups/me/apps/aed37e92-abfa-49c7-9601-f4298208a1cd/reports/702a3c66-4f82-4e74-bcb4-1959da4072b6/ReportSectionabad0cf30c2a80b95667?chromeless=1",
                key: "RFR_FGS"
              },
              {
                name: "Excel Pivots",
                url: "https://app.powerbi.com/groups/me/apps/1322d6e0-d669-40cc-a7b4-5845e1e2216c/reports/ae5dd67f-743a-4557-8c92-035a53dc5d3a/ReportSectiondbf8d95af3644780739c?chromeless=1",
                key: "RFR_EP"
              }
            ]
          },
          {
            group: "Restated Financial Matrix Dashboards",
            items: [
              {
                name: "Commercial",
                url: "https://app.powerbi.com/groups/me/apps/ec71eb77-7e02-45d6-95ea-981412d42ffe/reports/a531bbfb-39b0-4788-8d82-b05f0fb34fe1/ReportSection117a2e3ba184e0062edc?chromeless=1",
                key: "RFR_MTRX_COMM"
              },
              {
                name: "Medicaid",
                url: "https://app.powerbi.com/groups/me/apps/acffec93-80ce-46c2-afd6-827743cd8f82/reports/91a96550-5b71-4053-9a60-00e92bbc05c6/ReportSection117a2e3ba184e0062edc?chromeless=1",
                key: "RFR_MTRX_MEDD"
              },
              {
                name: "Medicare",
                url: "https://app.powerbi.com/groups/me/apps/d4be157a-45c3-4881-a9dc-90c47fa58ded/reports/0712f9b0-2eb0-42cf-8c18-67f15910d0fa/ReportSection117a2e3ba184e0062edc?chromeless=1",
                key: "RFR_MTRX_MEDC"
              },
              {
                name: "FGS",
                url: "https://app.powerbi.com/groups/me/apps/aed37e92-abfa-49c7-9601-f4298208a1cd/reports/79f5d134-f3a8-4bbc-b379-24ac59c1316b/ReportSectionddf08d1201a63a566093?chromeless=1",
                key: "RFR_MTRX_FGS"
              }
            ]
          }
        ]
      },
      {
        app_name: "Cost of Care",
        icon: "DollarSign",
        children: [
          {
            group: "Cost of Care Visual",
            items: [
              {
                name: "Commercial",
                url: "https://app.powerbi.com/groups/me/apps/ec71eb77-7e02-45d6-95ea-981412d42ffe/reports/5c932fee-b70d-42c3-b0ba-34fcea029be2/ReportSection?chromeless=1",
                key: "COC_VISUAL_COMM"
              },
              {
                name: "Medicaid",
                url: "https://app.powerbi.com/groups/me/apps/acffec93-80ce-46c2-afd6-827743cd8f82/reports/279e437b-c2b4-4856-a439-8f08795e47fa/ReportSection?chromeless=1",
                key: "COC_VISUAL_MEDD"
              },
              {
                name: "Medicare",
                url: "https://app.powerbi.com/groups/me/apps/d4be157a-45c3-4881-a9dc-90c47fa58ded/reports/e4263d3e-0524-4ec9-bbb4-f409f344c5a2/ReportSection?chromeless=1",
                key: "COC_VISUAL_MEDC"
              },
              {
                name: "FGS",
                url: "https://app.powerbi.com/groups/me/apps/aed37e92-abfa-49c7-9601-f4298208a1cd/reports/7a7342f5-985c-46fb-bf84-2a7022f7f43c/ReportSection?chromeless=1",
                key: "COC_VISUAL_FGS"
              }
            ]
          },
          {
            group: "Cost of Care Matrix",
            items: [
              {
                name: "Commercial",
                url: "https://app.powerbi.com/groups/me/apps/ec71eb77-7e02-45d6-95ea-981412d42ffe/reports/4a36cdb4-ad25-4322-81b7-2f4d36a0b762/ReportSection1ec021b5bc815baa2ff6?chromeless=1",
                key: "COC_MTRX_COMM"
              },
              {
                name: "Medicaid",
                url: "https://app.powerbi.com/groups/me/apps/acffec93-80ce-46c2-afd6-827743cd8f82/reports/934b366f-ca55-4bc7-8e84-91f4574b3c5f/ReportSection1ec021b5bc815baa2ff6?chromeless=1",
                key: "COC_MTRX_MEDD"
              },
              {
                name: "Medicare",
                url: "https://app.powerbi.com/groups/me/apps/d4be157a-45c3-4881-a9dc-90c47fa58ded/reports/b32c798a-1f16-4a0b-bdb6-5689917525d9/ReportSection1ec021b5bc815baa2ff6?chromeless=1",
                key: "COC_MTRX_MEDC"
              }
            ]
          },
          {
            group: "Clinical Condition",
            items: [
              {
                name: "Commercial",
                url: "https://app.powerbi.com/groups/me/apps/ec71eb77-7e02-45d6-95ea-981412d42ffe/reports/3f4ffb0c-3927-42f9-934a-c6134f863d86/ReportSection05a3e2dbe157b193e127?chromeless=1",
                key: "COC_CCON_COMM"
              },
              {
                name: "Medicaid",
                url: "https://app.powerbi.com/groups/me/apps/acffec93-80ce-46c2-afd6-827743cd8f82/reports/575f76e9-082d-41b3-845a-cebfbf9afb17/ReportSection05a3e2dbe157b193e127?chromeless=1",
                key: "COC_CCON_MEDD"
              },
              {
                name: "Medicare",
                url: "https://app.powerbi.com/groups/me/apps/d4be157a-45c3-4881-a9dc-90c47fa58ded/reports/a5a1441b-7b6a-4738-9531-c3ee02f13754/ReportSection05a3e2dbe157b193e127?chromeless=1",
                key: "COC_CCON_MEDC"
              }
            ]
          }
        ]
      },
      {
        app_name: "Capitation",
        icon: "CreditCard",
        children: [
          {
            name: "Commercial",
            url: "https://app.powerbi.com/groups/me/apps/ec71eb77-7e02-45d6-95ea-981412d42ffe/reports/fb3d32b4-d011-4928-88bb-6f5ba95960f6/ReportSection05a3e2dbe157b193e127?chromeless=1",
            key: "CPTN_COMM"
          },
          {
            name: "Medicaid",
            url: "https://app.powerbi.com/groups/me/apps/acffec93-80ce-46c2-afd6-827743cd8f82/reports/a13f1016-0c88-4c5d-8fa4-b17d09c6ba7f/ReportSection05a3e2dbe157b193e127?chromeless=1",
            key: "CPTN_MEDD"
          },
          {
            name: "Medicare",
            url: "https://app.powerbi.com/groups/me/apps/d4be157a-45c3-4881-a9dc-90c47fa58ded/reports/7b4dd5d0-6849-4178-a1f4-9cd00858eb4e/ReportSection05a3e2dbe157b193e127?chromeless=1",
            key: "CPTN_MEDC"
          }
        ]
      },
      {
        app_name: "Specialty RX",
        icon: "Pill",
        children: [
          {
            name: "Speciality Pharmacy",
            url: "https://app.powerbi.com/groups/me/apps/f4faff8c-639b-43ed-90b8-1845dca2516a/reports/c962f5c9-100c-4f5a-b3e7-5c5e4083017f/ReportSection05a3e2dbe157b193e127?chromeless=1",
            key: "SPECIALTY_PHAR"
          }
        ]
      }
    ]
  },
  {
    category: "IDEATION & INTERVENTIONS",
    icon: "Lightbulb",
    apps: [
      {
        app_name: "Ideation Engine",
        icon: "Lightbulb",
        children: [
          {
            name: "Main",
            url: "https://dev.cocai.ideation.elevancehealth.com/",
            key: "IDEATION_ENGINE"
          }
        ]
      }
    ]
  },
  {
    category: "SAVINGS",
    icon: "PiggyBank",
    apps: [
      {
        app_name: "Impact Tracking",
        icon: "Target",
        children: [
          {
            name: "Coming Soon",
            url: "NA",
            key: "IMPACT_TRACKING"
          }
        ]
      },
      {
        app_name: "Cost of Care Tracker",
        icon: "LineChart",
        children: [
          {
            name: "Coming Soon",
            url: "NA",
            key: "COC_TRACKER"
          }
        ]
      }
    ]
  },
  {
    category: "Quality & Health Equity",
    icon: "Heart",
    apps: [
      {
        app_name: "Quail",
        icon: "Heart",
        children: [
          {
            name: "Main",
            url: "https://elevancehealth-prod.thoughtspot.cloud/#/pinboard/a425922f-2b18-4fbd-aed0-a73f2705f42b",
            key: "QUAIL"
          }
        ]
      }
    ]
  },
  {
    category: "INTELLIGENT INQUIRY",
    icon: "Search",
    apps: [
      {
        app_name: "IntelliQ",
        icon: "MessageSquare",
        children: [
          {
            name: "Coming Soon",
            url: "NA",
            key: "INTELLIQ"
          }
        ]
      }
    ]
  },
  {
    category: "PLATFORM METRICS",
    icon: "Activity",
    apps: [
      {
        app_name: "User Metrics",
        icon: "Users",
        children: [
          {
            group: "User Analytics",
            items: [
              {
                name: "User Activity Dashboard",
                url: "/platform/user-metrics",
                key: "USER_ACTIVITY"
              },
              {
                name: "Feature Adoption",
                url: "/platform/feature-adoption",
                key: "FEATURE_ADOPTION"
              },
              {
                name: "Prompt Usage Analytics",
                url: "/platform/prompt-usage",
                key: "PROMPT_USAGE"
              },
              {
                name: "User Engagement Trends",
                url: "/platform/user-trends",
                key: "USER_TRENDS"
              }
            ]
          }
        ]
      },
      {
        app_name: "Infrastructure Metrics",
        icon: "Server",
        children: [
          {
            group: "Platform Infrastructure",
            items: [
              {
                name: "Model Usage & Costs",
                url: "/platform/model-metrics",
                key: "MODEL_METRICS"
              },
              {
                name: "Token Consumption",
                url: "/platform/token-metrics",
                key: "TOKEN_METRICS"
              },
              {
                name: "API Performance",
                url: "/platform/api-performance",
                key: "API_PERFORMANCE"
              },
              {
                name: "Cost Analysis",
                url: "/platform/cost-analysis",
                key: "COST_ANALYSIS"
              }
            ]
          }
        ]
      }
    ]
  }
];
