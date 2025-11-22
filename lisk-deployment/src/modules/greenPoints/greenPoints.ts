import { BaseModule, ModuleMetadata, AfterGenesisBlockApplyContext, BeforeBlockApplyContext } from 'lisk-sdk';
import { GreenPointsAccount, GreenPointsAsset } from './types';
import { GreenPointsEndpoint } from './endpoint';
import { GreenPointsMethod } from './method';

export class GreenPointsModule extends BaseModule {
  public endpoint = new GreenPointsEndpoint(this.id);
  public method = new GreenPointsMethod(this.id);

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
          name: 'GreenPointsAsset',
          id: 0,
        },
      ],
      stores: [
        {
          name: 'GreenPointsAccount',
          key: 'GreenPointsAccount',
        },
      ],
      events: [
        {
          name: 'pointsAwarded',
          data: {
            user: { dataType: 'bytes' },
            amount: { dataType: 'uint64' },
            action: { dataType: 'string' },
          },
        },
        {
          name: 'pointsRedeemed',
          data: {
            user: { dataType: 'bytes' },
            amount: { dataType: 'uint64' },
            redemption: { dataType: 'string' },
          },
        },
      ],
      commands: [
        {
          name: 'awardPoints',
          params: {
            $id: '/greenPoints/awardPoints',
            type: 'object',
            required: ['user', 'amount', 'action'],
            properties: {
              user: { dataType: 'bytes' },
              amount: { dataType: 'uint64' },
              action: { dataType: 'string' },
            },
          },
        },
        {
          name: 'redeemPoints',
          params: {
            $id: '/greenPoints/redeemPoints',
            type: 'object',
            required: ['amount', 'redemption'],
            properties: {
              amount: { dataType: 'uint64' },
              redemption: { dataType: 'string' },
            },
          },
        },
      ],
    };
  }

  public async afterGenesisBlockApply(context: AfterGenesisBlockApplyContext): Promise<void> {
    // Initialize module state after genesis block
    const accounts = await context.stateStore.account.get<GreenPointsAccount>([]);
    
    for (const account of accounts) {
      if (!account.greenPoints) {
        account.greenPoints = {
          balance: BigInt(0),
          totalScans: 0,
          totalRatings: 0,
          totalShares: 0,
          totalReferrals: 0,
        };
        await context.stateStore.account.set(account.address, account);
      }
    }
  }

  public async beforeBlockApply(context: BeforeBlockApplyContext): Promise<void> {
    // Any pre-block processing logic
  }
}

