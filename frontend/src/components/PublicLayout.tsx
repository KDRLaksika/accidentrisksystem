import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Clock,
  Map,
  AlertTriangle,
  Menu,
  BarChart3,
  Brain,
  LogIn,
  Sun,
  Moon,
  Calendar,
  Layers
} from "lucide-react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains("dark");
  });

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const navigation = [
    { name: "Overview", path: "/", icon: LayoutDashboard },
    { name: "Accident Records", path: "/records", icon: Clock },
    { name: "Segment Risk Map", path: "/risk-map", icon: Map },
    { name: "Severity Risk Map", path: "/severity-map", icon: AlertTriangle },
  ];

  const analyticsNavigation = [
    { name: "Segment Risk Analysis", path: "/segment-risk", icon: Menu },
    { name: "Severity Analysis", path: "/severity-analysis", icon: BarChart3 },
    { name: "Time-Based Analysis", path: "/time-based", icon: Clock },
    { name: "Month-Based Analysis", path: "/month-risk", icon: Calendar },
    { name: "Road Environment Features", path: "/road-environment", icon: Layers },
    { name: "Accident Occurrence Prediction", path: "/ml-prediction", icon: Brain },
    { name: "Accident Environment Risk Prediction", path: "/environment-risk", icon: Brain },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-brand-gray-200">
      {/* Sidebar Header branding */}
      <div className="p-6 border-b border-brand-gray-200">
        <p className="text-[10px] font-extrabold text-gray-700 uppercase tracking-widest">Region of Interest</p>
        <h2 className="text-xl font-bold text-brand-blue-900 tracking-tight mt-1">A2 Road Section</h2>
        <p className="text-xs text-gray-700 font-semibold mt-0.5">Panadura – Aluthgama</p>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all relative ${active
                  ? "bg-brand-blue-50 text-brand-blue-900 border-l-4 border-brand-blue-800 -ml-1 pl-2"
                  : "text-gray-600 hover:bg-brand-gray-100 hover:text-gray-900"
                  }`}
              >
                <Icon className={`w-5 h-5 ${active ? "text-brand-blue-800" : "text-gray-400"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-2">
          <p className="px-3 text-[10px] font-extrabold text-gray-700 uppercase tracking-wider">Analytics</p>
          <nav className="space-y-1">
            {analyticsNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all relative ${active
                    ? "bg-brand-blue-50 text-brand-blue-900 border-l-4 border-brand-blue-800 -ml-1 pl-2"
                    : "text-gray-600 hover:bg-brand-gray-100 hover:text-gray-900"
                    }`}
                >
                  <Icon className={`w-5 h-5 ${active ? "text-brand-blue-800" : "text-gray-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer Link to Admin Login */}
      <div className="p-4 border-t border-brand-gray-200 bg-brand-gray-50">
        <Link
          to="/admin"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-brand-blue-800 hover:bg-brand-blue-900 text-white rounded text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <LogIn className="w-3.5 h-3.5" />
          Admin Portal
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-brand-gray-50">
      {/* Top Navbar */}
      <header className="bg-white border-b border-brand-gray-200 sticky top-0 z-50">
        <div className="mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo box */}
            <div className="w-10 h-10 bg-brand-blue-800 rounded-lg flex items-center justify-center text-white shadow-xs">
              {/* Bar Chart icon */}
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="font-bold text-brand-blue-900 text-sm md:text-base tracking-tight select-none">
              Road Accident Risk Prediction and Analysis System
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Topbar link for active dashboard tab */}
            <Link
              to="/"
              className={`text-sm font-bold border-b-2 px-1 py-5 -mb-[1px] transition-colors leading-none ${location.pathname === "/"
                ? "border-brand-blue-800 text-brand-blue-900"
                : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
            >
              Dashboard
            </Link>

            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 hover:text-brand-blue-800 hover:bg-brand-gray-50 rounded-full transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:bg-brand-gray-100 rounded-md"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex relative">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-16 h-[calc(100vh-64px)] z-40">
          <SidebarContent />
        </aside>

        {/* Mobile Sidebar overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/45" onClick={() => setMobileMenuOpen(false)} />
            <aside className="relative w-72 max-w-[80vw] h-full flex flex-col z-50">
              <SidebarContent />
            </aside>
          </div>
        )}

        {/* Content Wrapper */}
        <main className="flex-1 px-4 py-8 md:px-8 max-w-6xl mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PublicLayout;
