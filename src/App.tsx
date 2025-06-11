import React, { useState, useEffect, createContext, useContext } from 'react';
import { Chains, Session, SessionKit } from '@wharfkit/session';
import { WalletPluginAnchor } from '@wharfkit/wallet-plugin-anchor';
import WebRenderer from '@wharfkit/web-renderer';

// Simple UI Components (inline to avoid import issues)
const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`animate-spin ${sizeClasses[size]} text-yellow-400`}>
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

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props 
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  [key: string]: any;
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900',
    secondary: 'bg-slate-600 hover:bg-slate-500 text-white',
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
      ) : children}
    </button>
  );
};

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={`bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 ${className}`}>
      {children}
    </div>
  );
};

// Types
interface AppContextType {
  session: Session | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isTestnet: boolean;
  toggleNetwork: () => void;
  subscription: any | null;
  setSubscription: (subscription: any | null) => void;
  wallets: any[];
  setWallets: (wallets: any[]) => void;
  tools: any[];
  setTools: (tools: any[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

// App Context
const AppContext = createContext<AppContextType | null>(null);

// SessionKit setup
const sessionKit = new SessionKit({
  appName: 'FlyRancher Pro',
  chains: [Chains.WAX, Chains.WAXTestnet],
  ui: new WebRenderer(),
  walletPlugins: [new WalletPluginAnchor()],
});

// Configuration constants
const SUBSCRIPTION_API_BASE = 'https://flyrancher-sub.onrender.com';

const subscriptionTiers = {
  basic: {
    name: 'Basic',
    price: 8,
    walletLimit: 2,
    features: ['Auto-Claim NFTs'],
    color: 'from-slate-400 to-slate-600',
    icon: '🥉'
  },
  standard: {
    name: 'Standard', 
    price: 15,
    walletLimit: 5,
    features: ['Auto-Claim NFTs', 'Energy Management', 'Bronze Workers', 'Silver Workers'],
    color: 'from-blue-400 to-blue-600',
    icon: '🥈'
  },
  premium: {
    name: 'Premium',
    price: 25,
    walletLimit: 10,
    features: ['Auto-Claim NFTs', 'Tool Repair', 'Energy Management', 'All Worker Types'],
    color: 'from-purple-400 to-purple-600',
    icon: '🥇'
  }
};

const durationOptions = [
  { value: 1, label: '1 Month', discount: 0 },
  { value: 2, label: '2 Months', discount: 5 },
  { value: 3, label: '3 Months', discount: 10 }
];

// Homepage Component
const Homepage = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const { session, login, isTestnet, toggleNetwork } = context;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">🤖</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              FlyRancher Pro
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Network Toggle */}
            <div className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm rounded-xl px-3 py-2 border border-slate-700/50">
              <span className="text-sm text-slate-300">Network:</span>
              <button 
                onClick={toggleNetwork}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  isTestnet 
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}
              >
                {isTestnet ? 'Testnet' : 'Mainnet'}
              </button>
            </div>
            
            {/* Wallet Connect */}
            {!session && (
              <Button onClick={login} variant="primary">
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-float mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center mb-6 animate-glow">
              <span className="text-6xl">🤖</span>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-purple-600 bg-clip-text text-transparent">
            FlyRancher Pro
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Professional-grade automation for Ranchers Land NFTs. Maximize your rewards with intelligent claiming, tool maintenance, and energy management!
          </p>

          {!session && (
            <div className="space-x-4">
              <Button onClick={login} size="lg" variant="primary">
                Connect Wallet & Start
              </Button>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto mt-20 grid md:grid-cols-3 gap-8">
          {[
            { icon: '⚡', title: 'Smart Automation', desc: 'Intelligent NFT claiming and energy management' },
            { icon: '🔧', title: 'Tool Maintenance', desc: 'Auto-repair tools at optimal durability levels' },
            { icon: '💎', title: 'Premium Features', desc: 'Advanced strategies for maximum efficiency' }
          ].map((feature, i) => (
            <Card key={i} className="text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-300">{feature.desc}</p>
            </Card>
          ))}
        </div>

        {/* Subscription Tiers Preview */}
        <div className="max-w-7xl mx-auto mt-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(subscriptionTiers).map(([key, tier]) => (
              <Card key={key} className="text-center hover:scale-105 transition-all">
                <div className="text-4xl mb-4">{tier.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <div className="text-3xl font-black mb-4">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    ${tier.price}
                  </span>
                  <span className="text-slate-400 text-lg">/month</span>
                </div>
                <div className="text-slate-300 mb-6">
                  Up to {tier.walletLimit} wallets
                </div>
                <ul className="space-y-2 text-slate-300 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-center justify-center space-x-2">
                      <span className="text-green-400">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="primary" className="w-full">
                  {session ? 'Select Plan' : 'Connect Wallet'}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

// Simple Dashboard Component
const Dashboard = () => {
  const context = useContext(AppContext);
  if (!context) return null;
  
  const { session, logout } = context;
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'subscribe', name: 'Subscribe', icon: '💎' },
    { id: 'wallets', name: 'Wallets', icon: '👛' },
    { id: 'tools', name: 'Tools', icon: '🔧' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-white">🤖</span>
            </div>
            <h1 className="text-xl font-bold text-white">FlyRancher Pro</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700/50">
              <span className="text-slate-300 text-sm">{session?.actor.toString()}</span>
            </div>
            <button 
              onClick={logout}
              className="text-slate-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Card>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-white mb-2">Dashboard Coming Soon</h3>
                <p className="text-slate-400 mb-6">
                  Your subscription management dashboard will be available here once you connect your wallet and subscribe to a plan.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="text-slate-400 mb-1">Active Wallets</div>
                    <div className="text-2xl font-bold text-white">-</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="text-slate-400 mb-1">Subscription</div>
                    <div className="text-2xl font-bold text-white">-</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="text-slate-400 mb-1">Tools Active</div>
                    <div className="text-2xl font-bold text-white">-</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// App Provider Component
const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [isTestnet, setIsTestnet] = useState(true);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [wallets, setWallets] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sessionKit.restore().then((restored) => {
      if (restored) {
        setSession(restored);
      }
    }).catch((error) => {
      console.log('Session restore failed:', error);
    });
  }, []);

  const login = async () => {
    try {
      setLoading(true);
      const response = await sessionKit.login();
      setSession(response.session);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (session) {
      try {
        await sessionKit.logout(session);
        setSession(null);
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  const toggleNetwork = () => {
    setIsTestnet(!isTestnet);
  };

  const value: AppContextType = {
    session,
    login,
    logout,
    isTestnet,
    toggleNetwork,
    subscription,
    setSubscription,
    wallets,
    setWallets,
    tools,
    setTools,
    loading,
    setLoading
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Main App Component
const App = () => {
  const context = useContext(AppContext);
  
  // Show loading spinner if context is not available yet
  if (!context) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }
  
  const { session, loading } = context;
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }
  
  return session ? <Dashboard /> : <Homepage />;
};

// Root Component with Provider
export default function FlyRancherApp() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
