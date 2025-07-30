import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Config, defaultConfig, validateConfig } from '../config/config';

interface ConfigContextType {
  config: Config;
  updateConfig: (newConfig: Partial<Config>) => void;
  resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const STORAGE_KEY = 'secure-redirect-config';

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config>(defaultConfig);

  useEffect(() => {
    const loadConfig = () => {
      try {
        const storedConfig = localStorage.getItem(STORAGE_KEY);
        if (storedConfig) {
          const parsedConfig = JSON.parse(storedConfig);
          const validatedConfig = validateConfig(parsedConfig);
          setConfig(current => ({ ...current, ...validatedConfig }));
        }
      } catch (e) {
        console.error('Failed to load configuration:', e);
      }
    };

    loadConfig();
  }, []);

  const updateConfig = (newConfig: Partial<Config>) => {
    setConfig(current => {
      const validatedConfig = validateConfig(newConfig);
      const updated = { ...current, ...validatedConfig };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save configuration:', e);
      }
      return updated;
    });
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = (): ConfigContextType => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};