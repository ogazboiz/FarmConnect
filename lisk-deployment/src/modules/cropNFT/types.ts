import { BaseAsset, BaseAccount } from 'lisk-sdk';

export interface CropNFTAccount extends BaseAccount {
  cropNFT: {
    ownedCrops: number[];
    reputation: number;
  };
}

export interface CropBatch {
  tokenId: number;
  farmer: Buffer;
  cropType: string;
  location: string;
  isOrganic: boolean;
  quantity: bigint;
  createdAt: number;
  harvestDate: number;
  status: string;
  certifications: string;
  cropImage: string;
}

export interface EngagementData {
  tokenId: number;
  totalScans: number;
  totalRatings: number;
  averageRating: number;
  socialShares: number;
}

export interface CreateCropBatchAsset extends BaseAsset {
  cropType: string;
  location: string;
  isOrganic: boolean;
  quantity: bigint;
  cropImage: string;
}

export interface ScanProductAsset extends BaseAsset {
  tokenId: number;
}

export interface RateProductAsset extends BaseAsset {
  tokenId: number;
  rating: number;
}

export interface ShareProductAsset extends BaseAsset {
  tokenId: number;
}

export interface UpdateStatusAsset extends BaseAsset {
  tokenId: number;
  newStatus: string;
}

export interface CropRating {
  averageRating: number;
  totalRatings: number;
  averageRatingRaw: number;
}

export interface FarmerStats {
  cropCount: number;
  reputation: number;
  totalScans: number;
  totalRatings: number;
}

export const MAX_RATING = 5;
export const RATING_PRECISION = 100;

