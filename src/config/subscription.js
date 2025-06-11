// Subscription Configuration
export const SUBSCRIPTION_CONFIG = {
  // API Configuration
  API: {
    BASE_URL: 'https://flyrancher-sub.onrender.com',
    ENDPOINTS: {
      STATUS: '/subscription/status',
      SUBSCRIBE: '/subscription/process',
      PAYMENTS: '/subscription/payments',
      METRICS: '/subscription/metrics',
      HEALTH: '/subscription/system/status'
    }
  },

  // Network Configuration
  NETWORKS: {
    MAINNET: {
      name: 'WAX Mainnet',
      chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
      rpcEndpoint: 'https://wax.greymass.com',
      paymentWallet: 'payment.gm',
      explorerUrl: 'https://waxblock.io'
    },
    TESTNET: {
      name: 'WAX Testnet',
      chainId: 'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
      rpcEndpoint: 'https://testnet.waxsweden.org',
      paymentWallet: 'testpay.gm',
      explorerUrl: 'https://wax-testnet.bloks.io'
    }
  },

  // Subscription Tiers
  TIERS: {
    basic: {
      id: 'basic',
      name: 'Basic',
      price: 8, // WAX per month
      walletLimit: 2,
      features: [
        'Auto-Claim NFTs',
        'Basic Dashboard',
        'Email Support'
      ],
      workers: [],
      color: 'from-slate-400 to-slate-600',
      icon: '🥉',
      description: 'Perfect for beginners with a few NFTs'
    },
    standard: {
      id: 'standard',
      name: 'Standard', 
      price: 15, // WAX per month
      walletLimit: 5,
      features: [
        'Auto-Claim NFTs',
        'Energy Management',
        'Bronze Workers',
        'Silver Workers',
        'Advanced Dashboard',
        'Priority Support'
      ],
      workers: ['bronze', 'silver'],
      color: 'from-blue-400 to-blue-600',
      icon: '🥈',
      description: 'Ideal for serious farmers with multiple wallets'
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      price: 25, // WAX per month
      walletLimit: 10,
      features: [
        'Auto-Claim NFTs',
        'Tool Repair Automation',
        'Energy Management',
        'All Worker Types',
        'Advanced Analytics',
        'Custom Strategies',
        'Priority Support',
        'Discord Access'
      ],
      workers: ['bronze', 'silver', 'gold', 'platinum'],
      color: 'from-purple-400 to-purple-600',
      icon: '🥇',
      description: 'Ultimate automation for professional farmers'
    }
  },

  // Duration Options with Discounts
  DURATION_OPTIONS: [
    {
      value: 1,
      label: '1 Month',
      discount: 0,
      popular: false
    },
    {
      value: 2,
      label: '2 Months',
      discount: 5, // 5% discount
      popular: false
    },
    {
      value: 3,
      label: '3 Months',
      discount: 10, // 10% discount
      popular: true
    }
  ],

  // Add-on Services
  ADDONS: {
    REPAIR: {
      id: 'REPAIR',
      name: 'Tool Repair Service',
      description: 'Automatic tool repair when durability drops below threshold',
      price: 2, // WAX per month
      icon: '🔧'
    },
    ENERGY: {
      id: 'ENERGY',
      name: 'Energy Management',
      description: 'Smart energy refill automation',
      price: 1.5, // WAX per month
      icon: '⚡'
    },
    ANALYTICS: {
      id: 'ANALYTICS',
      name: 'Advanced Analytics',
      description: 'Detailed performance reports and insights',
      price: 3, // WAX per month
      icon: '📊'
    }
  },

  // Payment Configuration
  PAYMENT: {
    TOKEN_SYMBOL: 'WAX',
    TOKEN_PRECISION: 8,
    MEMO_PATTERNS: {
      NEW_SUBSCRIPTION: 'N-{duration}-{tier}:{wallets}',
      ADD_WALLET: 'A-{duration}-X:{wallets}',
      WALLET_RENEWAL: 'W-{duration}-X:{wallets}',
      SUBSCRIPTION_ADDON: 'FS-{duration}-{addon}:',
      WALLET_ADDON: 'FW-{duration}-{addon}:{wallets}',
      SUBSCRIPTION_RENEWAL: 'R-{duration}-{tier}:',
      UPGRADE: 'U-{duration}-{tier}:'
    },
    CONFIRMATION_BLOCKS: 1,
    TIMEOUT_SECONDS: 300
  },

  // Validation Rules
  VALIDATION: {
    WALLET_REGEX: /^[a-z1-5.]{1,12}$/,
    MIN_WALLET_LENGTH: 3,
    MAX_WALLET_LENGTH: 12,
    MAX_WALLETS_PER_TRANSACTION: 10,
    MIN_DURATION: 1,
    MAX_DURATION: 12
  },

  // UI Configuration
  UI: {
    REFRESH_INTERVAL: 30000, // 30 seconds
    TOAST_DURATION: 4000, // 4 seconds
    ANIMATION_DURATION: 300, // 300ms
    POLLING_INTERVAL: 5000, // 5 seconds for payment confirmation
    MAX_RETRIES: 3
  },

  // Status Types
  STATUS: {
    SUBSCRIPTION: {
      ACTIVE: 'active',
      EXPIRED: 'expired',
      PENDING: 'pending',
      CANCELLED: 'cancelled'
    },
    PAYMENT: {
      PENDING: 'pending',
      CONFIRMED: 'confirmed',
      FAILED: 'failed',
      PROCESSING: 'processing'
    },
    WALLET: {
      ACTIVE: 'active',
      INACTIVE: 'inactive',
      ERROR: 'error'
    }
  }
};

// Helper Functions
export const getNetworkConfig = (isTestnet = false) => {
  return isTestnet ? SUBSCRIPTION_CONFIG.NETWORKS.TESTNET : SUBSCRIPTION_CONFIG.NETWORKS.MAINNET;
};

export const getTierConfig = (tierId) => {
  return SUBSCRIPTION_CONFIG.TIERS[tierId];
};

export const calculatePrice = (tier, duration, addons = []) => {
  const tierConfig = getTierConfig(tier);
  if (!tierConfig) return 0;

  const durationOption = SUBSCRIPTION_CONFIG.DURATION_OPTIONS.find(d => d.value === duration);
  const basePrice = tierConfig.price * duration;
  const discount = durationOption ? (basePrice * durationOption.discount) / 100 : 0;
  
  const addonPrice = addons.reduce((total, addonId) => {
    const addon = SUBSCRIPTION_CONFIG.ADDONS[addonId];
    return total + (addon ? addon.price * duration : 0);
  }, 0);

  return (basePrice - discount + addonPrice).toFixed(4);
};

export const generateMemo = (type, options = {}) => {
  const patterns = SUBSCRIPTION_CONFIG.PAYMENT.MEMO_PATTERNS;
  let pattern = patterns[type];
  
  if (!pattern) return '';

  // Replace placeholders
  return pattern
    .replace('{duration}', options.duration || 1)
    .replace('{tier}', getTierCode(options.tier))
    .replace('{wallets}', (options.wallets || []).join(','))
    .replace('{addon}', options.addon || '');
};

export const getTierCode = (tier) => {
  const codes = { basic: 'B', standard: 'S', premium: 'P' };
  return codes[tier] || 'B';
};

export const validateWalletName = (wallet) => {
  const { WALLET_REGEX, MIN_WALLET_LENGTH, MAX_WALLET_LENGTH } = SUBSCRIPTION_CONFIG.VALIDATION;
  
  if (!wallet || typeof wallet !== 'string') return false;
  if (wallet.length < MIN_WALLET_LENGTH || wallet.length > MAX_WALLET_LENGTH) return false;
  
  return WALLET_REGEX.test(wallet);
};

export const validateWalletList = (wallets, maxLimit = 10) => {
  if (!Array.isArray(wallets)) return { valid: false, error: 'Wallets must be an array' };
  if (wallets.length === 0) return { valid: false, error: 'At least one wallet is required' };
  if (wallets.length > maxLimit) return { valid: false, error: `Maximum ${maxLimit} wallets allowed` };

  const invalidWallets = wallets.filter(wallet => !validateWalletName(wallet));
  if (invalidWallets.length > 0) {
    return { valid: false, error: `Invalid wallet names: ${invalidWallets.join(', ')}` };
  }

  const uniqueWallets = [...new Set(wallets)];
  if (uniqueWallets.length !== wallets.length) {
    return { valid: false, error: 'Duplicate wallets detected' };
  }

  return { valid: true };
};

export const formatTimeRemaining = (expiresAt) => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'Expired';
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  
  return 'Less than 1 hour';
};

export const getStatusColor = (status) => {
  const colors = {
    active: 'text-green-400',
    expired: 'text-red-400',
    pending: 'text-yellow-400',
    cancelled: 'text-gray-400'
  };
  return colors[status] || 'text-gray-400';
};

export const isSubscriptionExpiringSoon = (expiresAt, warningDays = 5) => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  return diffDays >= 0 && diffDays <= warningDays;
};

export default SUBSCRIPTION_CONFIG;
