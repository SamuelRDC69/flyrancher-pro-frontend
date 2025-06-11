// Date and Time Utilities
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTimeRemaining = (expiresAt: string): string => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'Expired';
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  
  return 'Less than 1 minute';
};

export const formatCountdown = (seconds: number): string => {
  if (seconds <= 0) return 'Ready';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

export const isExpiringSoon = (expiresAt: string, warningDays: number = 5): boolean => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  return diffDays >= 0 && diffDays <= warningDays;
};

// Currency and Number Utilities
export const formatWAX = (amount: number | string, decimals: number = 4): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `${num.toFixed(decimals)} WAX`;
};

export const formatNumber = (num: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(num);
};

export const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(1)}%`;
};

export const calculateDiscount = (originalPrice: number, discountPercent: number): number => {
  return originalPrice * (discountPercent / 100);
};

export const calculateDiscountedPrice = (originalPrice: number, discountPercent: number): number => {
  return originalPrice - calculateDiscount(originalPrice, discountPercent);
};

// Validation Utilities
export const validateWaxAccount = (account: string): boolean => {
  if (!account || typeof account !== 'string') return false;
  
  // WAX account names are 1-12 characters, lowercase letters, numbers 1-5, and dots
  const waxAccountRegex = /^[a-z1-5.]{1,12}$/;
  return waxAccountRegex.test(account) && account.length >= 3;
};

export const validateWaxAmount = (amount: string): { valid: boolean; error?: string } => {
  if (!amount || amount.trim() === '') {
    return { valid: false, error: 'Amount is required' };
  }
  
  const num = parseFloat(amount);
  if (isNaN(num)) {
    return { valid: false, error: 'Invalid amount format' };
  }
  
  if (num <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }
  
  if (num > 1000000) {
    return { valid: false, error: 'Amount is too large' };
  }
  
  // Check decimal places (WAX has 8 decimal places max)
  const decimalPlaces = (amount.split('.')[1] || '').length;
  if (decimalPlaces > 8) {
    return { valid: false, error: 'Too many decimal places (max 8)' };
  }
  
  return { valid: true };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Array and Object Utilities
export const removeDuplicates = <T>(array: T[], key?: keyof T): T[] => {
  if (!key) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// String Utilities
export const truncateAddress = (address: string, start: number = 6, end: number = 4): string => {
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const camelToTitle = (str: string): string => {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
};

// URL and Navigation Utilities
export const buildExplorerUrl = (transactionId: string, isTestnet: boolean = false): string => {
  const baseUrl = isTestnet 
    ? 'https://wax-testnet.bloks.io/transaction'
    : 'https://waxblock.io/transaction';
  return `${baseUrl}/${transactionId}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackError) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

// Storage Utilities
export const setLocalStorage = (key: string, value: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

export const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Failed to read from localStorage:', error);
    return defaultValue;
  }
};

export const removeLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
  }
};

// Error Handling Utilities
export const createAppError = (code: string, message: string, details?: any): any => {
  return {
    code,
    message,
    details,
    timestamp: new Date().toISOString()
  };
};

export const isNetworkError = (error: any): boolean => {
  return error.name === 'NetworkError' || 
         error.message?.includes('network') ||
         error.message?.includes('fetch');
};

export const getErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unexpected error occurred';
};

// Async Utilities
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const retry = async <T>(
  fn: () => Promise<T>, 
  maxAttempts: number = 3, 
  delay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }
      
      await sleep(delay * attempt);
    }
  }
  
  throw lastError;
};

export const timeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error('Operation timed out')), ms);
  });
  
  return Promise.race([promise, timeoutPromise]);
};

// Debounce and Throttle
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Browser Detection
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isTouchDevice = (): boolean => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Feature Detection
export const supportsClipboard = (): boolean => {
  return navigator.clipboard && navigator.clipboard.writeText;
};

export const supportsLocalStorage = (): boolean => {
  try {
    const test = '__test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Color Utilities for Status
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'text-green-400',
    inactive: 'text-gray-400',
    expired: 'text-red-400',
    pending: 'text-yellow-400',
    cancelled: 'text-gray-400',
    confirmed: 'text-green-400',
    failed: 'text-red-400',
    processing: 'text-blue-400',
    error: 'text-red-400',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  };
  
  return colors[status.toLowerCase()] || 'text-gray-400';
};

export const getStatusIcon = (status: string): string => {
  const icons: Record<string, string> = {
    active: '●',
    inactive: '○',
    expired: '✗',
    pending: '⏳',
    cancelled: '✗',
    confirmed: '✓',
    failed: '✗',
    processing: '⏳',
    error: '✗',
    success: '✓',
    warning: '⚠',
    info: 'ℹ'
  };
  
  return icons[status.toLowerCase()] || '○';
};
