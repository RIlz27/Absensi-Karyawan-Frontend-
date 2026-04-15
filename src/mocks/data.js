export const menuItems = [
  {
    isHeadr: true,
    title: "DASHBOARD",
  },
  {
    title: "Dashboard",
    icon: "ph:house",
    link: "dashboard",
  },
  {
    isHeadr: true,
    title: "MANAJEMEN DATA",
  },
  {
    title: "Karyawan & Hak Akses",
    icon: "ph:users",
    link: "users",
  },
  {
    title: "Manajemen Kantor",
    icon: "ph:buildings",
    link: "admin/kantor",
  },
  {
    title: "Manajemen Shift",
    icon: "ph:clock",
    link: "admin/manage-shift",
  },
  {
    title: "Kalender Libur",
    icon: "ph:calendar",
    link: "admin/calendar",
  },
  {
    title: "Papan Pengumuman",
    icon: "ph:megaphone",
    link: "admin/pengumuman",
  },
  {
    isHeadr: true,
    title: "OPERASIONAL ABSEN",
  },
  {
    title: "Buka Absen (QR)",
    icon: "ph:qr-code",
    link: "admin/generate-qr",
  },
  {
    title: "Review Pengajuan",
    icon: "ph:check-square-offset",
    link: "admin/approval",
  },
  {
    title: "Laporan Kehadiran",
    icon: "ph:file-text",
    link: "admin/laporan",
  },
  {
    isHeadr: true,
    title: "KINERJA & GAMIFIKASI",
  },
  {
    title: "Aturan Quest (Poin)",
    icon: "ph:medal",
    link: "admin/point-rules",
  },
  {
    title: "Master Kategori KPI",
    icon: "ph:list-numbers",
    link: "admin/assessment-categories",
  },
  {
    title: "Hasil Penilaian (KPI)",
    icon: "ph:chart-polar",
    link: "admin/assessments",
  },
  {
    isHeadr: true,
    title: "TAMPILAN USER (SIMULASI)",
  },
  {
    title: "Menu Karyawan",
    icon: "ph:user",
    child: [
      {
        childtitle: "Dashboard Karyawan",
        childlink: "user/dashboard",
      },
      {
        childtitle: "Menu Scan Kehadiran",
        childlink: "user/scanner",
      },
      {
        childtitle: "Dompet Integritas",
        childlink: "user/gamification",
      },
      {
        childtitle: "Riwayat Absensi",
        childlink: "user/riwayat",
      },
      {
        childtitle: "Penilaian & KPI",
        childlink: "user/my-assessment",
      },
    ],
  },
];

export const topMenu = [
  {
    title: "Dashboard",
    icon: "ph:house-line",
    link: "/app/home",
    child: [
      {
        childtitle: "Default",
        childlink: "dashboard",
        childicon: "ph:chart-line-up",
      },
      {
        childtitle: "Ecommerce Dashboard",
        childlink: "ecommerce",
        childicon: "ph:shopping-cart",
      },
      {
        childtitle: "CRM Dashbaord",
        childlink: "",
        childicon: "ph:database",
        badge: "coming",
      },
      {
        childtitle: "Social",
        childlink: "crm",
        childicon: "ph:share-network",
        badge: "coming",
      },
    ],
  },
  {
    title: "App",
    icon: "ph:app-window",
    link: "/app/home",
    child: [
      {
        childtitle: "Chat",
        childlink: "chats",
        childicon: "ph:chats",
      },
      {
        childtitle: "boards",
        childlink: "boards",
        childicon: "ph:clipboard-text",
      },
      {
        childtitle: "Todo",
        childlink: "todos",
        childicon: "ph:list-dashes",
      },
    ],
  },
  {
    title: "Pages",
    icon: "ph:keyboard",
    link: "/app/home",
    megamenu: [
      {
        megamenutitle: "Authentication",
        megamenuicon: "heroicons-outline:user",
        singleMegamenu: [
          {
            m_childtitle: "Signin One",
            m_childlink: "/",
          },
          {
            m_childtitle: "Signin Two",
            m_childlink: "/login2",
          },

          {
            m_childtitle: "Signup One",
            m_childlink: "/register",
          },
          {
            m_childtitle: "Signup Two",
            m_childlink: "/register2",
          },
        ],
      },

      {
        megamenutitle: "Components",
        megamenuicon: "heroicons-outline:user",
        singleMegamenu: [
          {
            m_childtitle: "Accordion",
            m_childlink: "accordion",
          },
          {
            m_childtitle: "Tab",
            m_childlink: "tab",
          },
          {
            m_childtitle: "Dropdown",
            m_childlink: "dropdown",
          },
          {
            m_childtitle: "Modal",
            m_childlink: "modal",
          },
          {
            m_childtitle: "Timeline",
            m_childlink: "timeline",
          },
          {
            m_childtitle: "Pagination",
            m_childlink: "pagination",
          },
          {
            m_childtitle: "video",
            m_childlink: "video",
          },
        ],
      },
      {
        megamenutitle: "Elements",
        megamenuicon: "heroicons-outline:user",
        singleMegamenu: [
          {
            m_childtitle: "avatar",
            m_childlink: "avatar",
          },
          {
            m_childtitle: "alert",
            m_childlink: "alert",
          },
          {
            m_childtitle: "button",
            m_childlink: "button",
          },
          {
            m_childtitle: "badges",
            m_childlink: "badges",
          },
          {
            m_childtitle: "card",
            m_childlink: "card",
          },
          {
            m_childtitle: "progress",
            m_childlink: "progress",
          },
          {
            m_childtitle: "spinier",
            m_childlink: "spinier",
          },
          {
            m_childtitle: "progress",
            m_childlink: "progress",
          },
          {
            m_childtitle: "tooltip",
            m_childlink: "tooltip",
          },
        ],
      },
      {
        megamenutitle: "Forms",
        megamenuicon: "heroicons-outline:user",
        singleMegamenu: [
          {
            m_childtitle: "Text Field",
            m_childlink: "textfield",
          },
          {
            m_childtitle: "Input group",
            m_childlink: "input-group",
          },

          {
            m_childtitle: "Form validation",
            m_childlink: "form-validation",
          },

          {
            m_childtitle: "Input mask",
            m_childlink: "input-mask",
          },
          {
            m_childtitle: "File input",
            m_childlink: "file-input",
          },
          {
            m_childtitle: "Form repeater",
            m_childlink: "form-repeater",
          },
          {
            m_childtitle: "Textarea",
            m_childlink: "textarea",
          },
          {
            m_childtitle: "Checkbox",
            m_childlink: "checkbox",
          },
          {
            m_childtitle: "Radio",
            m_childlink: "radio",
          },
          {
            m_childtitle: "Switch",
            m_childlink: "switch",
          },
        ],
      },
      {
        megamenutitle: "Utility",
        megamenuicon: "heroicons-outline:user",
        singleMegamenu: [
          {
            m_childtitle: "Invoice",
            m_childlink: "invoice",
          },
          {
            m_childtitle: "Pricing",
            m_childlink: "pricing",
          },

          // {
          //   m_childtitle: "Testimonial",
          //   m_childlink: "testimonial",
          // },
          {
            m_childtitle: "FAQ",
            m_childlink: "faq",
          },
          {
            m_childtitle: "Blank page",
            m_childlink: "blank-page",
          },

          {
            m_childtitle: "404 page",
            m_childlink: "/404",
          },
        ],
      },
    ],
  },

  {
    title: "Other's",
    icon: "ph:text-columns",

    child: [
      {
        childtitle: "Table",
        childlink: "table-basic",
        childicon: "ph:table",
      },
      {
        childtitle: "react table",
        childlink: "react_table",
        childicon: "ph:table",
      },
      {
        childtitle: "Apex chart",
        childlink: "appex-chart",
        childicon: "ph:chart-donut",
      },
      {
        childtitle: "Chart js",
        childlink: "chartjs",
        childicon: "ph:chart-line",
      },
      {
        childtitle: "Map",
        childlink: "map",
        childicon: "ph:chart-line",
      },
    ],
  },
];

import User1 from "@/assets/images/avatar/avatar-1.jpg";
import User2 from "@/assets/images/avatar/avatar-2.jpg";
import User3 from "@/assets/images/avatar/avatar-3.jpg";
import User4 from "@/assets/images/avatar/avatar-4.jpg";
export const notifications = [
  {
    title:
      "Your Account has been created  <span class='font-medium'>successfully done</span>",

    icon: "ph:seal-check-light",
    status: "green",
    link: "#",
  },
  {
    title:
      "You upload your first product <span class='font-medium'>successfully done</span>",

    icon: "ph:cube-light",
    status: "blue",
    link: "#",
  },
  {
    title: "<span class='font-medium'>Thank you !</span> you made your first",
    icon: "ph:shopping-cart-light",
    status: "yellow",
    link: "#",
  },
  {
    title: "<span class='font-medium'>Broklan Simons </span> New are New admin",
    icon: "ph:user-circle-plus-light",
    status: "cyan",
    link: "#",
  },
  {
    title:
      "Your are update to Deshboard <span class='font-medium'>Pro Version</span>",
    status: "red",
    icon: "ph:lightning-light",
    link: "#",
  },
];

export const message = [
  {
    title: "Ronald Richards",
    desc: "Hello there, here is  a Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, fugiat.",
    active: true,
    hasnotifaction: true,
    notification_count: 1,
    image: User1,
    link: "#",
  },
  {
    title: "Wade Warren",
    desc: "Hello there, here is  a Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, fugiat.",
    active: false,
    hasnotifaction: true,
    image: User2,
    link: "#",
  },
  {
    title: "Albert Flores",
    desc: "Hello there, here is  a Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, fugiat.",
    active: false,
    hasnotifaction: true,
    notification_count: 8,
    image: User3,
    link: "#",
  },
  {
    title: "Savannah Nguyen",
    desc: "Hello there, here is  a Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, fugiat.",
    active: true,
    hasnotifaction: false,
    image: User4,
    link: "#",
  },
  {
    title: "Esther Howard",
    desc: "Hello there, here is  a Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, fugiat.",
    active: false,
    hasnotifaction: true,
    image: User2,
    link: "#",
  },
  {
    title: "Ralph Edwards",
    desc: "Hello there, here is  a Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, fugiat.",
    active: false,
    hasnotifaction: false,
    notification_count: 8,
    image: User3,
    link: "#",
  },
  {
    title: "Cody Fisher",
    desc: "Hello there, here is  a Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, fugiat.",
    active: true,
    hasnotifaction: false,
    image: User4,
    link: "#",
  },
];

export const colors = {
  primary: "#3b82f6",
  secondary: "#d946ef",
  danger: "#ef4444",
  black: "#000",
  warning: "#eab308",
  info: "#06b6d4",
  light: "#425466",
  success: "#22c55e",
  "gray-f7": "#F7F8FC",
  dark: "#1E293B",
  "dark-gray": "#0F172A",
  gray: "#68768A",
  gray2: "#EEF1F9",
  "dark-light": "#CBD5E1",
};

export const hexToRGB = (hex, alpha) => {
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
  } else {
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }
};

export const topFilterLists = [
  {
    name: "Inbox",
    value: "all",
    icon: "uil:image-v",
  },
  {
    name: "Starred",
    value: "fav",
    icon: "heroicons:star",
  },
  {
    name: "Sent",
    value: "sent",
    icon: "heroicons-outline:paper-airplane",
  },

  {
    name: "Drafts",
    value: "drafts",
    icon: "heroicons-outline:pencil-alt",
  },
  {
    name: "Spam",
    value: "spam",
    icon: "heroicons:information-circle",
  },
  {
    name: "Trash",
    value: "trash",
    icon: "heroicons:trash",
  },
];

export const bottomFilterLists = [
  {
    name: "personal",
    value: "personal",
    icon: "heroicons:chevron-double-right",
  },
  {
    name: "Social",
    value: "social",
    icon: "heroicons:chevron-double-right",
  },
  {
    name: "Promotions",
    value: "promotions",
    icon: "heroicons:chevron-double-right",
  },
  {
    name: "Business",
    value: "business",
    icon: "heroicons:chevron-double-right",
  },
];

import meetsImage1 from "@/assets/images/svg/sk.svg";
import meetsImage2 from "@/assets/images/svg/path.svg";
import meetsImage3 from "@/assets/images/svg/dc.svg";
import meetsImage4 from "@/assets/images/svg/sk.svg";

export const meets = [
  {
    img: meetsImage1,
    title: "Meeting with client",
    date: "01 Nov 2021",
    meet: "Zoom meeting",
  },
  {
    img: meetsImage2,
    title: "Design meeting (team)",
    date: "01 Nov 2021",
    meet: "Skyp meeting",
  },
  {
    img: meetsImage3,
    title: "Background research",
    date: "01 Nov 2021",
    meet: "Google meeting",
  },
  {
    img: meetsImage4,
    title: "Meeting with client",
    date: "01 Nov 2021",
    meet: "Zoom meeting",
  },
];
import file1Img from "@/assets/images/icon/file-1.svg";
import file2Img from "@/assets/images/icon/pdf-1.svg";
import file3Img from "@/assets/images/icon/zip-1.svg";
import file4Img from "@/assets/images/icon/pdf-2.svg";
import file5Img from "@/assets/images/icon/scr-1.svg";

export const files = [
  {
    img: file1Img,
    title: "Dashboard.fig",
    date: "06 June 2021 / 155MB",
  },
  {
    img: file2Img,
    title: "Ecommerce.pdf",
    date: "06 June 2021 / 155MB",
  },
  {
    img: file3Img,
    title: "Job portal_app.zip",
    date: "06 June 2021 / 155MB",
  },
  {
    img: file4Img,
    title: "Ecommerce.pdf",
    date: "06 June 2021 / 155MB",
  },
  {
    img: file5Img,
    title: "Screenshot.jpg",
    date: "06 June 2021 / 155MB",
  },
];

export const filterOptions = [
  { value: "all", label: "All" },
  { value: "favorite", label: "Favorite" },
  { value: "completed", label: "Completed" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "update", label: "Update" },
  { value: "team", label: "Team" },
];
