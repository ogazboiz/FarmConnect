import { BaseModule, ModuleMetadata, AfterGenesisBlockApplyContext, BeforeBlockApplyContext } from 'lisk-sdk';
import { AgriBountiesAccount, AgriBountiesAsset } from './types';
import { AgriBountiesEndpoint } from './endpoint';
import { AgriBountiesMethod } from './method';

export class AgriBountiesModule extends BaseModule {
  public endpoint = new AgriBountiesEndpoint(this.id);
  public method = new AgriBountiesMethod(this.id);

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
          name: 'CreateBountyAsset',
          id: 0,
        },
        {
          name: 'SubmitToBountyAsset',
          id: 1,
        },
        {
          name: 'VoteOnSubmissionAsset',
          id: 2,
        },
        {
          name: 'CompleteBountyAsset',
          id: 3,
        },
        {
          name: 'CancelBountyAsset',
          id: 4,
        },
      ],
      stores: [
        {
          name: 'AgriBountiesAccount',
          key: 'AgriBountiesAccount',
        },
        {
          name: 'Bounty',
          key: 'Bounty',
        },
        {
          name: 'Submission',
          key: 'Submission',
        },
        {
          name: 'BountySettings',
          key: 'BountySettings',
        },
      ],
      events: [
        {
          name: 'bountyCreated',
          data: {
            bountyId: { dataType: 'uint32' },
            creator: { dataType: 'bytes' },
            title: { dataType: 'string' },
            category: { dataType: 'string' },
            reward: { dataType: 'uint64' },
            deadline: { dataType: 'uint32' },
          },
        },
        {
          name: 'submissionMade',
          data: {
            bountyId: { dataType: 'uint32' },
            submissionId: { dataType: 'uint32' },
            submitter: { dataType: 'bytes' },
          },
        },
        {
          name: 'bountyCompleted',
          data: {
            bountyId: { dataType: 'uint32' },
            winner: { dataType: 'bytes' },
            reward: { dataType: 'uint64' },
          },
        },
      ],
      commands: [
        {
          name: 'createBounty',
          params: {
            $id: '/agriBounties/createBounty',
            type: 'object',
            required: ['title', 'requirements', 'category', 'reward', 'durationInDays'],
            properties: {
              title: { dataType: 'string' },
              requirements: { dataType: 'string' },
              category: { dataType: 'string' },
              reward: { dataType: 'uint64' },
              durationInDays: { dataType: 'uint32' },
            },
          },
        },
        {
          name: 'submitToBounty',
          params: {
            $id: '/agriBounties/submitToBounty',
            type: 'object',
            required: ['bountyId', 'submissionData'],
            properties: {
              bountyId: { dataType: 'uint32' },
              submissionData: { dataType: 'string' },
            },
          },
        },
        {
          name: 'completeBounty',
          params: {
            $id: '/agriBounties/completeBounty',
            type: 'object',
            required: ['bountyId', 'submissionId'],
            properties: {
              bountyId: { dataType: 'uint32' },
              submissionId: { dataType: 'uint32' },
            },
          },
        },
      ],
    };
  }

  public async afterGenesisBlockApply(context: AfterGenesisBlockApplyContext): Promise<void> {
    // Initialize module state after genesis block
    const accounts = await context.stateStore.account.get<AgriBountiesAccount>([]);
    
    for (const account of accounts) {
      if (!account.agriBounties) {
        account.agriBounties = {
          reputation: 0,
          bountiesCreated: 0,
          bountiesWon: 0,
          submissionsMade: 0,
          totalEarned: BigInt(0),
          isVerified: false,
        };
        await context.stateStore.account.set(account.address, account);
      }
    }
  }

  public async beforeBlockApply(context: BeforeBlockApplyContext): Promise<void> {
    // Any pre-block processing logic
  }
}

