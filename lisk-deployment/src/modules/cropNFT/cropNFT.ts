import { BaseModule, ModuleMetadata, AfterGenesisBlockApplyContext, BeforeBlockApplyContext } from 'lisk-sdk';
import { CropNFTAccount, CropNFTAsset } from './types';
import { CropNFTEndpoint } from './endpoint';
import { CropNFTMethod } from './method';

export class CropNFTModule extends BaseModule {
  public endpoint = new CropNFTEndpoint(this.id);
  public method = new CropNFTMethod(this.id);

  public metadata(): ModuleMetadata {
    return {
      endpoints: [
        {
          name: this.endpoint.name,
          controller: this.endpoint,
        },
      ],
      assets: [
        {
          name: 'CreateCropBatchAsset',
          id: 0,
        },
        {
          name: 'ScanProductAsset',
          id: 1,
        },
        {
          name: 'RateProductAsset',
          id: 2,
        },
        {
          name: 'ShareProductAsset',
          id: 3,
        },
        {
          name: 'UpdateStatusAsset',
          id: 4,
        },
      ],
      stores: [
        {
          name: 'CropNFTAccount',
          key: 'CropNFTAccount',
        },
        {
          name: 'CropBatch',
          key: 'CropBatch',
        },
        {
          name: 'EngagementData',
          key: 'EngagementData',
        },
      ],
      events: [
        {
          name: 'cropBatchCreated',
          data: {
            tokenId: { dataType: 'uint32' },
            farmer: { dataType: 'bytes' },
            cropType: { dataType: 'string' },
          },
        },
        {
          name: 'cropScanned',
          data: {
            tokenId: { dataType: 'uint32' },
            scanner: { dataType: 'bytes' },
            scanCount: { dataType: 'uint32' },
          },
        },
        {
          name: 'cropRated',
          data: {
            tokenId: { dataType: 'uint32' },
            rater: { dataType: 'bytes' },
            rating: { dataType: 'uint32' },
          },
        },
        {
          name: 'cropShared',
          data: {
            tokenId: { dataType: 'uint32' },
            sharer: { dataType: 'bytes' },
            shareCount: { dataType: 'uint32' },
          },
        },
      ],
      commands: [
        {
          name: 'createCropBatch',
          params: {
            $id: '/cropNFT/createCropBatch',
            type: 'object',
            required: ['cropType', 'location', 'isOrganic', 'quantity', 'cropImage'],
            properties: {
              cropType: { dataType: 'string' },
              location: { dataType: 'string' },
              isOrganic: { dataType: 'boolean' },
              quantity: { dataType: 'uint64' },
              cropImage: { dataType: 'string' },
            },
          },
        },
        {
          name: 'scanProduct',
          params: {
            $id: '/cropNFT/scanProduct',
            type: 'object',
            required: ['tokenId'],
            properties: {
              tokenId: { dataType: 'uint32' },
            },
          },
        },
        {
          name: 'rateProduct',
          params: {
            $id: '/cropNFT/rateProduct',
            type: 'object',
            required: ['tokenId', 'rating'],
            properties: {
              tokenId: { dataType: 'uint32' },
              rating: { dataType: 'uint32' },
            },
          },
        },
      ],
    };
  }

  public async afterGenesisBlockApply(context: AfterGenesisBlockApplyContext): Promise<void> {
    // Initialize module state after genesis block
    const accounts = await context.stateStore.account.get<CropNFTAccount>([]);
    
    for (const account of accounts) {
      if (!account.cropNFT) {
        account.cropNFT = {
          ownedCrops: [],
          reputation: 0,
        };
        await context.stateStore.account.set(account.address, account);
      }
    }
  }

  public async beforeBlockApply(context: BeforeBlockApplyContext): Promise<void> {
    // Any pre-block processing logic
  }
}

