import { Link, type Location } from "react-router-dom";
import {
  Bug,
  HomeIcon,
  SettingsIcon,
  SquarePenIcon,
  User2Icon,
} from "lucide-react";
import { ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";
import type { Session } from "@supabase/supabase-js";

type SideBarProps = {
  onNavigate: () => void;
  isOpen: boolean;
  Session: Session | null;
  location: Location;
};

export default function SideBar({
  onNavigate,
  isOpen,
  Session,
  location,
}: SideBarProps) {
  const isAdmin = Session?.user.user_metadata.role === "admin" || false;

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
          <User2Icon />
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
