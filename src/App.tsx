import React, { useState, useEffect, createContext, useContext } from 'react';
import { Chains, Session, SessionKit } from '@wharfkit/session';
import { WalletPluginAnchor } from '@wharfkit/wallet-plugin-anchor';
import WebRenderer from '@wharfkit/web-renderer';
import { Button, Card, LoadingSpinner, StatusBadge, Toast, useToast } from './components/ui';

// App Context for global state
const AppContext = createContext();

// SessionKit setup
const sessionKit = new SessionKit({
  appName: 'FlyRancher Pro',
  chains: [Chains.WAX, Chains.WAXTestnet],
  ui: new WebRenderer(),
  walletPlugins: [new WalletPluginAnchor()],
});

// Configuration constants
const SUBSCRIPTION_API_BASE = 'https://flyrancher-sub.onrender.com';

// Mock data and utilities
const subscriptionTiers = {
  basic: {
    name: 'Basic',
    price: 8,
    walletLimit: 2,
    features: ['Auto-Claim NFTs'],
    workers: [],
    color: 'from-slate-400 to-slate-600',
    icon: '🥉'
  },
  standard: {
    name: 'Standard', 
    price: 15,
    walletLimit: 5,
    features: ['Auto-Claim NFTs', 'Energy Management', 'Bronze Workers', 'Silver Workers'],
    workers: ['bronze', 'silver'],
    color: 'from-blue-400 to-blue-600',
    icon: '🥈'
  },
  premium: {
    name: 'Premium',
    price: 25,
    walletLimit: 10,
    features: ['Auto-Claim NFTs', 'Tool Repair', 'Energy Management', 'All Worker Types'],
    workers: ['bronze', 'silver', 'gold', 'platinum'],
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
  const { session, login, isTestnet, toggleNetwork } = useContext(AppContext);

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
            {!session ? (
              <Button onClick={login} variant="primary">
                Connect Wallet
              </Button>
            ) : null}
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
              <Button onClick={login} size="lg" variant="primary" className="transform hover:scale-105">
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
            <div key={i} className="glass-card p-8 text-center hover:scale-105 transition-transform">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-300">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Subscription Tiers Preview */}
        <div className="max-w-7xl mx-auto mt-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {Object.entries(subscriptionTiers).map(([key, tier]) => (
              <div key={key} className="glass-card p-8 text-center relative hover:scale-105 transition-all">
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
                <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity">
                  {session ? 'Select Plan' : 'Connect Wallet'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto mt-20 grid md:grid-cols-4 gap-8">
          {[
            { label: 'Active Users', value: '2,847' },
            { label: 'WAX Claimed', value: '1.2M+' },
            { label: 'Tools Maintained', value: '15,600+' },
            { label: 'Average ROI', value: '+340%' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-slate-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

// Subscription Management Component
const SubscriptionManagement = () => {
  const { session, isTestnet } = useContext(AppContext);
  const { toast, showToast, hideToast } = useToast();
  const [selectedTier, setSelectedTier] = useState('standard');
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [wallets, setWallets] = useState(['']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      loadSubscriptionStatus();
    }
  }, [session]);

  const loadSubscriptionStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SUBSCRIPTION_API_BASE}/subscription/status/${session.actor.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setSubscriptionStatus(data);
      }
    } catch (error) {
      console.error('Failed to load subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWalletField = () => {
    const tier = subscriptionTiers[selectedTier];
    if (wallets.length < tier.walletLimit) {
      setWallets([...wallets, '']);
    }
  };

  const removeWalletField = (index) => {
    setWallets(wallets.filter((_, i) => i !== index));
  };

  const updateWallet = (index, value) => {
    const updated = [...wallets];
    updated[index] = value.toLowerCase().trim();
    setWallets(updated);
  };

  const calculateTotal = () => {
    const tier = subscriptionTiers[selectedTier];
    const duration = durationOptions.find(d => d.value === selectedDuration);
    const basePrice = tier.price * selectedDuration;
    const discount = (basePrice * duration.discount) / 100;
    return (basePrice - discount).toFixed(2);
  };

  const generateMemo = () => {
    const tierCode = selectedTier === 'basic' ? 'B' : selectedTier === 'standard' ? 'S' : 'P';
    const validWallets = wallets.filter(w => w.trim().length > 0);
    return `N-${selectedDuration}-${tierCode}:${validWallets.join(',')}`;
  };

  const handleSubscribe = async () => {
    const validWallets = wallets.filter(w => w.trim().length > 0);
    
    if (validWallets.length === 0) {
      showToast('Please add at least one wallet', 'error');
      return;
    }

    const invalidWallets = validWallets.filter(wallet => 
      !/^[a-z1-5.]{1,12}$/.test(wallet) || wallet.length < 3
    );

    if (invalidWallets.length > 0) {
      showToast('Please enter valid WAX account names', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const paymentWallet = isTestnet ? 'testpay.gm' : 'payment.gm';
      const amount = calculateTotal();
      const memo = generateMemo();

      const transactionData = {
        actions: [{
          account: 'eosio.token',
          name: 'transfer',
          authorization: [{
            actor: session.actor.toString(),
            permission: session.permission.toString()
          }],
          data: {
            from: session.actor.toString(),
            to: paymentWallet,
            quantity: `${amount} WAX`,
            memo: memo
          }
        }]
      };

      const result = await session.transact(transactionData);
      
      showToast('Payment sent successfully! Processing subscription...', 'success');
      
      // Wait for backend processing
      setTimeout(() => {
        loadSubscriptionStatus();
        showToast('Subscription activated successfully!', 'success');
      }, 5000);

    } catch (error) {
      console.error('Payment failed:', error);
      showToast(error.message || 'Payment failed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toast {...toast} onClose={hideToast} />
      
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Subscription Management</h2>
        <p className="text-slate-400">Manage your FlyRancher Pro subscription and settings</p>
      </div>

      {/* Current Subscription Status */}
      {subscriptionStatus && (
        <Card className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Current Subscription</h3>
              <div className="flex items-center space-x-4 mb-4">
                <StatusBadge status={subscriptionStatus.isActive ? 'active' : 'expired'} />
                <span className="text-slate-300">
                  {subscriptionStatus.tier?.toUpperCase() || 'None'} Plan
                </span>
              </div>
              {subscriptionStatus.isActive && (
                <div className="space-y-2 text-sm">
                  <div className="text-slate-400">
                    Expires: <span className="text-white">
                      {new Date(subscriptionStatus.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-slate-400">
                    Wallets: <span className="text-white">
                      {subscriptionStatus.walletCount}/{subscriptionTiers[subscriptionStatus.tier]?.walletLimit || 0}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {subscriptionStatus.isActive && (
              <div className="text-right">
                <div className="text-sm text-slate-400 mb-1">Time Remaining</div>
                <div className="text-lg font-bold text-green-400">
                  {Math.ceil((new Date(subscriptionStatus.expiresAt) - new Date()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Subscription Plans */}
      <Card>
        <h3 className="text-xl font-bold text-white mb-6">Choose Your Plan</h3>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {Object.entries(subscriptionTiers).map(([key, tier]) => (
            <button
              key={key}
              onClick={() => setSelectedTier(key)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedTier === key
                  ? 'border-yellow-400 bg-yellow-400/10'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{tier.icon}</span>
                <div>
                  <div className="font-bold text-white">{tier.name}</div>
                  <div className="text-sm text-slate-400">${tier.price}/month</div>
                </div>
              </div>
              <div className="text-sm text-slate-300 mb-2">
                Up to {tier.walletLimit} wallets
              </div>
              <div className="text-xs text-slate-400">
                {tier.features.slice(0, 2).join(', ')}
              </div>
            </button>
          ))}
        </div>

        {/* Duration Selection */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-3">Duration</h4>
          <div className="grid grid-cols-3 gap-3">
            {durationOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedDuration(option.value)}
                className={`p-3 rounded-lg border transition-all text-center ${
                  selectedDuration === option.value
                    ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                    : 'border-slate-600 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="font-semibold">{option.label}</div>
                {option.discount > 0 && (
                  <div className="text-xs text-green-400">-{option.discount}%</div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Wallet Management */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-lg font-semibold text-white">Wallets</h4>
            <span className="text-sm text-slate-400">
              {wallets.filter(w => w.trim()).length}/{subscriptionTiers[selectedTier].walletLimit} wallets
            </span>
          </div>
          
          <div className="space-y-3">
            {wallets.map((wallet, index) => (
              <div key={index} className="flex space-x-3">
                <input
                  type="text"
                  value={wallet}
                  onChange={(e) => updateWallet(index, e.target.value)}
                  placeholder="Enter WAX account name"
                  className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:border-yellow-400 focus:outline-none"
                />
                {wallets.length > 1 && (
                  <Button
                    onClick={() => removeWalletField(index)}
                    variant="danger"
                    size="sm"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>

          {wallets.length < subscriptionTiers[selectedTier].walletLimit && (
            <Button
              onClick={addWalletField}
              variant="outline"
              size="sm"
              className="mt-3"
            >
              Add Another Wallet
            </Button>
          )}
        </div>

        {/* Payment Summary */}
        <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">Plan:</span>
            <span className="text-white font-semibold">
              {subscriptionTiers[selectedTier].name} × {selectedDuration} month{selectedDuration > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">Wallets:</span>
            <span className="text-white">{wallets.filter(w => w.trim()).length}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-slate-300">Network:</span>
            <span className={`font-semibold ${isTestnet ? 'text-orange-400' : 'text-green-400'}`}>
              {isTestnet ? 'Testnet' : 'Mainnet'}
            </span>
          </div>
          <div className="border-t border-slate-600 pt-2 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-white">Total:</span>
              <span className="text-xl font-bold text-yellow-400">{calculateTotal()} WAX</span>
            </div>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Memo: {generateMemo()}
          </div>
        </div>

        {/* Subscribe Button */}
        <Button
          onClick={handleSubscribe}
          disabled={isProcessing || wallets.filter(w => w.trim()).length === 0}
          loading={isProcessing}
          variant="primary"
          size="lg"
          className="w-full"
        >
          {isProcessing ? 'Processing Payment...' : 'Subscribe Now'}
        </Button>
      </Card>
    </div>
  );
};

// Bot Stats Component (placeholder for future implementation)
const BotStats = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Bot Statistics</h2>
        <p className="text-slate-400">Monitor your automation performance and tool status</p>
      </div>

      <Card>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🤖</div>
          <h3 className="text-xl font-bold text-white mb-2">Bot Integration Coming Soon</h3>
          <p className="text-slate-400 mb-6">
            This section will show your bot statistics, tool cooldowns, and automation performance once the bot tools are fully integrated.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-slate-400 mb-1">Active Tools</div>
              <div className="text-2xl font-bold text-white">-</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-slate-400 mb-1">Last Claim</div>
              <div className="text-2xl font-bold text-white">-</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="text-slate-400 mb-1">Total Earned</div>
              <div className="text-2xl font-bold text-white">-</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = () => {
  const { subscription, wallets, tools } = useContext(AppContext);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-slate-400">Monitor your NFT automation performance</p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {wallets?.filter(w => w.status === 'active').length || 0}
            </div>
            <div className="text-slate-400 text-sm">Active Wallets</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {tools?.length || 0}
            </div>
            <div className="text-slate-400 text-sm">Total Tools</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {tools?.filter(t => t.nextClaim === 0).length || 0}
            </div>
            <div className="text-slate-400 text-sm">Ready to Claim</div>
          </div>
        </Card>
        <Card padding="sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {subscription?.isActive ? 'Active' : 'None'}
            </div>
            <div className="text-slate-400 text-sm">Subscription</div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'NFT Claimed', wallet: 'testuser.gm', time: '2 min ago', status: 'success' },
            { action: 'Tool Repaired', wallet: 'testuser.gm', time: '15 min ago', status: 'success' },
            { action: 'Energy Refilled', wallet: 'secondary.gm', time: '1 hour ago', status: 'success' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
              <div className="flex items-center space-x-3">
                <StatusBadge status={activity.status} size="sm" />
                <div>
                  <div className="text-white font-medium">{activity.action}</div>
                  <div className="text-slate-400 text-sm">{activity.wallet}</div>
                </div>
              </div>
              <div className="text-slate-400 text-sm">{activity.time}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// Wallets Tab Component
const WalletsTab = () => {
  const { wallets } = useContext(AppContext);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Wallet Management</h2>
        <p className="text-slate-400">Monitor and manage your connected wallets</p>
      </div>

      <div className="grid gap-6">
        {wallets?.map((wallet) => (
          <Card key={wallet.id}>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-bold text-white">{wallet.address}</h3>
                  <StatusBadge status={wallet.status} />
                </div>
                <div className="text-slate-400 text-sm mb-3">
                  Assets: {wallet.assetIds.join(', ')}
                </div>
                <div className="text-slate-400 text-sm">
                  Last Claim: {new Date(wallet.lastClaim).toLocaleString()}
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Tools Tab Component
const ToolsTab = () => {
  const { tools } = useContext(AppContext);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Tool Management</h2>
        <p className="text-slate-400">Monitor your NFT tools and their status</p>
      </div>

      <div className="grid gap-6">
        {tools?.map((tool) => (
          <Card key={tool.id}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">{tool.name}</h3>
                <div className="text-slate-400 text-sm">{tool.owner} • Asset ID: {tool.assetId}</div>
              </div>
              <StatusBadge 
                status={tool.durability >= 40 ? 'active' : 'warning'} 
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-slate-400 text-sm mb-2">Durability</div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        tool.durability >= 80 ? 'bg-green-400' : 
                        tool.durability >= 40 ? 'bg-yellow-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${tool.durability}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium">{tool.durability}%</span>
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-sm mb-2">Energy</div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-slate-700 rounded-full h-2">
                    <div 
                      className="h-2 bg-blue-400 rounded-full transition-all"
                      style={{ width: `${tool.energy}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium">{tool.energy}%</span>
                </div>
              </div>

              <div>
                <div className="text-slate-400 text-sm mb-2">Next Claim</div>
                <div className="text-white font-medium">
                  {tool.nextClaim > 0 ? 
                    `${Math.floor(tool.nextClaim / 3600)}h ${Math.floor((tool.nextClaim % 3600) / 60)}m` : 'Ready'}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { session, logout, subscription, wallets, tools } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'subscribe', name: 'Subscribe', icon: '💎' },
    { id: 'wallets', name: 'Wallets', icon: '👛' },
    { id: 'tools', name: 'Tools', icon: '🔧' },
    { id: 'stats', name: 'Bot Stats', icon: '📈' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'subscribe':
        return <SubscriptionManagement />;
      case 'wallets':
        return <WalletsTab />;
      case 'tools':
        return <ToolsTab />;
      case 'stats':
        return <BotStats />;
      default:
        return <OverviewTab />;
    }
  };

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
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// App Provider Component
const AppProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isTestnet, setIsTestnet] = useState(true);
  const [subscription, setSubscription] = useState(null);
  const [wallets, setWallets] = useState([
    {
      id: 1,
      address: 'testuser.gm',
      assetIds: ['1099961765115', '1099961730766', '1099961828793'],
      status: 'active',
      lastClaim: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 2,
      address: 'secondary.gm',
      assetIds: ['1099961882155', '1099961882174'],
      status: 'active',
      lastClaim: new Date(Date.now() - 3600000).toISOString()
    }
  ]);
  const [tools, setTools] = useState([
    {
      id: 1,
      name: 'Harvester',
      owner: 'testuser.gm',
      assetId: '1099961765115',
      durability: 85,
      energy: 65,
      nextClaim: 1800
    },
    {
      id: 2,
      name: 'Scythe',
      owner: 'testuser.gm',
      assetId: '1099961730766',
      durability: 42,
      energy: 80,
      nextClaim: 0
    },
    {
      id: 3,
      name: 'Workshop',
      owner: 'secondary.gm',
      assetId: '1099961882155',
      durability: 90,
      energy: 45,
      nextClaim: 3600
    }
  ]);

  useEffect(() => {
    sessionKit.restore().then((restored) => setSession(restored));
  }, []);

  const login = async () => {
    try {
      const response = await sessionKit.login();
      setSession(response.session);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = async () => {
    if (session) {
      await sessionKit.logout(session);
      setSession(null);
    }
  };

  const toggleNetwork = () => {
    setIsTestnet(!isTestnet);
  };

  const value = {
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
    setTools
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Main App Component
const App = () => {
  const { session } = useContext(AppContext);
  
  return session ? <Dashboard /> : <Homepage />;
};

// Root Component
export default function WAXClaimerApp() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
