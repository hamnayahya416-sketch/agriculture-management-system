export function Icon({ size = 20, children, className = "" }) {
  return (
    <svg
      className={`icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const IconLeaf = (p) => (
  <Icon {...p}>
    <path d="M4 20c0-8 5-13 16-14-1 10-6 15-14 15" />
    <path d="M4 20c3-5 7-8 12-10" />
  </Icon>
);

export const IconGrid = (p) => (
  <Icon {...p}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
  </Icon>
);

export const IconBox = (p) => (
  <Icon {...p}>
    <path d="M20.5 7.5 12 3 3.5 7.5v9L12 21l8.5-4.5v-9Z" />
    <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" />
  </Icon>
);

export const IconCart = (p) => (
  <Icon {...p}>
    <path d="M3 4h2l2.4 10.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.55L21 8H6" />
    <circle cx="10" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
  </Icon>
);

export const IconPlusCircle = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8.5v7M8.5 12h7" />
  </Icon>
);

export const IconPlus = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const IconBell = (p) => (
  <Icon {...p}>
    <path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5S6.5 14 6.5 10Z" />
    <path d="M10 19a2.2 2.2 0 0 0 4 0" />
  </Icon>
);

export const IconSearch = (p) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.6-3.6" />
  </Icon>
);

export const IconMenu = (p) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
);

export const IconClose = (p) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const IconChevron = (p) => (
  <Icon {...p}>
    <path d="m9 6 6 6-6 6" />
  </Icon>
);

export const IconSprout = (p) => (
  <Icon {...p}>
    <path d="M12 21v-7" />
    <path d="M12 14C12 9.5 8.5 7 4 7c0 4.5 3.5 7 8 7Z" />
    <path d="M12 14c0-3.6 2.8-5.6 6.5-5.6C18.5 12 15.8 14 12 14Z" />
  </Icon>
);

export const IconMap = (p) => (
  <Icon {...p}>
    <path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4Z" />
    <path d="M9 4v13M15 6.5v13" />
  </Icon>
);

export const IconTrend = (p) => (
  <Icon {...p}>
    <path d="m4 16.5 5-5 3.5 3.5L20 7" />
    <path d="M15 7h5v5" />
  </Icon>
);

export const IconAlert = (p) => (
  <Icon {...p}>
    <path d="M12 4.5 21 19.5H3L12 4.5Z" />
    <path d="M12 10v4M12 17h.01" />
  </Icon>
);

export const IconCheckCircle = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.2 12.3 2.6 2.6 5-5.2" />
  </Icon>
);

export const IconTruck = (p) => (
  <Icon {...p}>
    <path d="M2.5 6.5h11v10h-11z" />
    <path d="M13.5 10h3.7l3.3 3v3.5h-7" />
    <circle cx="7" cy="18.5" r="1.7" />
    <circle cx="17" cy="18.5" r="1.7" />
  </Icon>
);

export const IconUsers = (p) => (
  <Icon {...p}>
    <circle cx="9.5" cy="8" r="3.3" />
    <path d="M3.5 19.5c0-3.1 2.7-5.2 6-5.2s6 2.1 6 5.2" />
    <path d="M16.5 5.2a3.2 3.2 0 0 1 0 5.8M18 14.6c2 .8 3.3 2.5 3.3 4.9" />
  </Icon>
);

export const IconClock = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </Icon>
);

export const IconUpload = (p) => (
  <Icon {...p}>
    <path d="M12 16V4.5" />
    <path d="m7.5 9 4.5-4.5L16.5 9" />
    <path d="M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
  </Icon>
);

export const IconImage = (p) => (
  <Icon {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="3" />
    <circle cx="9" cy="10" r="1.7" />
    <path d="m4.5 17.5 4.8-4.3 3.4 3 3-2.4 4 3.7" />
  </Icon>
);

export const IconCalendar = (p) => (
  <Icon {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="3" />
    <path d="M3.5 10h17M8 3.5v3M16 3.5v3" />
  </Icon>
);

export const IconThermo = (p) => (
  <Icon {...p}>
    <path d="M13.5 13.8V5.5a1.9 1.9 0 1 0-3.8 0v8.3a3.6 3.6 0 1 0 3.8 0Z" />
  </Icon>
);

export const IconDroplet = (p) => (
  <Icon {...p}>
    <path d="M12 3.5s5.5 5.6 5.5 9.4a5.5 5.5 0 1 1-11 0C6.5 9.1 12 3.5 12 3.5Z" />
  </Icon>
);

export const IconWind = (p) => (
  <Icon {...p}>
    <path d="M3 8.5h11a3 3 0 1 0-3-3" />
    <path d="M3 13h15a2.6 2.6 0 1 1-2.6 2.6" />
    <path d="M3 17.5h7" />
  </Icon>
);

export const IconCloudSun = (p) => (
  <Icon {...p}>
    <path d="M12 3.5v1.6M4.9 6.4l1.1 1.1M3.5 13.5h1.6M19.1 6.4l-1.1 1.1" />
    <path d="M9.4 10.6a3 3 0 1 1 4.3 3.4" />
    <path d="M7.5 19h9.2a3.3 3.3 0 0 0 .3-6.6 4.6 4.6 0 0 0-8.8-.6A3.4 3.4 0 0 0 7.5 19Z" />
  </Icon>
);

export const IconInbox = (p) => (
  <Icon {...p}>
    <path d="M3.5 13.5h4l1.5 3h6l1.5-3h4" />
    <path d="M5.5 5.5h13l2 8v5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2v-5l2-8Z" />
  </Icon>
);

export const IconArrowRight = (p) => (
  <Icon {...p}>
    <path d="M4.5 12h15M14 6.5l5.5 5.5L14 17.5" />
  </Icon>
);

export const IconLayers = (p) => (
  <Icon {...p}>
    <path d="m12 3.5 8.5 4.3L12 12 3.5 7.8 12 3.5Z" />
    <path d="m4 12 8 4 8-4M4 16.2l8 4 8-4" />
  </Icon>
);

export const IconUser = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="8.5" r="3.7" />
    <path d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6" />
  </Icon>
);

export const IconSun = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
  </Icon>
);

export const IconMoon = (p) => (
  <Icon {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5Z" />
  </Icon>
);

export const IconLogout = (p) => (
  <Icon {...p}>
    <path d="M9.5 4.5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3.5" />
    <path d="M15 8.5 18.5 12 15 15.5M18.5 12H9" />
  </Icon>
);

export const IconEdit = (p) => (
  <Icon {...p}>
    <path d="M4.5 19.5h4l10-10a2.1 2.1 0 0 0-3-3l-10 10v3Z" />
    <path d="m13.5 6.5 3 3" />
  </Icon>
);

export const IconTrash = (p) => (
  <Icon {...p}>
    <path d="M4.5 6.5h15M9.5 6.5V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v1.5" />
    <path d="M6.5 6.5 7.4 19a2 2 0 0 0 2 1.9h5.2a2 2 0 0 0 2-1.9l.9-12.5" />
    <path d="M10.5 10.5v6M13.5 10.5v6" />
  </Icon>
);

export const IconEye = (p) => (
  <Icon {...p}>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

export const IconWallet = (p) => (
  <Icon {...p}>
    <path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h11a2 2 0 0 1 2 2v1" />
    <path d="M3.5 7.5v10a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-13" />
    <circle cx="16.5" cy="14" r="1.2" />
  </Icon>
);

export const IconFileText = (p) => (
  <Icon {...p}>
    <path d="M6.5 3.5h7l4.5 4.5v12a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 20V5a1.5 1.5 0 0 1 1.5-1.5Z" />
    <path d="M13.5 3.5V8H18M8.5 12.5h7M8.5 16h7" />
  </Icon>
);

export const IconCalendarCheck = (p) => (
  <Icon {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4m-7.5 8.5 2.2 2.2 4-4.2" />
  </Icon>
);

export const IconRefresh = (p) => (
  <Icon {...p}>
    <path d="M20 12a8 8 0 1 1-2.6-5.9" />
    <path d="M20.5 4v5h-5" />
  </Icon>
);

export const IconPrint = (p) => (
  <Icon {...p}>
    <path d="M7 8.5V4h10v4.5" />
    <rect x="3.5" y="8.5" width="17" height="8" rx="2" />
    <path d="M7 14h10v6H7z" />
  </Icon>
);

export const IconDownload = (p) => (
  <Icon {...p}>
    <path d="M12 4v11m0 0 4-4m-4 4-4-4M4.5 19.5h15" />
  </Icon>
);

export const IconShield = (p) => (
  <Icon {...p}>
    <path d="M12 3.5 19.5 6v6c0 4.4-3.1 7.6-7.5 9-4.4-1.4-7.5-4.6-7.5-9V6L12 3.5Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Icon>
);
