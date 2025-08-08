
import React, { useState, useEffect } from "react";
import "./styles/globals.css";
import { Toaster } from "sonner";
import { Sidebar } from "./components/layout/Sidebar";
import { OrdersList } from "./components/orders/OrdersList";
import { OrderDetail } from "./components/orders/OrderDetail";
import { ServiceOrdersList } from "./components/serviceOrders/ServiceOrdersList";
import { ServiceOrderDetail } from "./components/serviceOrders/ServiceOrderDetail";
import { ConversationsList } from "./components/conversations/ConversationsList";
import { ConversationDetails } from "./components/conversations/ConversationDetails";

// Kompletna aplikacja HVAC Service Manager
// Wersja: 1.0.0
// Data: 22.05.2025
// Autor: Figma Make

// Kolory marki:
// - Granatowy: #0e1c47 (--primary, --sidebar)
// - Pomarańczowy: #ff8c00 (--secondary, --accent, --sidebar-primary)

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-full max-w-md p-8 space-y-4 bg-card rounded-lg shadow-lg border border-border">
            <h2 className="text-2xl font-bold text-destructive">Wystąpił błąd</h2>
            <div className="bg-muted p-4 rounded-md overflow-auto">
              <code className="text-sm">{this.state.error?.toString()}</code>
            </div>
            <p className="text-muted-foreground">
              Proszę odświeżyć stronę lub skontaktować się z administratorem systemu.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Odśwież stronę
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  // State to track current route
  const [currentRoute, setCurrentRoute] = useState(() => {
    // Get initial route from window.location.hash
    return window.location.hash.substring(1) || "/";
  });

  // State to track sidebar collapse state with localStorage persistence
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    // Check localStorage for saved preference
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });

  // State to track mobile menu open state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Route parameters (e.g., for item IDs)
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1) || "/";
      setCurrentRoute(hash);
      
      // Extract params from route (e.g., /zlecenia/123 -> { id: "123" })
      const parts = hash.split("/");
      if (parts.length >= 2 && parts[1] && parts.length === 3) {
        setRouteParams({ id: parts[2] });
      } else {
        setRouteParams({});
      }
      
      // Close mobile menu when route changes
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener("hashchange", handleHashChange);
    
    // Initial call to parse the current hash
    handleHashChange();
    
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [isMobileMenuOpen]);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Helper to navigate programmatically
  const navigate = (path: string) => {
    window.location.hash = path;
  };

  // Handle sidebar toggle
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Render the appropriate component based on the route
  const renderContent = () => {
    // Extract base route (e.g., /zlecenia/123 -> /zlecenia)
    const baseRoute = `/${currentRoute.split("/")[1]}`;
    
    switch (baseRoute) {
      case "/":
        return <ServiceOrdersList />;
      
      case "/zlecenia":
        if (routeParams.id) {
          return <ServiceOrderDetail id={routeParams.id} />;
        }
        return <ServiceOrdersList />;
      
      case "/zamowienia":
        if (routeParams.id) {
          return <OrderDetail orderId={routeParams.id} />;
        }
        return <OrdersList />;
      
      case "/konwersacje":
        if (routeParams.id) {
          return <ConversationDetails conversationId={routeParams.id} />;
        }
        if (currentRoute === "/konwersacje/nowa") {
          return <ConversationDetails isNew={true} />;
        }
        return <ConversationsList />;
      
      default:
        return <ServiceOrdersList />;
    }
  };

  // Calculate dynamic classes for main content
  const mainContentClasses = `flex-1 overflow-auto transition-all duration-300 ease-in-out ${
    isSidebarCollapsed ? 'md:ml-16' : 'md:ml-56'
  } p-4 md:p-6`;

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar 
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
        />
        
        <main className={mainContentClasses}>
          {renderContent()}
        </main>
      </div>
      
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'var(--card)',
            color: 'var(--card-foreground)',
            border: '1px solid var(--border)'
          }
        }}
      />
    </ErrorBoundary>
  );
}
