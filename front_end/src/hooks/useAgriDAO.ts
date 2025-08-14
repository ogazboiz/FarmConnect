import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { getContractAddresses, FarmTokenABI, GreenPointsABI, CropNFTABI, FarmerDAOABI, AgriBountiesABI } from '@/config';
import { toast } from 'react-hot-toast';
import { ethers } from 'ethers';

const contracts = getContractAddresses();

// Farm Token Hooks
export const useFarmToken = () => {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const mint = async (to: string, amount: bigint) => {
    try {
      console.log('Submitting mint transaction...');
      writeContract({
        address: contracts.FARM_TOKEN,
        abi: FarmTokenABI,
        functionName: 'mint',
        args: [to, amount],
      });
      toast.success('Transaction submitted! Waiting for confirmation...');
    } catch (error) {
      toast.error('Failed to mint FARM tokens');
      console.error('mint error:', error);
    }
  };

  const transfer = async (to: string, amount: bigint) => {
    try {
      console.log('Submitting transfer transaction...');
      writeContract({
        address: contracts.FARM_TOKEN,
        abi: FarmTokenABI,
        functionName: 'transfer',
        args: [to, amount],
      });
      toast.success('Transaction submitted! Waiting for confirmation...');
    } catch (error) {
      toast.error('Failed to transfer FARM tokens');
      console.error('transfer error:', error);
    }
  };

  const approve = async (spender: string, amount: bigint) => {
    try {
      console.log('Submitting approve transaction...');
      writeContract({
        address: contracts.FARM_TOKEN,
        abi: FarmTokenABI,
        functionName: 'approve',
        args: [spender, amount],
      });
      toast.success('Transaction submitted! Waiting for confirmation...');
    } catch (error) {
      toast.error('Failed to approve FARM tokens');
      console.error('approve error:', error);
    }
  };

  return {
    mint,
    transfer,
    approve,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
};

// Hook to read FARM token balance
export const useFarmTokenBalance = (address?: string) => {
  const result = useReadContract({
    address: contracts.FARM_TOKEN,
    abi: FarmTokenABI,
    functionName: 'balanceOf',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
      gcTime: 5000,
      staleTime: 0,
    },
  });

  const formatted = result.data ? ethers.formatUnits(result.data.toString(), 18) : '0';

  return {
    ...result,
    formatted,
    formattedWithSymbol: `${formatted} FARM`,
  };
};

// Hook to read FARM token info
export const useFarmTokenInfo = () => {
  const name = useReadContract({
    address: contracts.FARM_TOKEN,
    abi: FarmTokenABI,
    functionName: 'name',
  });

  const symbol = useReadContract({
    address: contracts.FARM_TOKEN,
    abi: FarmTokenABI,
    functionName: 'symbol',
  });

  const decimals = useReadContract({
    address: contracts.FARM_TOKEN,
    abi: FarmTokenABI,
    functionName: 'decimals',
  });

  const totalSupply = useReadContract({
    address: contracts.FARM_TOKEN,
    abi: FarmTokenABI,
    functionName: 'totalSupply',
  });

  return {
    name: name.data as string,
    symbol: symbol.data as string,
    decimals: decimals.data as number,
    totalSupply: totalSupply.data as bigint,
    totalSupplyFormatted: totalSupply.data ? ethers.formatUnits(totalSupply.data.toString(), 18) : '0',
    isLoading: name.isLoading || symbol.isLoading || decimals.isLoading || totalSupply.isLoading,
    nameLoading: name.isLoading,
    symbolLoading: symbol.isLoading,
    decimalsLoading: decimals.isLoading,
  };
};

// Green Points Hooks
export const useGreenPoints = () => {
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const redeemPoints = async (amount: bigint, redemption: string) => {
    try {
      writeContract({
        address: contracts.GREEN_POINTS,
        abi: GreenPointsABI,
        functionName: 'redeemPoints',
        args: [amount, redemption],
      });
      toast.success('Points redeemed successfully!');
    } catch (error) {
      toast.error('Failed to redeem points');
      console.error(error);
    }
  };

  return {
    redeemPoints,
    isConfirming,
    isSuccess,
    hash,
  };
};

// Hook to read GREEN points balance
export const useGreenPointsBalance = (address?: string) => {
  const result = useReadContract({
    address: contracts.GREEN_POINTS,
    abi: GreenPointsABI,
    functionName: 'balanceOf',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
      gcTime: 5000,
      staleTime: 0,
    },
  });

  const formatted = result.data ? ethers.formatUnits(result.data.toString(), 18) : '0';

  return {
    ...result,
    formatted,
    formattedWithSymbol: `${formatted} GREEN`,
  };
};

// Crop NFT Hooks
export const useCropNFT = () => {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createCropBatch = async (
    cropType: string,
    location: string,
    isOrganic: boolean,
    quantity: bigint,
    cropImage: string
  ) => {
    try {
      console.log('Submitting createCropBatch transaction...');
      writeContract({
        address: contracts.CROP_NFT,
        abi: CropNFTABI,
        functionName: 'createCropBatch',
        args: [cropType, location, isOrganic, quantity, cropImage],
      });
      toast.success('Transaction submitted! Waiting for confirmation... 🌾');
    } catch (error) {
      toast.error('Failed to create crop batch');
      console.error('createCropBatch error:', error);
    }
  };

  const scanProduct = async (tokenId: bigint) => {
    try {
      console.log('Submitting scanProduct transaction...');
      writeContract({
        address: contracts.CROP_NFT,
        abi: CropNFTABI,
        functionName: 'scanProduct',
        args: [tokenId],
      });
      toast.success('Transaction submitted! Waiting for confirmation... 📱');
    } catch (error) {
      toast.error('Failed to scan product');
      console.error('scanProduct error:', error);
    }
  };

  const rateProduct = async (tokenId: bigint, rating: bigint) => {
    try {
      console.log('Submitting rateProduct transaction...');
      writeContract({
        address: contracts.CROP_NFT,
        abi: CropNFTABI,
        functionName: 'rateProduct',
        args: [tokenId, rating],
      });
      toast.success(`Transaction submitted! Waiting for confirmation... ⭐`);
    } catch (error) {
      toast.error('Failed to rate product');
      console.error('rateProduct error:', error);
    }
  };

  const shareProduct = async (tokenId: bigint) => {
    try {
      console.log('Submitting shareProduct transaction...');
      writeContract({
        address: contracts.CROP_NFT,
        abi: CropNFTABI,
        functionName: 'shareProduct',
        args: [tokenId],
      });
      toast.success('Transaction submitted! Waiting for confirmation... 📤');
    } catch (error) {
      toast.error('Failed to share product');
      console.error('shareProduct error:', error);
    }
  };

  const updateStatus = async (tokenId: bigint, newStatus: string) => {
    try {
      console.log('Submitting updateStatus transaction...');
      writeContract({
        address: contracts.CROP_NFT,
        abi: CropNFTABI,
        functionName: 'updateStatus',
        args: [tokenId, newStatus],
      });
      toast.success(`Transaction submitted! Waiting for confirmation...`);
    } catch (error) {
      toast.error('Failed to update status');
      console.error('updateStatus error:', error);
    }
  };

  const addCertification = async (tokenId: bigint, certification: string) => {
    try {
      console.log('Submitting addCertification transaction...');
      writeContract({
        address: contracts.CROP_NFT,
        abi: CropNFTABI,
        functionName: 'addCertification',
        args: [tokenId, certification],
      });
      toast.success('Transaction submitted! Waiting for confirmation... ✅');
    } catch (error) {
      toast.error('Failed to add certification');
      console.error('addCertification error:', error);
    }
  };

  const updateCropImage = async (tokenId: bigint, newImage: string) => {
    try {
      console.log('Submitting updateCropImage transaction...');
      writeContract({
        address: contracts.CROP_NFT,
        abi: CropNFTABI,
        functionName: 'updateCropImage',
        args: [tokenId, newImage],
      });
      toast.success('Transaction submitted! Waiting for confirmation... 📸');
    } catch (error) {
      toast.error('Failed to update crop image');
      console.error('updateCropImage error:', error);
    }
  };

  return {
    createCropBatch,
    scanProduct,
    rateProduct,
    shareProduct,
    updateStatus,
    addCertification,
    updateCropImage,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
};

// Hook to read crop batch data
export const useCropBatch = (tokenId?: bigint) => {
  return useReadContract({
    address: contracts.CROP_NFT,
    abi: CropNFTABI,
    functionName: 'getCropBatch',
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId,
      gcTime: 5000,
      staleTime: 0,
    },
  });
};

// Hook to read farmer's crops
export const useFarmerCrops = (farmerAddress?: string) => {
  const result = useReadContract({
    address: contracts.CROP_NFT,
    abi: CropNFTABI,
    functionName: 'getFarmerCrops',
    args: farmerAddress ? [farmerAddress] : undefined,
    query: {
      enabled: !!farmerAddress,
      gcTime: 5000,
      staleTime: 0,
    },
  });

  return {
    ...result,
    data: Array.isArray(result.data) ? result.data : [],
    count: Array.isArray(result.data) ? result.data.length : 0,
  };
};

// Hook to get farmer statistics
export const useFarmerStats = (farmerAddress?: string) => {
  const result = useReadContract({
    address: contracts.CROP_NFT,
    abi: CropNFTABI,
    functionName: 'getFarmerStats',
    args: farmerAddress ? [farmerAddress] : undefined,
    query: {
      enabled: !!farmerAddress,
    },
  });

  return {
    ...result,
    data: result.data ? {
      totalCrops: (result.data as [bigint, bigint, bigint, bigint])[0],
      reputation: (result.data as [bigint, bigint, bigint, bigint])[1],
      totalScans: (result.data as [bigint, bigint, bigint, bigint])[2],
      totalRatings: (result.data as [bigint, bigint, bigint, bigint])[3],
      reputationFormatted: (result.data as [bigint, bigint, bigint, bigint])[1] ? (result.data as [bigint, bigint, bigint, bigint])[1].toString() : '0',
    } : null,
  };
};

// NEW: Hook to get farmer reputation from CropNFT contract
export const useFarmerReputation = (address?: string) => {
  const { data } = useReadContract({
    address: contracts.CROP_NFT,
    abi: [
      {
        "inputs": [{"name": "farmer", "type": "address"}],
        "name": "farmerReputation",
        "outputs": [{"name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
      }
    ],
    functionName: 'farmerReputation',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
      gcTime: 5000,
      staleTime: 0,
    },
  });

  return data || BigInt(0);
};

// Hook to get NFT total supply
export const useCropNFTTotalSupply = () => {
  return useReadContract({
    address: contracts.CROP_NFT,
    abi: CropNFTABI,
    functionName: 'totalSupply',
    query: {
      gcTime: 5000,
      staleTime: 0,
    },
  });
};

// Farmer DAO Hooks
export const useFarmerDAO = () => {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const joinDAO = async (farmLocation: string) => {
    try {
      console.log('Submitting joinDAO transaction...');
      writeContract({
        address: contracts.FARMER_DAO,
        abi: FarmerDAOABI,
        functionName: 'joinDAO',
        args: [farmLocation],
      });
      toast.success('Transaction submitted! Waiting for confirmation... 🤝');
    } catch (error) {
      toast.error('Failed to join DAO');
      console.error('joinDAO error:', error);
    }
  };

  const stakeTokens = async (amount: bigint) => {
    try {
      console.log('Submitting stakeTokens transaction...');
      writeContract({
        address: contracts.FARMER_DAO,
        abi: FarmerDAOABI,
        functionName: 'stakeTokens',
        args: [amount],
      });
      toast.success('Transaction submitted! Waiting for confirmation... 🗳️');
    } catch (error) {
      toast.error('Failed to stake tokens');
      console.error('stakeTokens error:', error);
    }
  };

  const unstakeTokens = async (amount: bigint) => {
    try {
      console.log('Submitting unstakeTokens transaction...');
      writeContract({
        address: contracts.FARMER_DAO,
        abi: FarmerDAOABI,
        functionName: 'unstakeTokens',
        args: [amount],
      });
      toast.success('Transaction submitted! Waiting for confirmation... 🔓');
    } catch (error) {
      toast.error('Failed to unstake tokens');
      console.error('unstakeTokens error:', error);
    }
  };

  const createProposal = async (
    title: string,
    description: string,
    amount: bigint,
    proposalType: number,
    recipient: string
  ) => {
    try {
      console.log('Submitting createProposal transaction...');
      writeContract({
        address: contracts.FARMER_DAO,
        abi: FarmerDAOABI,
        functionName: 'createProposal',
        args: [title, description, amount, proposalType, recipient],
      });
      toast.success('Transaction submitted! Waiting for confirmation... 📝');
    } catch (error) {
      toast.error('Failed to create proposal');
      console.error('createProposal error:', error);
    }
  };

  const vote = async (proposalId: bigint, support: boolean) => {
    try {
      console.log('Submitting vote transaction...');
      writeContract({
        address: contracts.FARMER_DAO,
        abi: FarmerDAOABI,
        functionName: 'vote',
        args: [proposalId, support],
      });
      toast.success(`Transaction submitted! Waiting for confirmation... 🗳️`);
    } catch (error) {
      toast.error('Failed to cast vote');
      console.error('vote error:', error);
    }
  };

  const executeProposal = async (proposalId: bigint) => {
    try {
      console.log('Submitting executeProposal transaction...');
      writeContract({
        address: contracts.FARMER_DAO,
        abi: FarmerDAOABI,
        functionName: 'executeProposal',
        args: [proposalId],
      });
      toast.success('Transaction submitted! Waiting for confirmation... ⚡');
    } catch (error) {
      toast.error('Failed to execute proposal');
      console.error('executeProposal error:', error);
    }
  };

  return {
    joinDAO,
    stakeTokens,
    unstakeTokens,
    createProposal,
    vote,
    executeProposal,
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
};

// Hook to read DAO member staked balance
export const useStakedBalance = (address?: string) => {
  return useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'stakedBalance',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      gcTime: 5000,
      staleTime: 0,
    },
  });
};

// Hook to read total staked tokens in DAO
export const useTotalStaked = () => {
  return useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'totalStaked',
    query: {
      gcTime: 5000,
      staleTime: 0,
    },
  });
};

// Hook to read treasury balance
export const useTreasuryBalance = () => {
  return useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'treasuryBalance',
    query: {
      gcTime: 5000,
      staleTime: 0,
    },
  });
};

// Hook to read DAO member data
export const useDAOMember = (address?: string) => {
  return useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'members',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      gcTime: 5000,
      staleTime: 0,
    },
  });
};

// Hook to read proposal data
export const useProposal = (proposalId?: bigint) => {
  return useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'getProposal',
    args: proposalId ? [proposalId] : undefined,
    query: {
      enabled: !!proposalId,
      gcTime: 5000,
      staleTime: 0,
    },
  });
};

// Hook to get voting power
export const useVotingPower = (address?: string) => {
  return useReadContract({
    address: contracts.FARMER_DAO,
    abi: FarmerDAOABI,
    functionName: 'getVotingPower',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      gcTime: 5000,
      staleTime: 0,
    },
  });
};

// Agri Bounties Hooks
export const useAgriBounties = () => {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createBounty = async (
    title: string,
    requirements: string,
    category: string,
    reward: bigint,
    durationInDays: bigint
  ) => {
    try {
      console.log('Submitting createBounty transaction...');
      writeContract({
        address: contracts.AGRI_BOUNTIES,
        abi: AgriBountiesABI,
        functionName: 'createBounty',
        args: [title, requirements, category, reward, durationInDays],
      });
      toast.success('Transaction submitted! Waiting for confirmation... 🎯');
    } catch (error) {
      toast.error('Failed to create bounty');
      console.error('createBounty error:', error);
    }
  };

  const submitToBounty = async (bountyId: bigint, submissionData: string) => {
    try {
      console.log('Submitting submitToBounty transaction...');
      writeContract({
        address: contracts.AGRI_BOUNTIES,
        abi: AgriBountiesABI,
        functionName: 'submitToBounty',
        args: [bountyId, submissionData],
      });
      toast.success('Transaction submitted! Waiting for confirmation... 🔬');
    } catch (error) {
      toast.error('Failed to submit solution');
      console.error('submitToBounty error:', error);
    }
  };

  const completeBounty = async (bountyId: bigint, submissionId: bigint) => {
    try {
      console.log('Submitting completeBounty transaction...');
      writeContract({
        address: contracts.AGRI_BOUNTIES,
        abi: AgriBountiesABI,
        functionName: 'completeBounty',
        args: [bountyId, submissionId],
      });
      toast.success('Transaction submitted! Waiting for confirmation... 🏆');
    } catch (error) {
      toast.error('Failed to complete bounty');
      console.error('completeBounty error:', error);
    }
  };

  // ADD THIS NEW VOTING FUNCTION:
  const voteOnSubmission = async (submissionId: bigint, support: boolean) => {
    try {
      console.log('Submitting vote transaction...');
      writeContract({
        address: contracts.AGRI_BOUNTIES,
        abi: AgriBountiesABI,
        functionName: 'voteOnSubmission',
        args: [submissionId, support],
      });
      toast.success(`Transaction submitted! ${support ? '👍' : '👎'} Vote cast...`);
    } catch (error) {
      toast.error('Failed to vote on submission');
      console.error('voteOnSubmission error:', error);
    }
  };


  

  return {
    createBounty,
    submitToBounty,
    completeBounty,
    voteOnSubmission, // ADD THIS
    isPending,
    isConfirming,
    isSuccess,
    hash,
  };
};


export const useHasSubmitted = (bountyId?: bigint, userAddress?: string) => {
  const result = useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'hasSubmitted',
    args: bountyId && userAddress ? [bountyId, userAddress] : undefined,
    query: {
      enabled: !!(bountyId && userAddress),
      gcTime: 5000,
      staleTime: 0,
    },
  });

  return result.data as boolean || false;
};
// Hook to read bounty data
export const useBounty = (bountyId?: bigint) => {
  return useReadContract({
    address: contracts.AGRI_BOUNTIES,
    abi: AgriBountiesABI,
    functionName: 'getBounty',
    args: bountyId ? [bountyId] : undefined,
    query: {
      enabled: !!bountyId,
      gcTime: 5000,
      staleTime: 0,
    },
  });
};

// Combined hook for user dashboard
export const useUserDashboard = (address?: string) => {
  const farmBalance = useFarmTokenBalance(address);
  const greenBalance = useGreenPointsBalance(address);
  const farmerCrops = useFarmerCrops(address);
  const farmerStats = useFarmerStats(address);
  const daoMember = useDAOMember(address);
  const farmTokenInfo = useFarmTokenInfo();
  const farmerReputation = useFarmerReputation(address); // NEW: Include farmer reputation

  return {
    farmBalance: farmBalance.data,
    farmBalanceFormatted: farmBalance.formatted,
    greenBalance: greenBalance.data,
    greenBalanceFormatted: greenBalance.formatted,
    crops: farmerCrops.data,
    cropCount: farmerCrops.count,
    farmerStats: farmerStats.data,
    reputation: farmerStats.data?.reputationFormatted || '0',
    cropReputation: Number(farmerReputation), // NEW: Crop reputation from CropNFT
    totalScans: farmerStats.data?.totalScans || BigInt(0),
    totalRatings: farmerStats.data?.totalRatings || BigInt(0),
    daoMember: daoMember.data,
    farmTokenInfo,
    isLoading: farmBalance.isLoading || greenBalance.isLoading || farmerCrops.isLoading || daoMember.isLoading || farmerStats.isLoading,
  };
};

// Utility functions
export const formatTokenAmount = (amount: bigint | undefined, decimals: number = 18): string => {
  if (!amount) return '0';
  return ethers.formatUnits(amount.toString(), decimals);
};

export const parseTokenAmount = (amount: string, decimals: number = 18): bigint => {
  return BigInt(ethers.parseUnits(amount, decimals));
};