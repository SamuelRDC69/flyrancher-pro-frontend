// Configuration constants for the WAX NFT Claimer frontend
export const CONFIG = {
  // Network Configuration
  NETWORKS: {
    MAINNET: {
      chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
      rpcEndpoint: 'https://wax.greymass.com',
      name: 'WAX Mainnet',
      explorer: 'https://wax.bloks.io'
    },
    TESTNET: {
      chainId: 'a4d0f5b8f2f4f8d9c8a2f5b4e1d8f3c2a1f9d5e3c8b7a1f2d4e8c9f5b2a3d6e7',
      rpcEndpoint: 'https://wax-testnet.greymass.com',
      name: 'WAX Testnet',
      explorer: 'https://wax-test.bloks.io'
    }
  },

  // Smart Contract Configuration (for future implementation)
  CONTRACTS: {
    SUBSCRIPTION_MANAGER: {
      MAINNET: 'flyrancher.gm', // Your future contract account
      TESTNET: 'flyrancher.gm'  // Same account for testing
    },
    PAYMENT_PROCESSOR: {
      MAINNET: 'flyrancher.gm',
      TESTNET: 'flyrancher.gm'
    }
  },

  // Payment Configuration
  PAYMENT: {
    WALLET_ADDRESS: {
      MAINNET: 'flyrancher.gm',
      TESTNET: 'flyrancher.gm'
    },
    WAX_USD_RATE: 2.5, // Approximate rate: $1 = 2.5 WAX
    MEMO_FORMAT: 'FLYRANCHER_SUB_{TIER}_{USER}_{TIMESTAMP}'
  },

  // Subscription Tiers Configuration
  SUBSCRIPTION_TIERS: {
    BASIC: {
      id: 'basic',
      name: 'Basic',
      price: 8, // USD per month
      walletLimit: 2,
      features: ['auto_claim'],
      workers: [],
      description: 'Perfect for beginners with a few NFTs',
      color: 'from-slate-400 to-slate-600'
    },
    STANDARD: {
      id: 'standard', 
      name: 'Standard',
      price: 15,
      walletLimit: 5,
      features: ['auto_claim', 'energy_management', 'bronze_workers', 'silver_workers'],
      workers: ['bronze', 'silver'],
      description: 'Ideal for active players with multiple tools',
      color: 'from-blue-400 to-blue-600',
      popular: true
    },
    PREMIUM: {
      id: 'premium',
      name: 'Premium', 
      price: 25,
      walletLimit: 10,
      features: ['auto_claim', 'tool_repair', 'energy_management', 'all_workers'],
      workers: ['bronze', 'silver', 'gold', 'platinum'],
      description: 'Full automation for serious farmers',
      color: 'from-purple-400 to-purple-600'
    }
  },

  // Worker Types (NFTs that increase tool capacity)
  WORKER_TYPES: {
    BRONZE: {
      name: 'Bronze Worker',
      capacity: 2, // +2 tool slots
      rarity: 'Common',
      color: '#CD7F32'
    },
    SILVER: {
      name: 'Silver Worker', 
      capacity: 3, // +3 tool slots
      rarity: 'Uncommon',
      color: '#C0C0C0'
    },
    GOLD: {
      name: 'Gold Worker',
      capacity: 5, // +5 tool slots  
      rarity: 'Rare',
      color: '#FFD700'
    },
    PLATINUM: {
      name: 'Platinum Worker',
      capacity: 8, // +8 tool slots
      rarity: 'Legendary', 
      color: '#E5E4E2'
    }
  },

  // Tool Types Configuration
  TOOL_TYPES: {
    RANCH: {
      name: 'Ranch Tools',
      baseCapacity: 5,
      energyCost: true,
      repairRequired: true,
      types: ['Goose Coop', 'Chicken Coop', 'Stable', 'Barn']
    },
    FARM: {
      name: 'Farm Tools', 
      baseCapacity: 5,
      energyCost: false,
      repairRequired: true,
      types: ['Sickle', 'Scythe', 'Harvester']
    },
    TOOL: {
      name: 'Tool Workshop',
      baseCapacity: 5, 
      energyCost: true,
      repairRequired: true,
      types: ['Workshop']
    }
  },

  // API Endpoints (for future backend integration)
  API_ENDPOINTS: {
    SUBSCRIPTION_STATUS: '/api/subscription/status',
    PAYMENT_VERIFY: '/api/payment/verify',
    WALLET_MANAGE: '/api/wallets',
    TOOL_STATUS: '/api/tools/status',
    ACTIVITY_LOG: '/api/activity',
    USER_PROFILE: '/api/user/profile'
  },

  // Local Storage Keys
  STORAGE_KEYS: {
    USER_WALLETS: 'flyrancher_user_wallets',
    SUBSCRIPTION_DATA: 'flyrancher_subscription',
    NETWORK_PREFERENCE: 'flyrancher_network',
    USER_PREFERENCES: 'flyrancher_preferences'
  },

  // UI Configuration
  UI: {
    ITEMS_PER_PAGE: 10,
    ANIMATION_DURATION: 300,
    TOAST_DURATION: 4000,
    AUTO_REFRESH_INTERVAL: 30000, // 30 seconds
    WARNING_DAYS_BEFORE_EXPIRY: 5
  },

  // Status Types
  STATUS_TYPES: {
    SUBSCRIPTION: ['active', 'expired', 'pending', 'cancelled'],
    WALLET: ['active', 'inactive', 'error'],
    TOOL: ['operational', 'needs_repair', 'low_energy', 'ready'],
    PAYMENT: ['pending', 'confirmed', 'failed']
  }
};

// Helper Functions
export const getNetworkConfig = (isTestnet = false) => {
  return isTestnet ? CONFIG.NETWORKS.TESTNET : CONFIG.NETWORKS.MAINNET;
};

export const getContractAddress = (contractName, isTestnet = false) => {
  const network = isTestnet ? 'TESTNET' : 'MAINNET';
  return CONFIG.CONTRACTS[contractName]?.[network];
};

export const calculateWAXAmount = (usdAmount) => {
  return (usdAmount * CONFIG.PAYMENT.WAX_USD_RATE).toFixed(4);
};

export const generatePaymentMemo = (tier, userAccount) => {
  return CONFIG.PAYMENT.MEMO_FORMAT
    .replace('{TIER}', tier.toUpperCase())
    .replace('{USER}', userAccount)
    .replace('{TIMESTAMP}', Date.now().toString());
};

export const getTierByPrice = (price) => {
  return Object.values(CONFIG.SUBSCRIPTION_TIERS).find(tier => tier.price === price);
};

export const canAddWallet = (currentWallets, subscriptionTier) => {
  const tier = CONFIG.SUBSCRIPTION_TIERS[subscriptionTier?.toUpperCase()];
  return tier ? currentWallets.length < tier.walletLimit : false;
};

export const hasFeature = (subscriptionTier, feature) => {
  const tier = CONFIG.SUBSCRIPTION_TIERS[subscriptionTier?.toUpperCase()];
  return tier ? tier.features.includes(feature) : false;
};

export const getDaysUntilExpiry = (expirationDate) => {
  const now = new Date();
  const expiry = new Date(expirationDate);
  const diffTime = expiry - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const shouldShowExpiryWarning = (expirationDate) => {
  const daysUntil = getDaysUntilExpiry(expirationDate);
  return daysUntil <= CONFIG.UI.WARNING_DAYS_BEFORE_EXPIRY && daysUntil > 0;
};

// Type definitions for TypeScript (optional)
export interface SubscriptionTier {
  id: string;
  name: string;
  price: number;
  walletLimit: number;
  features: string[];
  workers: string[];
  description: string;
  color: string;
  popular?: boolean;
}

export interface UserWallet {
  id: number;
  address: string;
  assetIds: string[];
  status: 'active' | 'inactive' | 'error';
  lastClaim: string;
  addedAt: string;
}

export interface ToolStatus {
  id: number;
  name: string;
  owner: string;
  assetId: string;
  durability: number;
  energy: number;
  nextClaim: number; // seconds until next claim
  status: 'operational' | 'needs_repair' | 'low_energy' | 'ready';
}

export interface Subscription {
  tier: string;
  price: number;
  walletLimit: number;
  features: string[];
  workers: string[];
  expiresAt: string;
  isActive: boolean;
  autoRenew: boolean;
}

export default CONFIG;
