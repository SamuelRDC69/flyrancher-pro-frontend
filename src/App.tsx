import React, { useState, useEffect, createContext, useContext } from 'react';
import { Chains, Session, SessionKit } from '@wharfkit/session';
import { WalletPluginAnchor } from '@wharfkit/wallet-plugin-anchor';
import WebRenderer from '@wharfkit/web-renderer';

// App Context for global state
const AppContext = createContext();

// SessionKit setup
const sessionKit = new SessionKit({
  appName: 'WAX NFT Claimer',
  chains: [Chains.WAX, Chains.WAXTestnet],
  ui: new WebRenderer(),
  walletPlugins: [new WalletPluginAnchor()],
});

// Mock data and utilities
const subscriptionTiers = {
  basic: {
    name: 'Basic',
    price: 8,
    walletLimit: 2,
    features: ['Auto-Claim NFTs'],
    workers: [],
    color: 'from-slate-400 to-slate-600'
  },
  standard: {
    name: 'Standard', 
    price: 15,
    walletLimit: 5,
    features: ['Auto-Claim NFTs', 'Energy Management', 'Bronze Workers', 'Silver Workers'],
    workers: ['bronze', 'silver'],
    color: 'from-blue-400 to-blue-600'
  },
  premium: {
    name: 'Premium',
    price: 25,
    walletLimit: 10,
    features: ['Auto-Claim NFTs', 'Tool Repair', 'Energy Management', 'All Worker Types'],
    workers: ['bronze', 'silver', 'gold', 'platinum'],
    color: 'from-purple-400 to-purple-600'
  }
};

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
              <button 
                onClick={login}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900 font-semibold px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg"
              >
                Connect Wallet
              </button>
            ) : (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-slate-700/50">
                <span className="text-slate-300 text-sm">
                  {session.actor.toString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-bold text-white mb-6 leading-tight">
              Automate Your
              <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                WAX NFT Claims
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Professional-grade automation for Ranchers Land NFTs. Maximize your rewards with intelligent claiming, 
              tool maintenance, and energy management.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Ultra Efficient</h3>
              <p className="text-slate-300 leading-relaxed">
                99.4% fewer API calls than traditional bots. Claims exactly when ready with precision timing.
              </p>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Smart Maintenance</h3>
              <p className="text-slate-300 leading-relaxed">
                Automatic tool repair and energy management. Never miss claims due to broken tools or low energy.
              </p>
            </div>

            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Enterprise Security</h3>
              <p className="text-slate-300 leading-relaxed">
                Professional-grade security with critical shutdown protection and resource monitoring.
              </p>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h3>
            <p className="text-xl text-slate-300 mb-12">Start automating your NFT claims today</p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {Object.entries(subscriptionTiers).map(([key, tier]) => (
                <div key={key} className={`relative bg-slate-800/40 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all group ${key === 'standard' ? 'scale-105 border-blue-500/50' : ''}`}>
                  {key === 'standard' && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-400 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  
                  <div className={`w-16 h-16 bg-gradient-to-br ${tier.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <span className="text-2xl text-white font-bold">
                      {key === 'basic' ? 'B' : key === 'standard' ? 'S' : 'P'}
                    </span>
                  </div>
                  
                  <h4 className="text-2xl font-bold text-white mb-2">{tier.name}</h4>
                  <div className="text-4xl font-bold text-white mb-1">
                    ${tier.price}
                    <span className="text-lg text-slate-400 font-normal">/month</span>
                  </div>
                  <p className="text-slate-400 mb-6">Up to {tier.walletLimit} wallets</p>
                  
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-slate-300">
                        <span className="text-green-400 mr-3">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full bg-gradient-to-r ${tier.color} hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-105`}>
                    {session ? 'Select Plan' : 'Connect Wallet First'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-4 gap-6 bg-slate-800/20 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">99.4%</div>
              <div className="text-slate-300">Efficiency Gain</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
              <div className="text-slate-300">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">100+</div>
              <div className="text-slate-300">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">28d</div>
              <div className="text-slate-300">Average ROI</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { session, logout, subscription, wallets, tools } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'wallets', name: 'Wallets', icon: '👛' },
    { id: 'tools', name: 'Tools', icon: '🔧' },
    { id: 'subscription', name: 'Subscription', icon: '💎' },
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
                    ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 text-yellow-400 border border-yellow-400/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'wallets' && <WalletsTab />}
            {activeTab === 'tools' && <ToolsTab />}
            {activeTab === 'subscription' && <SubscriptionTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab
const OverviewTab = () => {
  const { subscription, wallets, tools } = useContext(AppContext);
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-slate-400">Monitor your automated NFT claiming performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400">Active Wallets</span>
            <span className="text-2xl">👛</span>
          </div>
          <div className="text-2xl font-bold text-white">{wallets?.length || 0}</div>
          <div className="text-sm text-slate-500">of {subscription?.walletLimit || 0} max</div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400">Tools Monitored</span>
            <span className="text-2xl">🔧</span>
          </div>
          <div className="text-2xl font-bold text-white">{tools?.length || 0}</div>
          <div className="text-sm text-green-400">All operational</div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400">Subscription</span>
            <span className="text-2xl">💎</span>
          </div>
          <div className="text-2xl font-bold text-white capitalize">{subscription?.tier || 'None'}</div>
          <div className="text-sm text-slate-500">23 days remaining</div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400">Claims Today</span>
            <span className="text-2xl">⚡</span>
          </div>
          <div className="text-2xl font-bold text-white">24</div>
          <div className="text-sm text-green-400">+12% vs yesterday</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'NFT Claimed', wallet: 'waxpepe.gm', asset: '1099961765115', time: '2 min ago', type: 'success' },
            { action: 'Tool Repaired', wallet: 'samuel.gm', asset: '1099961882155', time: '15 min ago', type: 'maintenance' },
            { action: 'Energy Refilled', wallet: 'waxpepe.gm', asset: '-', time: '1 hour ago', type: 'maintenance' },
            { action: 'NFT Claimed', wallet: 'samuel.gm', asset: '1099961882174', time: '2 hours ago', type: 'success' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-700/30 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  activity.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {activity.type === 'success' ? '✓' : '⚡'}
                </div>
                <div>
                  <div className="text-white font-medium">{activity.action}</div>
                  <div className="text-slate-400 text-sm">{activity.wallet} • {activity.asset !== '-' && `Asset ${activity.asset}`}</div>
                </div>
              </div>
              <span className="text-slate-500 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Wallets Tab
const WalletsTab = () => {
  const { subscription, wallets, setWallets } = useContext(AppContext);
  const [newWallet, setNewWallet] = useState({ address: '', assetIds: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  const addWallet = () => {
    if (!newWallet.address.trim()) return;
    
    const wallet = {
      id: Date.now(),
      address: newWallet.address,
      assetIds: newWallet.assetIds.split(',').map(id => id.trim()).filter(Boolean),
      status: 'active',
      lastClaim: new Date(Date.now() - Math.random() * 3600000).toISOString()
    };
    
    setWallets([...wallets, wallet]);
    setNewWallet({ address: '', assetIds: '' });
    setShowAddForm(false);
  };

  const removeWallet = (id) => {
    setWallets(wallets.filter(w => w.id !== id));
  };

  const canAddWallet = wallets.length < (subscription?.walletLimit || 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Wallet Management</h2>
          <p className="text-slate-400">
            Manage your NFT wallets • {wallets.length} of {subscription?.walletLimit || 0} slots used
          </p>
        </div>
        
        {canAddWallet && (
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-slate-900 font-semibold px-6 py-3 rounded-xl transition-all"
          >
            Add Wallet
          </button>
        )}
      </div>

      {/* Add Wallet Form */}
      {showAddForm && (
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-bold text-white mb-4">Add New Wallet</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Wallet Address</label>
              <input
                type="text"
                placeholder="e.g., waxpepe.gm"
                value={newWallet.address}
                onChange={(e) => setNewWallet({...newWallet, address: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-yellow-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Asset IDs (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g., 1099961765115, 1099961730766"
                value={newWallet.assetIds}
                onChange={(e) => setNewWallet({...newWallet, assetIds: e.target.value})}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-yellow-400 focus:outline-none"
              />
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={addWallet}
                className="bg-gradient-to-r from-green-400 to-green-600 text-white font-medium px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Add Wallet
              </button>
              <button 
                onClick={() => setShowAddForm(false)}
                className="bg-slate-600 text-white font-medium px-6 py-2 rounded-lg hover:bg-slate-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallets List */}
      <div className="space-y-4">
        {wallets.length === 0 ? (
          <div className="text-center py-12 bg-slate-800/20 rounded-xl border border-slate-700/30">
            <span className="text-6xl mb-4 block">👛</span>
            <h3 className="text-xl font-bold text-white mb-2">No Wallets Added</h3>
            <p className="text-slate-400 mb-4">Add your first wallet to start automated claiming</p>
            {canAddWallet && (
              <button 
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-semibold px-6 py-3 rounded-xl"
              >
                Add Your First Wallet
              </button>
            )}
          </div>
        ) : (
          wallets.map(wallet => (
            <div key={wallet.id} className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{wallet.address}</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    wallet.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {wallet.status}
                  </span>
                </div>
                <button 
                  onClick={() => removeWallet(wallet.id)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Asset IDs</div>
                  <div className="text-white">
                    {wallet.assetIds.length > 0 ? wallet.assetIds.join(', ') : 'No assets'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Last Claim</div>
                  <div className="text-white">
                    {new Date(wallet.lastClaim).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Tools Tab
const ToolsTab = () => {
  const { tools } = useContext(AppContext);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Tool Status</h2>
        <p className="text-slate-400">Monitor your NFT tools and their maintenance status</p>
      </div>

      <div className="grid gap-6">
        {tools.map(tool => (
          <div key={tool.id} className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{tool.name}</h3>
                <p className="text-slate-400">{tool.owner} • Asset {tool.assetId}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                tool.durability >= 80 ? 'bg-green-500/20 text-green-400' : 
                tool.durability >= 40 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {tool.durability >= 80 ? 'Excellent' : tool.durability >= 40 ? 'Good' : 'Needs Repair'}
              </span>
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
                  {tool.nextClaim > 0 ? `${Math.floor(tool.nextClaim / 3600)}h ${Math.floor((tool.nextClaim % 3600) / 60)}m` : 'Ready'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Subscription Tab
const SubscriptionTab = () => {
  const { subscription, setSubscription } = useContext(AppContext);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);

  const handleSubscribe = (tier) => {
    setSelectedTier(tier);
    setShowPayment(true);
  };

  const handlePayment = () => {
    // Mock payment processing
    setSubscription({
      tier: selectedTier,
      ...subscriptionTiers[selectedTier],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true
    });
    setShowPayment(false);
    setSelectedTier(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Subscription Management</h2>
        <p className="text-slate-400">Manage your FlyRancher Pro subscription</p>
      </div>

      {/* Current Subscription */}
      {subscription?.isActive && (
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Current Subscription</h3>
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-4 py-2 rounded-lg font-medium bg-gradient-to-r ${subscriptionTiers[subscription.tier].color} text-white`}>
                  {subscriptionTiers[subscription.tier].name}
                </span>
                <span className="text-green-400">● Active</span>
              </div>
              <p className="text-slate-400">
                Expires: {new Date(subscription.expiresAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">${subscription.price}/month</div>
              <div className="text-slate-400">Up to {subscription.walletLimit} wallets</div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6">Complete Payment</h3>
            
            <div className="mb-6">
              <div className="text-slate-400 mb-2">Selected Plan</div>
              <div className="text-xl font-bold text-white">
                {subscriptionTiers[selectedTier]?.name} - ${subscriptionTiers[selectedTier]?.price}/month
              </div>
            </div>

            <div className="mb-6">
              <div className="text-slate-400 mb-2">Payment Amount (WAX)</div>
              <div className="bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3">
                <span className="text-white font-mono">
                  {(subscriptionTiers[selectedTier]?.price * 2.5).toFixed(4)} WAX
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Rate: $1 = 2.5 WAX (approximate)
              </div>
            </div>

            <div className="mb-6">
              <div className="text-slate-400 mb-2">Payment Wallet</div>
              <div className="bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3">
                <span className="text-white font-mono">flyrancher.gm</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={handlePayment}
                className="flex-1 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                Send Payment
              </button>
              <button 
                onClick={() => setShowPayment(false)}
                className="px-6 bg-slate-600 text-white font-medium py-3 rounded-xl hover:bg-slate-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Available Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {Object.entries(subscriptionTiers).map(([key, tier]) => (
          <div key={key} className="bg-slate-800/40 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <div className={`w-12 h-12 bg-gradient-to-br ${tier.color} rounded-xl flex items-center justify-center mb-4`}>
              <span className="text-white font-bold">
                {key === 'basic' ? 'B' : key === 'standard' ? 'S' : 'P'}
              </span>
            </div>
            
            <h4 className="text-xl font-bold text-white mb-2">{tier.name}</h4>
            <div className="text-2xl font-bold text-white mb-1">
              ${tier.price}
              <span className="text-sm text-slate-400 font-normal">/month</span>
            </div>
            <p className="text-slate-400 mb-4">Up to {tier.walletLimit} wallets</p>
            
            <ul className="space-y-2 mb-6">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-slate-300 text-sm">
                  <span className="text-green-400 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => handleSubscribe(key)}
              disabled={subscription?.tier === key && subscription?.isActive}
              className={`w-full font-semibold py-3 rounded-xl transition-all ${
                subscription?.tier === key && subscription?.isActive
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : `bg-gradient-to-r ${tier.color} text-white hover:opacity-90`
              }`}
            >
              {subscription?.tier === key && subscription?.isActive ? 'Current Plan' : 'Subscribe'}
            </button>
          </div>
        ))}
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
      address: 'waxpepe.gm',
      assetIds: ['1099961765115', '1099961730766', '1099961828793'],
      status: 'active',
      lastClaim: new Date(Date.now() - 1800000).toISOString()
    },
    {
      id: 2,
      address: 'samuel.gm',
      assetIds: ['1099961882155', '1099961882174'],
      status: 'active',
      lastClaim: new Date(Date.now() - 3600000).toISOString()
    }
  ]);
  const [tools, setTools] = useState([
    {
      id: 1,
      name: 'Harvester',
      owner: 'waxpepe.gm',
      assetId: '1099961765115',
      durability: 85,
      energy: 65,
      nextClaim: 1800 // seconds
    },
    {
      id: 2,
      name: 'Scythe',
      owner: 'waxpepe.gm',
      assetId: '1099961730766',
      durability: 42,
      energy: 80,
      nextClaim: 0
    },
    {
      id: 3,
      name: 'Workshop',
      owner: 'samuel.gm',
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
