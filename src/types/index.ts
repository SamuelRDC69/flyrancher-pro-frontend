// Type definitions for the FlyRancher Pro application

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
  addedAt?: string;
}

export interface ToolStatus {
  id: number;
  name: string;
  owner: string;
  assetId: string;
  durability: number;
  energy: number;
  nextClaim: number; // seconds until next claim
  status?: 'operational' | 'needs_repair' | 'low_energy' | 'ready';
}

export interface Subscription {
  tier: string;
  price: number;
  walletLimit: number;
  features: string[];
  workers: string[];
  expiresAt: string;
  isActive: boolean;
  autoRenew?: boolean;
}

export interface AppContextType {
  session: any;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isTestnet: boolean;
  toggleNetwork: () => void;
  subscription: Subscription | null;
  setSubscription: (subscription: Subscription | null) => void;
  wallets: UserWallet[];
  setWallets: (wallets: UserWallet[]) => void;
  tools: ToolStatus[];
  setTools: (tools: ToolStatus[]) => void;
}

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier: string;
  onPaymentComplete: () => void;
}

export interface TabProps {
  activeTab: string;
  subscription: Subscription | null;
  wallets: UserWallet[];
  tools: ToolStatus[];
}
