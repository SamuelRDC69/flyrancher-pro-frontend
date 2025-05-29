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
    warning: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: '⚠' }
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
  const baseClasses = 'font-semibold rounded-xl transition-all transform focus:outline-none focus:ring-2 focus:ring-yellow-400/50 disabled:opacity-50 disabled:cursor-not-allowed';
  
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
          <LoadingSpinner size="sm" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

// Modal Component
export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'md' }) => {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-slate-800 rounded-2xl p-6 w-full ${maxWidthClasses[maxWidth]} border border-slate-700 animate-scale-in`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white">{title}</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
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
    <div className="space-y-2">
      {label && (
        <label className="block text-slate-300 text-sm font-medium">
          {label}
        </label>
      )}
      <input
        className={`
          w-full bg-slate-900/50 border rounded-lg px-4 py-3 text-white placeholder-slate-500 
          transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400/50
          ${error ? 'border-red-400 focus:border-red-400' : 'border-slate-600 focus:border-yellow-400'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
      {helper && !error && (
        <p className="text-slate-500 text-sm">{helper}</p>
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
