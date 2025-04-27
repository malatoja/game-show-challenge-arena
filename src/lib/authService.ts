
export interface AuthSettings {
  hostPassword: string | null;
  settingsPassword: string | null;
}

// Default auth settings
const defaultAuthSettings: AuthSettings = {
  hostPassword: null,
  settingsPassword: null
};

// Local storage keys
const AUTH_SETTINGS_KEY = 'discordGameShowAuthSettings';
const AUTH_HOST_SESSION_KEY = 'discordGameShowHostSession';
const AUTH_SETTINGS_SESSION_KEY = 'discordGameShowSettingsSession';

// Get stored auth settings
export const getAuthSettings = (): AuthSettings => {
  const storedSettings = localStorage.getItem(AUTH_SETTINGS_KEY);
  if (!storedSettings) {
    return defaultAuthSettings;
  }
  
  try {
    return JSON.parse(storedSettings) as AuthSettings;
  } catch (error) {
    console.error('Error parsing auth settings:', error);
    return defaultAuthSettings;
  }
};

// Save auth settings
export const saveAuthSettings = (settings: AuthSettings): void => {
  localStorage.setItem(AUTH_SETTINGS_KEY, JSON.stringify(settings));
};

// Update host password
export const updateHostPassword = (password: string | null): void => {
  const currentSettings = getAuthSettings();
  saveAuthSettings({
    ...currentSettings,
    hostPassword: password
  });
};

// Update settings password
export const updateSettingsPassword = (password: string | null): void => {
  const currentSettings = getAuthSettings();
  saveAuthSettings({
    ...currentSettings,
    settingsPassword: password
  });
};

// Check if host password is set
export const isHostPasswordSet = (): boolean => {
  const settings = getAuthSettings();
  return !!settings.hostPassword;
};

// Check if settings password is set
export const isSettingsPasswordSet = (): boolean => {
  const settings = getAuthSettings();
  return !!settings.settingsPassword;
};

// Check if user is authenticated for host page
export const isHostAuthenticated = (): boolean => {
  // If no password is set, they're automatically authenticated
  if (!isHostPasswordSet()) {
    return true;
  }
  
  // Check if they have a valid session
  return localStorage.getItem(AUTH_HOST_SESSION_KEY) === 'true';
};

// Check if user is authenticated for settings page
export const isSettingsAuthenticated = (): boolean => {
  // If no password is set, they're automatically authenticated
  if (!isSettingsPasswordSet()) {
    return true;
  }
  
  // Check if they have a valid session
  return localStorage.getItem(AUTH_SETTINGS_SESSION_KEY) === 'true';
};

// Authenticate for host
export const authenticateHost = (password: string): boolean => {
  const settings = getAuthSettings();
  
  if (settings.hostPassword === password) {
    localStorage.setItem(AUTH_HOST_SESSION_KEY, 'true');
    return true;
  }
  
  return false;
};

// Authenticate for settings
export const authenticateSettings = (password: string): boolean => {
  const settings = getAuthSettings();
  
  if (settings.settingsPassword === password) {
    localStorage.setItem(AUTH_SETTINGS_SESSION_KEY, 'true');
    return true;
  }
  
  return false;
};

// Logout from host
export const logoutHost = (): void => {
  localStorage.removeItem(AUTH_HOST_SESSION_KEY);
};

// Logout from settings
export const logoutSettings = (): void => {
  localStorage.removeItem(AUTH_SETTINGS_SESSION_KEY);
};
