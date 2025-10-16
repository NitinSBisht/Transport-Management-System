import { NavigateFunction } from 'react-router-dom';

// Global navigation function that can be set from the App component
let globalNavigate: NavigateFunction | null = null;

/**
 * Set the global navigate function
 * This should be called once in the App component
 */
export const setNavigate = (navigate: NavigateFunction) => {
  globalNavigate = navigate;
};

/**
 * Navigate to a route from anywhere in the app (including non-React contexts)
 * Falls back to window.location.href if navigate is not set
 */
export const navigateTo = (path: string, replace: boolean = false) => {
  if (globalNavigate) {
    globalNavigate(path, { replace });
  } else {
    // Fallback to window.location if navigate is not available
    if (replace) {
      window.location.replace(path);
    } else {
      window.location.href = path;
    }
  }
};
