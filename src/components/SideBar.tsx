import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Bug, HomeIcon, SettingsIcon, SquarePenIcon } from "lucide-react";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";

type SideBarProps = {
  onNavigate: () => void;
  isOpen: boolean;
};

export default function SideBar({ onNavigate, isOpen }: SideBarProps) {
  const location = useLocation();
  const { Session } = useAuth();

  const isAdmin = Session?.user.user_metadata.role === "admin";

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className='sidebar-section-label'>Navigation</div>

      <Link
        to='/'
        className={`sidebar-link ${location.pathname === "/" ? "active" : ""}`}
        onClick={onNavigate}
      >
        <HomeIcon />
        Home
      </Link>

      <Link
        to='/student-records'
        className={`sidebar-link ${location.pathname === "/student-records" ? "active" : ""}`}
        onClick={onNavigate}
      >
        <SquarePenIcon />
        Student Records
      </Link>

      {isAdmin && (
        <Link
          to='/support-center-staff'
          className={`sidebar-link ${location.pathname === "/support-center-staff" ? "active" : ""}`}
          onClick={onNavigate}
        >
          <svg
            viewBox='0 0 16 16'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.4'
          >
            <circle cx='8' cy='6' r='3' />
            <path d='M3 14c0-3 2.2-5 5-5s5 2 5 5' />
          </svg>
          Support Center Staff
        </Link>
      )}

      <hr className='sidebar-divider' />
      <div className='sidebar-section-label'>Account</div>

      <Link
        to='/settings'
        className={`sidebar-link ${location.pathname === "/settings" ? "active" : ""}`}
        onClick={onNavigate}
      >
        <SettingsIcon />
        Settings
      </Link>

      <hr className='sidebar-divider' />
      <div className='sidebar-section-label'>Feedback</div>

      <Link
        to='/feedback'
        className={`sidebar-link ${location.pathname === "/feedback" ? "active" : ""}`}
        onClick={onNavigate}
      >
        <ChatBubbleBottomCenterTextIcon /> Submit Feedback
      </Link>
      
      <Link
        to='/report'
        className={`sidebar-link ${location.pathname === "/report" ? "active" : ""}`}
        onClick={onNavigate}
      >
        <Bug /> Report an Issue
      </Link>
    </aside>
  );
}
