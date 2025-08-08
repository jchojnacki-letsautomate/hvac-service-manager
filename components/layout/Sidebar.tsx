
import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Package,
  ClipboardList,
  AirVent,
  MessageSquare,
  Menu,
  X,
  Settings,
  BarChart3,
  LogOut,
  Shield,
  FileCheck,
  ShoppingBag
} from "lucide-react";
import { Button } from "../ui/button";

interface SidebarProps {
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export function Sidebar({ 
  isCollapsed: isCollapsedProp, 
  setIsCollapsed: setIsCollapsedProp, 
  isMobileOpen, 
  setIsMobileOpen 
}: SidebarProps = {}) {
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.hash.substring(1) || "/";
  });
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  
  // Use either the props or internal state
  const isCollapsed = isCollapsedProp !== undefined ? isCollapsedProp : internalIsCollapsed;
  const setIsCollapsed = setIsCollapsedProp || setInternalIsCollapsed;
  const mobileMenuOpen = isMobileOpen !== undefined ? isMobileOpen : internalMobileMenuOpen;
  const setMobileMenuOpen = setIsMobileOpen || setInternalMobileMenuOpen;

  // Update current path when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.substring(1) || "/");
    };
    
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: BarChart3,
    },
    {
      name: "Zlecenia",
      path: "/zlecenia",
      icon: ClipboardList,
    },
    {
      name: "Zamówienia",
      path: "/zamowienia",
      icon: ShoppingBag,
    },
    {
      name: "Protokoły",
      path: "/protokoly",
      icon: FileCheck,
    },
    {
      name: "Klienci",
      path: "/klienci",
      icon: Users,
    },
    {
      name: "Urządzenia",
      path: "/urzadzenia",
      icon: AirVent,
    },
    {
      name: "Dokumenty",
      path: "/dokumenty",
      icon: FileText,
    },
    {
      name: "Magazyn",
      path: "/magazyn",
      icon: Package,
    },
    {
      name: "Konwersacje",
      path: "/konwersacje",
      icon: MessageSquare,
    },
    {
      name: "Raporty",
      path: "/raporty",
      icon: BarChart3,
    },
    {
      name: "Uprawnienia",
      path: "/ustawienia",
      icon: Shield,
    },
  ];

  const isActive = (path: string) => {
    return currentPath.startsWith(path);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path: string) => {
    window.location.hash = path;
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // Backdrop click handler to close mobile menu
  const handleBackdropClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center h-14 px-4 border-b bg-background">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-semibold">AC-System</span>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden transition-opacity duration-200 ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleBackdropClick}
      >
        <div 
          className={`fixed inset-y-0 left-0 w-64 max-w-[80%] bg-sidebar text-sidebar-foreground shadow-lg transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border">
            <span className="font-semibold">AC-System</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="text-sidebar-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="py-2 overflow-y-auto h-[calc(100%-3.5rem)]">
            <nav className="space-y-0.5 px-2">
              {navigationItems.map((item) => (
                <a
                  key={item.path}
                  href={`#${item.path}`}
                  className={`flex items-center px-3 py-2.5 rounded-md transition-colors ${
                    isActive(item.path)
                      ? "sidebar-item-active"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation(item.path);
                  }}
                >
                  <item.icon className="h-4.5 w-4.5 mr-3" />
                  <span className="text-sm">{item.name}</span>
                </a>
              ))}
            </nav>
          </div>
          <div className="absolute bottom-0 w-full p-3 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50 text-sm"
            >
              <LogOut className="h-4.5 w-4.5 mr-3" />
              <span>Wyloguj</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden md:flex flex-col fixed top-0 left-0 h-full bg-sidebar text-sidebar-foreground z-30 ${
          isCollapsed ? "w-16" : "w-56"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-sidebar-border">
          {!isCollapsed && <span className="font-semibold text-sm">AC-System</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-sidebar-foreground h-8 w-8 ml-auto"
          >
            {isCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex-1 py-2 overflow-y-auto">
          <nav className="space-y-0.5 px-2">
            {navigationItems.map((item) => (
              <a
                key={item.path}
                href={`#${item.path}`}
                className={`flex items-center px-3 py-2.5 rounded-md transition-colors ${
                  isActive(item.path)
                    ? "sidebar-item-active"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.name : ""}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation(item.path);
                }}
              >
                <item.icon className="h-4.5 w-4.5" />
                {!isCollapsed && <span className="ml-3 text-sm">{item.name}</span>}
              </a>
            ))}
          </nav>
        </div>
        <div className="p-3 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className={`text-sidebar-foreground hover:bg-sidebar-accent/50 text-sm ${
              isCollapsed ? "w-10 h-10 p-0 mx-auto justify-center" : "w-full justify-start"
            }`}
          >
            <LogOut className="h-4.5 w-4.5" />
            {!isCollapsed && <span className="ml-3">Wyloguj</span>}
          </Button>
        </div>
      </div>
      
      {/* Mobile top spacing to account for the fixed header */}
      <div className="h-14 md:hidden"></div>
    </>
  );
}
