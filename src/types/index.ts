// WAX Blockchain Types
export interface WaxAccount {
  actor: string;
  permission: string;
}

export interface WaxTransaction {
  transaction_id: string;
  processed: {
    block_num: number;
    block_time: string;
    action_traces: Array<{
      act: {
        account: string;
        name: string;
        data: any;
      };
      receipt: {
        receiver: string;
        global_sequence: string;
      };
    }>;
  };
}

// Subscription Types
export type SubscriptionTier = 'basic' | 'standard' | 'premium';

export type SubscriptionStatus = 'active' | 'expired' | 'pending' | 'cancelled';

export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'processing';

export type WalletStatus = 'active' | 'inactive' | 'error';

export interface SubscriptionTierConfig {
  id: SubscriptionTier;
  name: string;
  price: number;
  walletLimit: number;
  features: string[];
  workers: string[];
  color: string;
  icon: string;
  description: string;
}

export interface DurationOption {
  value: number;
  label: string;
  discount: number;
  popular: boolean;
}

export interface AddonConfig {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
}

// User Data Types
export interface UserSubscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  isActive: boolean;
  walletCount: number;
  maxWallets: number;
  features: string[];
  autoRenewal?: {
    enabled: boolean;
    tier: SubscriptionTier;
    duration: number;
  };
}

export interface UserWallet {
  id: string;
  waxAccount: string;
  subscriptionId: string;
  status: WalletStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  lastClaimTime?: string;
  assetIds: string[];
  isActive: boolean;
}

export interface UserTool {
  id: string;
  name: string;
  owner: string;
  assetId: string;
  durability: number;
  energy: number;
  nextClaim: number; // seconds
  status: 'operational' | 'needs_repair' | 'low_energy' | 'ready';
  lastMaintenance?: string;
}

// Payment Types
export interface PaymentData {
  transactionId: string;
  fromWallet: string;
  toWallet: string;
  amount: string;
  memo: string;
  blockNumber?: number;
  timestamp?: string;
}

export interface PaymentValidation {
  valid: boolean;
  error?: string;
  expectedAmount?: number;
  actualAmount?: number;
  difference?: number;
  memoData?: MemoData;
}

export interface MemoData {
  type: 'new_subscription' | 'add_wallet' | 'wallet_renewal' | 'subscription_addon' | 'wallet_addon' | 'subscription_renewal' | 'upgrade';
  duration: number;
  tier?: SubscriptionTier;
  wallets?: string[];
  addon?: string;
  immediate?: boolean;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SubscriptionStatusResponse {
  subscription?: UserSubscription;
  wallets: UserWallet[];
  isActive: boolean;
  expiresAt?: string;
  tier?: SubscriptionTier;
  walletCount: number;
  timeRemaining?: string;
}

export interface PaymentHistoryResponse {
  payments: PaymentRecord[];
  total: number;
  page: number;
  limit: number;
}

export interface PaymentRecord {
  id: string;
  transactionHash: string;
  fromWallet: string;
  toWallet: string;
  amount: number;
  memo: string;
  status: PaymentStatus;
  processedAt?: string;
  createdAt: string;
  subscriptionId?: string;
  description?: string;
}

export interface SystemMetrics {
  totalUsers: number;
  activeSubscriptions: number;
  totalPayments: number;
  systemHealth: 'healthy' | 'warning' | 'error';
  lastProcessedBlock: number;
  processingRate: number;
  errorRate: number;
}

// UI Component Types
export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

export interface StatusBadgeProps {
  status: SubscriptionStatus | PaymentStatus | WalletStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'yellow' | 'blue' | 'green' | 'purple';
}

// Form Types
export interface SubscriptionFormData {
  tier: SubscriptionTier;
  duration: number;
  wallets: string[];
  addons: string[];
}

export interface WalletFormData {
  address: string;
  assetIds: string[];
}

// Context Types
export interface AppContextType {
  // Authentication
  session: any | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  
  // Network
  isTestnet: boolean;
  toggleNetwork: () => void;
  
  // Subscription
  subscription: UserSubscription | null;
  setSubscription: (subscription: UserSubscription | null) => void;
  
  // Wallets
  wallets: UserWallet[];
  setWallets: (wallets: UserWallet[]) => void;
  
  // Tools
  tools: UserTool[];
  setTools: (tools: UserTool[]) => void;
  
  // Loading states
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// Utility Types
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface NetworkConfig {
  name: string;
  chainId: string;
  rpcEndpoint: string;
  paymentWallet: string;
  explorerUrl: string;
}

export interface SubscriptionRecommendation {
  tier: SubscriptionTierConfig;
  recommended: boolean;
  savings: string;
  costPerWallet: string;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface TransactionError extends AppError {
  transactionId?: string;
  blockNumber?: number;
}

// Event Types
export interface SubscriptionEvent {
  type: 'created' | 'renewed' | 'expired' | 'cancelled' | 'upgraded';
  subscriptionId: string;
  userId: string;
  timestamp: string;
  details: any;
}

export interface PaymentEvent {
  type: 'received' | 'processed' | 'failed';
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  timestamp: string;
}

// Configuration Types
export interface AppConfig {
  api: {
    baseUrl: string;
    endpoints: Record<string, string>;
  };
  networks: {
    mainnet: NetworkConfig;
    testnet: NetworkConfig;
  };
  tiers: Record<SubscriptionTier, SubscriptionTierConfig>;
  durations: DurationOption[];
  addons: Record<string, AddonConfig>;
}

// Export all types
export * from './wax';
export * from './subscription';
export * from './ui';
