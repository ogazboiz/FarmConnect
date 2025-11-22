import { BaseAsset, BaseAccount } from 'lisk-sdk';

export interface GreenPointsAccount extends BaseAccount {
  greenPoints: {
    balance: bigint;
    totalScans: number;
    totalRatings: number;
    totalShares: number;
    totalReferrals: number;
  };
}

export interface GreenPointsAsset extends BaseAsset {
  user: Buffer;
  amount: bigint;
  action: string;
}

export interface RedeemPointsAsset extends BaseAsset {
  amount: bigint;
  redemption: string;
}

export interface AwardPointsAsset extends BaseAsset {
  user: Buffer;
  amount: bigint;
  action: string;
}

export interface UserStats {
  scans: number;
  ratings: number;
  shares: number;
  referrals: number;
  balance: bigint;
}

export const SCAN_POINTS = BigInt(10 * 10 ** 18);       // 10 GREEN points
export const RATE_POINTS = BigInt(20 * 10 ** 18);       // 20 GREEN points
export const SHARE_POINTS = BigInt(25 * 10 ** 18);      // 25 GREEN points
export const REFERRAL_POINTS = BigInt(100 * 10 ** 18);  // 100 GREEN points

