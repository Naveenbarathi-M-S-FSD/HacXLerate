import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  Bot,
  Calendar,
  Pill,
  BellRing,
  User,
  Users,
  Search,
  Store,
  PlusCircle,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

export type ActiveTab =
  | 'dashboard'
  | 'records'
  | 'insights'
  | 'copilot'
  | 'appointments'
  | 'medicines'
  | 'reminders'
  | 'profile'
  | 'doctor_patients'
  | 'doctor_search'
  | 'doctor_appointments'
  | 'doctor_pharmacy_network'
  | 'pharmacy_dashboard'
  | 'pharmacy_create_post'
  | 'pharmacy_my_posts'
  | 'pharmacy_network';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  icon: any;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
}) => {
  const { currentUser, patientProfile, doctorProfile, pharmacyProfile } = useAuth();
  const { t } = useLanguage();

  if (!currentUser) return null;

  const role = currentUser.role;

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  const patientNav: NavItem[] = [
    { id: 'dashboard' as ActiveTab, label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'records' as ActiveTab, label: t.nav.healthRecords, icon: FileText },
    { id: 'insights' as ActiveTab, label: t.nav.aiInsights, icon: Sparkles },
    { id: 'copilot' as ActiveTab, label: t.nav.aiCopilot, icon: Bot, badge: 'AI' },
    { id: 'appointments' as ActiveTab, label: t.nav.appointments, icon: Calendar },
    { id: 'medicines' as ActiveTab, label: t.nav.medicines, icon: Pill },
    { id: 'reminders' as ActiveTab, label: t.nav.reminders, icon: BellRing },
    { id: 'profile' as ActiveTab, label: t.nav.profile, icon: User },
  ];

  const doctorNav: NavItem[] = [
    { id: 'dashboard' as ActiveTab, label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'doctor_search' as ActiveTab, label: t.nav.patientSearch, icon: Search, badge: 'QR' },
    { id: 'doctor_patients' as ActiveTab, label: t.nav.myPatients, icon: Users },
    { id: 'appointments' as ActiveTab, label: t.nav.appointments, icon: Calendar },
    { id: 'doctor_pharmacy_network' as ActiveTab, label: t.nav.pharmacyNetwork, icon: Store },
    { id: 'profile' as ActiveTab, label: t.nav.profile, icon: User },
  ];

  const pharmacyNav: NavItem[] = [
    { id: 'pharmacy_dashboard' as ActiveTab, label: t.nav.dashboard, icon: LayoutDashboard },
    { id: 'pharmacy_create_post' as ActiveTab, label: t.nav.createPost, icon: PlusCircle },
    { id: 'pharmacy_my_posts' as ActiveTab, label: t.nav.myPosts, icon: FileText },
    { id: 'doctor_pharmacy_network' as ActiveTab, label: t.nav.pharmacyNetwork, icon: Store },
    { id: 'profile' as ActiveTab, label: t.nav.profile, icon: User },
  ];

  const items = role === 'doctor' ? doctorNav : role === 'pharmacy' ? pharmacyNav : patientNav;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* User Card summary */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Workspace
            </span>
            <button
              onClick={onClose}
              className="lg:hidden p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm border border-teal-200 shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200/60">
                  <ShieldCheck className="w-3 h-3 text-teal-600" />
                  {currentUser.role}
                </span>
                {patientProfile && (
                  <span className="text-[10px] text-slate-500 font-mono">
                    ID: {patientProfile.healthId.slice(-7)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white' : 'text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-teal-700 text-teal-100'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <p className="text-[11px] font-semibold text-slate-800">
              THULIR Personal Health Copilot
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Secure records • AI extraction • Multilingual
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
