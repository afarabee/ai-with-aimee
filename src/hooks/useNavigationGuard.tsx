import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface NavigationGuardContextType {
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  pendingNavigation: string | null;
  setPendingNavigation: (path: string | null) => void;
  onSave: (() => Promise<void>) | null;
  setOnSave: (fn: (() => Promise<void>) | null) => void;
}

const NavigationGuardContext = createContext<NavigationGuardContextType | null>(null);

export function NavigationGuardProvider({ children }: { children: ReactNode }) {
  const [isDirty, setIsDirty] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [onSave, setOnSave] = useState<(() => Promise<void>) | null>(null);

  return (
    <NavigationGuardContext.Provider value={{ 
      isDirty, 
      setIsDirty, 
      pendingNavigation, 
      setPendingNavigation,
      onSave,
      setOnSave: (fn) => setOnSave(() => fn),
    }}>
      {children}
    </NavigationGuardContext.Provider>
  );
}

export function useNavigationGuard() {
  const context = useContext(NavigationGuardContext);
  if (!context) {
    // Return a no-op version if not wrapped in provider
    return {
      isDirty: false,
      setIsDirty: () => {},
      pendingNavigation: null,
      setPendingNavigation: () => {},
      onSave: null,
      setOnSave: () => {},
    };
  }
  return context;
}
