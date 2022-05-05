export const studyTypesData = [
  {
    label: "Ad Effectiveness Research",
    value: "Ad_Effectiveness_Research",
  },
  {
    label: "Adhoc",
    value: "adhoc",
  },
  {
    label: "community_build",
    value: "Community Build",
  },
  {
    label: "Face to Face",
    value: "face_to_face",
  },
  {
    label: "IHUT",
    value: "IHUT",
  },
  {
    label: "Internal Use",
    value: "internal_use",
  },
  {
    label: "Incidence Check",
    value: "incidence_check",
  },
  {
    label: "Qualitative Screening",
    value: "qualitative_screening",
  },
  {
    label: "Recontact",
    value: "recontact",
  },
  {
    label: "Recruit - Panel",
    value: "recruit_panel",
  },
  {
    label: "Tracking - Monthly",
    value: "tracking_monthly",
  },
  {
    label: "Tracking - Quaterly",
    value: "tracking_quaterly",
  },
  {
    label: "Tracking - Yearly",
    value: "tracking_yearly",
  },
  {
    label: "Tracking - Biyearly",
    value: "tracking_biyearly",
  },
  {
    label: "Wave Study",
    value: "wave_study",
  },
];
export const surveyTypesData = [
  "Consumer",
  "Business-To-Business",
  "Information Technology Decision Maker",
  "Healthcare",
  "Medical Professionals",
  "Panel Recruits",
];

export const projectManagersData = ["Moinnudin S.", "Mahmood A.", "Janhavi R."];

export const statusOptions = [
  {
    label: "Awarded",
    value: "awarded",
  },
  {
    label: "Bidding",
    value: "bidding",
  },
  {
    label: "Complete",
    value: "complete",
  },
  {
    label: "Live",
    value: "live",
  },
  {
    label: "Paused",
    value: "paused",
  },
  {
    label: "Billed",
    value: "billed",
  },
];

export const mainStatusWithInternalStatuses = {
  bidding: [
    { label: "Won", value: "won" },
    { label: "Lost", value: "lost" },
    { label: "Lead", value: "lead" },
    { label: "Ongoing", value: "ongoing" },
  ],
  awarded: [
    { label: "Tested", value: "tested" },
    {
      label: "Not Tested",
      value: "not_tested",
    },
  ],
  live: [
    { label: "Soft Launch", value: "soft_launch" },
    {
      label: "Full Launch",
      value: "full_launch",
    },
  ],
  complete: [
    { label: "Reconciled", value: "reconciled" },
    { label: "Not Reconciled", value: "not_reconciled" },
  ],
};
