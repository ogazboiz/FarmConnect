import { BaseMethod, MethodContext, ImmutableMethodContext } from 'lisk-sdk';
import { GreenPointsAccount, AwardPointsAsset, RedeemPointsAsset } from './types';

export class GreenPointsMethod extends BaseMethod {
  public name = 'greenPoints';

  public async awardPoints(
    context: MethodContext,
    asset: AwardPointsAsset,
  ): Promise<void> {
    const { user, amount, action } = asset;
    
    if (amount <= BigInt(0)) {
      throw new Error('Amount must be greater than 0');
    }
    
    const account = await context.stateStore.account.get<GreenPointsAccount>(user);
    if (!account) {
      throw new Error('Account not found');
    }
    
    if (!account.greenPoints) {
      account.greenPoints = {
        balance: BigInt(0),
        totalScans: 0,
        totalRatings: 0,
        totalShares: 0,
        totalReferrals: 0,
      };
    }
    
    account.greenPoints.balance += amount;
    
    // Update activity counters based on action
    switch (action) {
      case 'scan':
        account.greenPoints.totalScans += 1;
        break;
      case 'rate':
        account.greenPoints.totalRatings += 1;
        break;
      case 'share':
        account.greenPoints.totalShares += 1;
        break;
      case 'referral':
        account.greenPoints.totalReferrals += 1;
        break;
    }
    
    await context.stateStore.account.set(user, account);
    
    // Emit event
    context.eventQueue.add('pointsAwarded', {
      user,
      amount: amount.toString(),
      action,
    });
  }

  public async redeemPoints(
    context: MethodContext,
    asset: RedeemPointsAsset,
  ): Promise<void> {
    const { amount, redemption } = asset;
    const { address } = context;
    
    if (amount <= BigInt(0)) {
      throw new Error('Amount must be greater than 0');
    }
    
    const account = await context.stateStore.account.get<GreenPointsAccount>(address);
    if (!account || !account.greenPoints) {
      throw new Error('Account not found or no green points initialized');
    }
    
    if (account.greenPoints.balance < amount) {
      throw new Error('Insufficient balance');
    }
    
    account.greenPoints.balance -= amount;
    await context.stateStore.account.set(address, account);
    
    // Emit event
    context.eventQueue.add('pointsRedeemed', {
      user: address,
      amount: amount.toString(),
      redemption,
    });
  }

  public async getBalance(
    context: ImmutableMethodContext,
    address: Buffer,
  ): Promise<bigint> {
    const account = await context.stateStore.account.get<GreenPointsAccount>(address);
    if (!account || !account.greenPoints) {
      return BigInt(0);
    }
    return account.greenPoints.balance;
  }
}

