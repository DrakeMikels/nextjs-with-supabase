"use client";

import type { Variants } from "motion/react";
import * as motion from "motion/react-client";
import { useEffect, useRef, useState } from "react";
import { 
  TrendingUp,
  Users,
  Edit3,
  CalendarDays,
  UserCheck,
  PieChart,
  GraduationCap,
  ClipboardList,
  MapPin,
  Heart,
  Shield
} from "lucide-react";

const navigationItems = [
  {
    id: "master",
    label: "Master View",
    icon: TrendingUp,
    description: "Complete overview of all metrics"
  },
  {
    id: "meeting",
    label: "Meeting View",
    icon: Users,
    description: "Side-by-side coach view for meetings"
  },
  {
    id: "metrics",
    label: "Quick Entry",
    icon: Edit3,
    description: "Enter safety metrics quickly"
  },
  {
    id: "periods",
    label: "Periods",
    icon: CalendarDays,
    description: "Manage bi-weekly periods"
  },
  {
    id: "coaches",
    label: "Coaches",
    icon: UserCheck,
    description: "Manage coach information"
  },
  {
    id: "dashboard",
    label: "Analytics",
    icon: PieChart,
    description: "View detailed analytics"
  },
  {
    id: "idp",
    label: "IDP",
    icon: GraduationCap,
    description: "Individual development plans"
  },
  {
    id: "action-items",
    label: "Action Items",
    icon: ClipboardList,
    description: "Manage action items"
  },
  {
    id: "branch-visits",
    label: "Branch Visits",
    icon: MapPin,
    description: "Track branch assignments and visits"
  },
  {
    id: "cpr-first-aid",
    label: "CPR/First Aid",
    icon: Heart,
    description: "Track CPR and First Aid certifications"
  }
];

interface MobileNavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

export default function MobileNavigation({ activeView, onViewChange }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { height } = useDimensions(containerRef);

  const handleItemClick = (itemId: string) => {
    onViewChange(itemId);
    setIsOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div style={{...container, pointerEvents: isOpen ? 'auto' : 'none'}}>
      {/* Backdrop overlay when menu is open */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        ref={containerRef}
        style={nav}
      >
        <motion.div style={background} variants={sidebarVariants} />
        <Navigation activeView={activeView} onItemClick={handleItemClick} />
        <MenuToggle toggle={() => setIsOpen(!isOpen)} />
      </motion.nav>
    </div>
  );
}

const navVariants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const Navigation = ({ activeView, onItemClick }: { activeView: string; onItemClick: (id: string) => void }) => (
  <motion.ul style={list} variants={navVariants}>
    <motion.li style={headerItem} variants={itemVariants}>
      <div style={headerContainer}>
        <Shield className="w-6 h-6 text-brand-olive" />
        <div>
          <div style={headerTitle}>RSC Platform</div>
          <div style={headerSubtitle}>Regional Safety Coaches</div>
        </div>
      </div>
    </motion.li>
    {navigationItems.map((item) => (
      <MenuItem 
        key={item.id} 
        item={item} 
        isActive={activeView === item.id}
        onClick={() => onItemClick(item.id)}
      />
    ))}
  </motion.ul>
);

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const MenuItem = ({ item, isActive, onClick }: { 
  item: typeof navigationItems[0]; 
  isActive: boolean;
  onClick: () => void;
}) => {
  const Icon = item.icon;
  
  return (
    <motion.li
      style={{
        ...listItem,
        backgroundColor: isActive ? '#2C5134' : 'transparent',
        borderRadius: '12px',
        padding: '12px',
        marginBottom: '8px'
      }}
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div style={{
        ...iconContainer,
        backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#2C5134',
      }}>
        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white'}`} />
      </div>
      <div style={textContainer}>
        <div style={{
          ...itemTitle,
          color: isActive ? 'white' : '#2C5134',
          fontWeight: isActive ? '600' : '500'
        }}>
          {item.label}
        </div>
        <div style={{
          ...itemDescription,
          color: isActive ? 'rgba(255,255,255,0.8)' : '#666'
        }}>
          {item.description}
        </div>
      </div>
    </motion.li>
  );
};

const sidebarVariants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0.2,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

interface PathProps {
  d?: string;
  variants: Variants;
  transition?: { duration: number };
}

const Path = (props: PathProps) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="#2C5134"
    strokeLinecap="round"
    {...props}
  />
);

const MenuToggle = ({ toggle }: { toggle: () => void }) => (
  <button style={toggleContainer} onClick={toggle}>
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);

/**
 * ==============   Styles   ================
 */

const container: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 1000,
  height: "100vh",
};

const nav: React.CSSProperties = {
  width: "85vw",
  maxWidth: "320px",
  height: "100vh",
  position: "relative",
};

const background: React.CSSProperties = {
  backgroundColor: "#f8f9fa",
  position: "absolute",
  top: 0,
  left: 0,
  bottom: 0,
  width: "100%",
  boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
};

const toggleContainer: React.CSSProperties = {
  outline: "none",
  WebkitUserSelect: "none",
  MozUserSelect: "none",
  cursor: "pointer",
  position: "fixed",
  top: 20,
  left: 20,
  width: 44,
  height: 44,
  borderRadius: "50%",
  background: "rgba(44, 81, 52, 0.9)",
  backdropFilter: "blur(8px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1001,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  border: "2px solid rgba(255, 255, 255, 0.2)",
  pointerEvents: "auto", // Always allow interaction with toggle button
};

const list: React.CSSProperties = {
  listStyle: "none",
  padding: "80px 20px 20px 20px",
  margin: 0,
  position: "absolute",
  top: 0,
  width: "100%",
  height: "100%",
  overflowY: "auto",
};

const headerItem: React.CSSProperties = {
  marginBottom: 24,
  padding: 16,
  borderBottom: "1px solid #e0e0e0",
};

const headerContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const headerTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: "bold",
  color: "#2C5134",
  margin: 0,
};

const headerSubtitle: React.CSSProperties = {
  fontSize: 12,
  color: "#666",
  margin: 0,
};

const listItem: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  listStyle: "none",
  cursor: "pointer",
  minHeight: 60,
};

const iconContainer: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 12,
  flexShrink: 0,
};

const textContainer: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const itemTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: "500",
  margin: 0,
  marginBottom: 2,
};

const itemDescription: React.CSSProperties = {
  fontSize: 11,
  margin: 0,
  lineHeight: 1.3,
};

/**
 * ==============   Utils   ================
 */

const useDimensions = (ref: React.RefObject<HTMLDivElement | null>) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);

  return dimensions.current;
}; 