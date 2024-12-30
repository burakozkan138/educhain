export const ANDROMEDA_TESTNET = {
  chainId: 'galileo-4',
  chainName: 'Andromeda Testnet',
  rpc: 'https://api.andromedaprotocol.io/rpc/testnet',
  rest: 'https://api.andromedaprotocol.io/rest/testnet',
  bech32Config: {
    bech32PrefixAccAddr: 'andr',
    bech32PrefixAccPub: 'andrpub',
    bech32PrefixValAddr: 'andrvaloper',
    bech32PrefixValPub: 'andrvaloperpub',
    bech32PrefixConsAddr: 'andrvalcons',
    bech32PrefixConsPub: 'andrvalconspub'
  },
  kernelAddress: 'andr14hj2tavq8fpesdwxxcu44rty3hh90vhujrvcmstl4zr3txmfvw9shptkql',
  registryAddress: 'andr1mfxffyrda922hpt23f7hpf8t50sadcwavkt54cuyl3w6p4zwz36sc9hfj6',
  defaultFee: '0.25uandr',
  chainType: 'testnet',
  explorer: {
    tx: 'https://explorer.testnet.andromedaprotocol.io/galileo-4/tx/${txHash}',
    address: 'https://explorer.testnet.andromedaprotocol.io/galileo-4/account/${address}'
  }
};

export const CONTRACT_INFO = {
  EDUCERT: {
    name: 'EduCert',
    type: 'app-contract',
    version: '1.1.2',
    blockHeight: 4514876,
    address: 'andr1hefzu7w8qtxmuyg0737u47xmxl5xwwdx34kaf4njuunrdqs0a4gstv5t5p'
  },
  TOKENS: {
    name: 'tokens',
    type: 'cw721',
    version: '1.0.0',
    blockHeight: 4514876,
    address: 'andr195rlrw5mh9u7ax54fufvtse4x0gf62dcmv5dhf9qtp72tsdl62ms3lcp40'
  },
  CROWDFUND: {
    name: 'crowdfund',
    type: 'crowdfund',
    version: '1.0.0',
    blockHeight: 4514876,
    address: 'andr1g4destcaaecxplzg35avcsa4fcujzgduuejmu4df78h5r2f7zhhqeh5484'
  }
};

export const GAS_CONFIG = {
  mint: 300000,
  transfer: 200000,
  create_campaign: 400000
};

export const ADO_MESSAGES = {
  nft: {
    mint: ({ recipient, metadata }: { recipient: string; metadata: any; }) => ({
      mint: {
        recipient,
        metadata
      }
    }),
    transfer: ({ recipient, token_id }: { recipient: string; token_id: string; }) => ({
      transfer_nft: {
        recipient,
        token_id
      }
    })
  },
  crowdfund: {
    create: ({ goal, end_time }: { goal: string; end_time: number; }) => ({
      create: {
        goal,
        end_time
      }
    }),
    contribute: ({ amount }: { amount: string; }) => ({
      contribute: {
        amount
      }
    })
  }
};