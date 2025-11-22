import { BaseAsset, BaseAccount } from 'lisk-sdk';

export interface AgriBountiesAccount extends BaseAccount {
  agriBounties: {
    reputation: number;
    bountiesCreated: number;
    bountiesWon: number;
    submissionsMade: number;
    totalEarned: bigint;
    isVerified: boolean;
  };
}

export interface Bounty {
  id: number;
  creator: Buffer;
  title: string;
  requirements: string;
  category: string;
  reward: bigint;
  status: BountyStatus;
  createdAt: number;
  deadline: number;
  submissionCount: number;
  winner: Buffer;
  rewardDistributed: boolean;
}

export interface BountySettings {
  bountyId: number;
  tags: string;
  minReputationRequired: number;
  allowMultipleWinners: boolean;
  maxWinners: number;
  platformFee: bigint;
}

export enum BountyStatus {
  ACTIVE = 0,
  COMPLETED = 1,
  CANCELLED = 2,
  EXPIRED = 3,
}

export interface Submission {
  submissionId: number;
  submitter: Buffer;
  bountyId: number;
  submissionData: string;
  timestamp: number;
  selected: boolean;
  votes: number;
  feedback: string;
  isActive: boolean;
}

export interface CreateBountyAsset extends BaseAsset {
  title: string;
  requirements: string;
  category: string;
  reward: bigint;
  durationInDays: number;
}

export interface SubmitToBountyAsset extends BaseAsset {
  bountyId: number;
  submissionData: string;
}

export interface VoteOnSubmissionAsset extends BaseAsset {
  submissionId: number;
  support: boolean;
}

export interface CompleteBountyAsset extends BaseAsset {
  bountyId: number;
  submissionId: number;
}

export interface CancelBountyAsset extends BaseAsset {
  bountyId: number;
  reason: string;
}

export const MIN_BOUNTY_AMOUNT = BigInt(50 * 10 ** 18); // 50 FARM tokens
export const MAX_BOUNTY_DURATION = 365 * 24 * 60 * 60;  // 1 year max in seconds
export const MIN_BOUNTY_DURATION = 24 * 60 * 60;        // 1 day min in seconds
export const PLATFORM_FEE_PERCENTAGE = 250;              // 2.5%

