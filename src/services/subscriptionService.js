import { SUBSCRIPTION_CONFIG } from '../config/subscription.js';

class SubscriptionService {
  constructor() {
    this.baseUrl = SUBSCRIPTION_CONFIG.API.BASE_URL;
    this.endpoints = SUBSCRIPTION_CONFIG.API.ENDPOINTS;
  }

  // Generic API request handler
  async apiRequest(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    };

    try {
      console.log(`API Request: ${defaultOptions.method} ${url}`);
      
      const response = await fetch(url, defaultOptions);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      return { success: true, data };
    } catch (error) {
      console.error('API Request failed:', error);
      return { 
        success: false, 
        error: error.message || 'Network request failed' 
      };
    }
  }

  // Get subscription status for a specific wallet
  async getSubscriptionStatus(walletAddress) {
    if (!walletAddress) {
      return { success: false, error: 'Wallet address is required' };
    }

    return await this.apiRequest(`${this.endpoints.STATUS}/${walletAddress}`);
  }

  // Get multiple wallet statuses
  async getMultipleWalletStatuses(walletAddresses) {
    if (!Array.isArray(walletAddresses) || walletAddresses.length === 0) {
      return { success: false, error: 'Wallet addresses array is required' };
    }

    const results = await Promise.allSettled(
      walletAddresses.map(address => this.getSubscriptionStatus(address))
    );

    const walletStatuses = {};
    results.forEach((result, index) => {
      const address = walletAddresses[index];
      if (result.status === 'fulfilled' && result.value.success) {
        walletStatuses[address] = result.value.data;
      } else {
        walletStatuses[address] = { 
          error: result.reason || 'Failed to fetch status',
          isActive: false 
        };
      }
    });

    return { success: true, data: walletStatuses };
  }

  // Submit subscription payment for processing
  async submitPayment(paymentData) {
    const { transactionId, fromWallet, toWallet, amount, memo, blockNumber } = paymentData;

    if (!transactionId || !fromWallet || !toWallet || !amount || !memo) {
      return { 
        success: false, 
        error: 'Missing required payment data' 
      };
    }

    const payload = {
      transactionHash: transactionId,
      fromWallet,
      toWallet,
      amount: parseFloat(amount),
      memo,
      blockNumber: blockNumber || 0,
      timestamp: new Date().toISOString()
    };

    return await this.apiRequest(this.endpoints.SUBSCRIBE, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // Get payment history
  async getPaymentHistory(walletAddress, limit = 20, offset = 0) {
    const params = new URLSearchParams({
      wallet: walletAddress || '',
      limit: limit.toString(),
      offset: offset.toString()
    });

    return await this.apiRequest(`${this.endpoints.PAYMENTS}?${params}`);
  }

  // Get system metrics
  async getSystemMetrics() {
    return await this.apiRequest(this.endpoints.METRICS);
  }

  // Get system health status
  async getSystemHealth() {
    return await this.apiRequest(this.endpoints.HEALTH);
  }

  // Poll for payment confirmation
  async pollPaymentConfirmation(transactionId, maxAttempts = 20, intervalMs = 5000) {
    let attempts = 0;
    
    return new Promise((resolve) => {
      const poll = async () => {
        attempts++;
        
        try {
          // Check if payment was processed by looking for subscription updates
          const statusCheck = await this.apiRequest(`/subscription/transaction/${transactionId}`);
          
          if (statusCheck.success && statusCheck.data.processed) {
            resolve({ success: true, data: statusCheck.data });
            return;
          }
        } catch (error) {
          console.log(`Polling attempt ${attempts} failed:`, error.message);
        }

        if (attempts >= maxAttempts) {
          resolve({ 
            success: false, 
            error: 'Payment confirmation timeout',
            timeout: true 
          });
          return;
        }

        setTimeout(poll, intervalMs);
      };

      poll();
    });
  }

  // Validate memo format
  validateMemo(memo) {
    if (!memo || typeof memo !== 'string') {
      return { valid: false, error: 'Memo is required' };
    }

    // Check against known memo patterns
    const patterns = SUBSCRIPTION_CONFIG.PAYMENT.MEMO_PATTERNS;
    const memoPatterns = [
      /^N-(\d+)-([BSP]):(.+)$/, // New subscription
      /^A-(\d+)-X:(.+)$/,       // Add wallet
      /^W-(\d+)-X:(.+)$/,       // Wallet renewal
      /^FS-(\d+)-([A-Z]+):?$/,  // Subscription addon
      /^FW-(\d+)-([A-Z]+):(.+)$/, // Wallet addon
      /^R-(\d+)-([BSP]):?(.*)$/, // Subscription renewal
      /^U-(\d+)-([BSP]):?(.*)$/, // Upgrade
    ];

    const isValid = memoPatterns.some(pattern => pattern.test(memo));
    
    if (!isValid) {
      return { 
        valid: false, 
        error: 'Invalid memo format. Please use the subscription system to generate correct memos.' 
      };
    }

    return { valid: true };
  }

  // Parse memo to extract information
  parseMemo(memo) {
    const memoValidation = this.validateMemo(memo);
    if (!memoValidation.valid) {
      return { success: false, error: memoValidation.error };
    }

    try {
      // New subscription: N-1-B:wallet1.gm,wallet2.gm
      const newSubMatch = memo.match(/^N-(\d+)-([BSP]):(.+)$/);
      if (newSubMatch) {
        return {
          success: true,
          data: {
            type: 'new_subscription',
            duration: parseInt(newSubMatch[1]),
            tier: this.getTierFromCode(newSubMatch[2]),
            wallets: newSubMatch[3].split(',').map(w => w.trim())
          }
        };
      }

      // Add wallet: A-2-X:newwallet.gm
      const addWalletMatch = memo.match(/^A-(\d+)-X:(.+)$/);
      if (addWalletMatch) {
        return {
          success: true,
          data: {
            type: 'add_wallet',
            duration: parseInt(addWalletMatch[1]),
            wallets: addWalletMatch[2].split(',').map(w => w.trim())
          }
        };
      }

      // Wallet renewal: W-3-X:wallet1.gm,wallet2.gm
      const walletRenewalMatch = memo.match(/^W-(\d+)-X:(.+)$/);
      if (walletRenewalMatch) {
        return {
          success: true,
          data: {
            type: 'wallet_renewal',
            duration: parseInt(walletRenewalMatch[1]),
            wallets: walletRenewalMatch[2].split(',').map(w => w.trim())
          }
        };
      }

      // Subscription addon: FS-1-REPAIR:
      const subAddonMatch = memo.match(/^FS-(\d+)-([A-Z]+):?$/);
      if (subAddonMatch) {
        return {
          success: true,
          data: {
            type: 'subscription_addon',
            duration: parseInt(subAddonMatch[1]),
            addon: subAddonMatch[2]
          }
        };
      }

      // Wallet addon: FW-2-ENERGY:wallet1.gm
      const walletAddonMatch = memo.match(/^FW-(\d+)-([A-Z]+):(.+)$/);
      if (walletAddonMatch) {
        return {
          success: true,
          data: {
            type: 'wallet_addon',
            duration: parseInt(walletAddonMatch[1]),
            addon: walletAddonMatch[2],
            wallets: walletAddonMatch[3].split(',').map(w => w.trim())
          }
        };
      }

      // Subscription renewal: R-6-S:
      const renewalMatch = memo.match(/^R-(\d+)-([BSP]):?(.*)$/);
      if (renewalMatch) {
        return {
          success: true,
          data: {
            type: 'subscription_renewal',
            duration: parseInt(renewalMatch[1]),
            tier: this.getTierFromCode(renewalMatch[2])
          }
        };
      }

      // Upgrade: U-0-P:
      const upgradeMatch = memo.match(/^U-(\d+)-([BSP]):?(.*)$/);
      if (upgradeMatch) {
        return {
          success: true,
          data: {
            type: 'upgrade',
            duration: parseInt(upgradeMatch[1]),
            tier: this.getTierFromCode(upgradeMatch[2]),
            immediate: parseInt(upgradeMatch[1]) === 0
          }
        };
      }

      return { 
        success: false, 
        error: 'Unable to parse memo format' 
      };

    } catch (error) {
      return { 
        success: false, 
        error: `Memo parsing error: ${error.message}` 
      };
    }
  }

  // Helper method to convert tier codes to names
  getTierFromCode(code) {
    const tierMap = { 'B': 'basic', 'S': 'standard', 'P': 'premium' };
    return tierMap[code] || 'basic';
  }

  // Calculate expected payment amount for validation
  calculateExpectedAmount(memoData) {
    const { type, duration, tier, wallets = [], addon } = memoData;
    
    try {
      switch (type) {
        case 'new_subscription':
          const tierConfig = SUBSCRIPTION_CONFIG.TIERS[tier];
          if (!tierConfig) return 0;
          
          const durationOption = SUBSCRIPTION_CONFIG.DURATION_OPTIONS.find(d => d.value === duration);
          const basePrice = tierConfig.price * duration;
          const discount = durationOption ? (basePrice * durationOption.discount) / 100 : 0;
          
          return (basePrice - discount).toFixed(4);

        case 'add_wallet':
        case 'wallet_renewal':
          // Assuming a fixed rate per wallet per month
          const walletRate = 2; // WAX per wallet per month
          return (walletRate * wallets.length * duration).toFixed(4);

        case 'subscription_addon':
          const subAddon = SUBSCRIPTION_CONFIG.ADDONS[addon];
          return subAddon ? (subAddon.price * duration).toFixed(4) : '0.0000';

        case 'wallet_addon':
          const walletAddon = SUBSCRIPTION_CONFIG.ADDONS[addon];
          return walletAddon ? (walletAddon.price * wallets.length * duration).toFixed(4) : '0.0000';

        case 'subscription_renewal':
        case 'upgrade':
          const renewalTierConfig = SUBSCRIPTION_CONFIG.TIERS[tier];
          if (!renewalTierConfig) return 0;
          
          if (type === 'upgrade' && duration === 0) {
            // Immediate upgrade - prorated cost
            return (renewalTierConfig.price * 0.5).toFixed(4);
          }
          
          return (renewalTierConfig.price * duration).toFixed(4);

        default:
          return '0.0000';
      }
    } catch (error) {
      console.error('Error calculating expected amount:', error);
      return '0.0000';
    }
  }

  // Validate payment amount against memo
  validatePaymentAmount(amount, memo, tolerance = 0.1) {
    const memoData = this.parseMemo(memo);
    if (!memoData.success) {
      return { valid: false, error: memoData.error };
    }

    const expectedAmount = parseFloat(this.calculateExpectedAmount(memoData.data));
    const actualAmount = parseFloat(amount);
    const difference = Math.abs(expectedAmount - actualAmount);

    if (difference > tolerance) {
      return {
        valid: false,
        error: `Payment amount mismatch. Expected: ${expectedAmount} WAX, Received: ${actualAmount} WAX`,
        expectedAmount,
        actualAmount,
        difference
      };
    }

    return { 
      valid: true, 
      expectedAmount, 
      actualAmount,
      memoData: memoData.data 
    };
  }

  // Get subscription recommendations based on usage
  getSubscriptionRecommendations(currentWallets = 0, projectedGrowth = 0) {
    const totalWallets = currentWallets + projectedGrowth;
    const tiers = Object.values(SUBSCRIPTION_CONFIG.TIERS);
    
    return tiers
      .filter(tier => tier.walletLimit >= totalWallets)
      .map(tier => ({
        ...tier,
        recommended: tier.id === 'standard', // Default recommendation
        savings: this.calculateSavings(tier.id, 3), // 3-month savings
        costPerWallet: (tier.price / tier.walletLimit).toFixed(2)
      }))
      .sort((a, b) => a.price - b.price);
  }

  // Calculate savings for longer subscriptions
  calculateSavings(tierId, duration) {
    const tier = SUBSCRIPTION_CONFIG.TIERS[tierId];
    const durationOption = SUBSCRIPTION_CONFIG.DURATION_OPTIONS.find(d => d.value === duration);
    
    if (!tier || !durationOption) return 0;
    
    const monthlyTotal = tier.price * duration;
    const discountedTotal = monthlyTotal * (1 - durationOption.discount / 100);
    
    return (monthlyTotal - discountedTotal).toFixed(2);
  }
}

// Create and export singleton instance
const subscriptionService = new SubscriptionService();
export default subscriptionService;
