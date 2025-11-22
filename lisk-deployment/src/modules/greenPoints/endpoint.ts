import { BaseEndpoint, ModuleEndpointContext } from 'lisk-sdk';
import { GreenPointsAccount, UserStats } from './types';

export class GreenPointsEndpoint extends BaseEndpoint {
  public name = 'greenPoints';

  public async getBalance(context: ModuleEndpointContext): Promise<{ balance: string }> {
    const { address } = context.params;
    const account = await context.stateStore.account.get<GreenPointsAccount>(Buffer.from(address, 'hex'));
    
    if (!account || !account.greenPoints) {
      return { balance: '0' };
    }
    
    return { balance: account.greenPoints.balance.toString() };
  }

  public async getUserStats(context: ModuleEndpointContext): Promise<UserStats> {
    const { address } = context.params;
    const account = await context.stateStore.account.get<GreenPointsAccount>(Buffer.from(address, 'hex'));
    
    if (!account || !account.greenPoints) {
      return {
        scans: 0,
        ratings: 0,
        shares: 0,
        referrals: 0,
        balance: BigInt(0),
      };
    }
    
    return {
      scans: account.greenPoints.totalScans,
      ratings: account.greenPoints.totalRatings,
      shares: account.greenPoints.totalShares,
      referrals: account.greenPoints.totalReferrals,
      balance: account.greenPoints.balance,
    };
  }

  public async getTotalSupply(context: ModuleEndpointContext): Promise<{ totalSupply: string }> {
    // This would require iterating through all accounts to calculate total supply
    // For now, return a placeholder
    return { totalSupply: '0' };
  }
}

