import React from 'react';

// Loading Spinner Component
export const LoadingSpinner = ({ size = 'md', color = 'yellow' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    yellow: 'text-yellow-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400'
  };

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}>
      <svg fill="none" viewBox="0 0 24 24">
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

// Progress Bar Component
export const ProgressBar = ({ value, max = 100, color = 'blue', showLabel = true, size = 'md' }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    blue: 'bg-blue-400',
    green: 'bg-green-400',
    yellow: 'bg-yellow-400',
    red: 'bg-red-400',
    purple: 'bg-purple-400'
  };

  return (
    <div className="w-full">
      <div className={`bg-slate-700 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div 
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-sm text-slate-400 mt-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};

// Status Badge Component
export const StatusBadge = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const statusConfig = {
    active: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '●' },
    inactive: { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: '●' },
    pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: '●' },
    error: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '●' },
    success: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '✓' },
    warning: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: '⚠' },
    expired: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '✗' }
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <span className={`inline-flex items-center space-x-1 rounded-full border font-medium ${sizeClasses[size]} ${config.color}`}>
      <span>{config.icon}</span>
      <span className="capitalize">{status}</span>
    </span>
  );
};

// Card Component
export const Card = ({ children, className = '', hover = true, padding = 'md' }) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <div className={`
      bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 
      ${hover ? 'hover:border-slate-600/50 hover:bg-slate-800/60 transition-all' : ''}
      ${paddingClasses[padding]}
      ${className}
    `}>
      {children}
    </div>
  );
};

// Button Component
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all transform focus:outline-none focus:ring-2 focus:ring-yellow-400/50 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900 hover:scale-105',
    secondary: 'bg-slate-600 hover:bg-slate-500 text-white',
    success: 'bg-gradient-to-r from-green-400 to-green-600 hover:opacity-90 text-white',
    danger: 'bg-gradient-to-r from-red-400 to-red-600 hover:opacity-90 text-white',
    outline: 'border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white hover:bg-slate-800/50'
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <LoadingSpinner size="sm" color={variant === 'primary' ? 'yellow' : 'blue'} />
          <span>Loading...</span>
        </div>
      ) : children}
    </button>
  );
};

// Input Component
export const Input = ({ 
  label,
  error,
  helper,
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-3 bg-slate-700 rounded-xl text-white placeholder-slate-400 
          transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/50
          ${error ? 
            'border-red-400 focus:border-red-400' : 'border-slate-600 focus:border-yellow-400'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
      {helper && !error && (
        <p className="text-slate-500 text-sm mt-1">{helper}</p>
      )}
    </div>
  );
};

// Toast/Notification Component
export const Toast = ({ message, type = 'info', isVisible, onClose }) => {
  if (!isVisible) return null;

  const typeClasses = {
    success: 'bg-green-500/20 border-green-500/30 text-green-400',
    error: 'bg-red-500/20 border-red-500/30 text-red-400',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-400'
  };

  const icons = {
    success: '✓',
    error: '✗',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`
      fixed top-4 right-4 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl border backdrop-blur-sm
      ${typeClasses[type]} animate-slide-up
    `}>
      <span className="text-lg">{icons[type]}</span>
      <span className="font-medium">{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 text-current hover:opacity-70 transition-opacity"
      >
        ×
      </button>
    </div>
  );
};

// Hook for Toast notifications
export const useToast = () => {
  const [toast, setToast] = React.useState({ isVisible: false, message: '', type: 'info' });

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isVisible: false }));
    }, 4000);
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return { toast, showToast, hideToast };
};

// Modal Component
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative bg-slate-800 rounded-xl border border-slate-700/50 w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// Select Component
export const Select = ({ 
  label,
  error,
  helper,
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  className = ''
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`
          w-full px-4 py-3 bg-slate-700 rounded-xl text-white 
          transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/50
          ${error ? 
            'border-red-400 focus:border-red-400' : 'border-slate-600 focus:border-yellow-400'}
          ${className}
        `}
      >
        <option value="" disabled className="text-slate-400">
          {placeholder}
        </option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            className="bg-slate-700 text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-400 text-sm mt-1">{error}</p>
      )}
      {helper && !error && (
        <p className="text-slate-500 text-sm mt-1">{helper}</p>
      )}
    </div>
  );
};

// Tooltip Component
export const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-50 px-2 py-1 text-xs text-white bg-slate-900 rounded border border-slate-700/50 ${positionClasses[position]}`}>
          {content}
        </div>
      )}
    </div>
  );
};

// Badge Component
export const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const variantClasses = {
    default: 'bg-slate-600 text-slate-200',
    primary: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses[size]} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

// Tabs Component
export const Tabs = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`border-b border-slate-700/50 ${className}`}>
      <nav className="flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
            }`}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

// Alert Component
export const Alert = ({ type = 'info', title, message, onClose, className = '' }) => {
  const typeClasses = {
    info: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
    success: 'bg-green-500/20 border-green-500/30 text-green-400',
    warning: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    error: 'bg-red-500/20 border-red-500/30 text-red-400'
  };

  const icons = {
    info: 'ℹ',
    success: '✓',
    warning: '⚠',
    error: '✗'
  };

  return (
    <div className={`rounded-xl border p-4 ${typeClasses[type]} ${className}`}>
      <div className="flex items-start space-x-3">
        <span className="text-lg">{icons[type]}</span>
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold mb-1">{title}</h4>
          )}
          <p className="text-sm opacity-90">{message}</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-current hover:opacity-70 transition-opacity"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
