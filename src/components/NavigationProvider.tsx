import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigate } from '../utils/navigation';

/**
 * NavigationProvider component
 * Sets up the global navigate function for use outside React components
 */
const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return <>{children}</>;
};

export default NavigationProvider;
