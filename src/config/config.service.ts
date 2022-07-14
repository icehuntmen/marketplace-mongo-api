import * as path from 'path';

export class ConfigService {
  private readonly env: { [key: string]: any } = null;

  constructor() {
    this.env = {};
    this.env.mode = process.env.NODE_ENV || 'production';
    this.env.marketType = process.env.MARKET_TYPE || 'secondary'; // primary or secondary
    this.env.listenPort = parseInt(process.env.API_PORT) || 5000;
    this.env.disableSecurity = process.env.DISABLE_SECURITY === 'true';
    this.env.rootDir = path.normalize(path.join(__dirname, '..'));
    this.env.autoDBMigrations = process.env.AUTO_DB_MIGRATIONS === 'true';
    this.env.mainSaleSeed = process.env.MAINSALE_SEED || null;
    this.env.adminList = process.env.ADMIN_LIST || '';
    this.env.dev = {
      debugMigrations: false,
      debugScanBlock: false,
    }
    this.env.jwt = {
      access: '24h',
      refresh: '7d',
    }
    this.env.sentry = {
      enabled: process.env.SENTRY_ENABLED === 'true',
      environment: process.env.SENTRY_ENV || 'dev', // | 'production' | 'some_environment',
      dsn: process.env.SENTRY_DSN || 'https://hash@domain.tld/sentryId',
      debug: process.env.SENTRY_DEBUG === 'true',
      release: process.env.SENTRY_RELEASE || '',
    }
    this.env.swagger = {
      title: 'Marketplace api',
    }
    this.env.blockchain = {
      escrowSeed: process.env.ESCROW_SEED || null, // For kusama and contract creation
      unique: {
        wsEndpoint: process.env.UNIQUE_WS_ENDPOINT || 'wss://quartz.unique.network',
        network: process.env.UNIQUE_NETWORK || 'quartz',
        startFromBlock: parseInt(process.env.UNIQUE_START_FROM_BLOCK) || 0,
        contractOwnerSeed: process.env.UNIQUE_CONTRACT_OWNER_SEED || null,
        contractOwnerAddress: process.env.UNIQUE_CONTRACT_OWNER_ADDRESS || null,
        collectionIds: (process.env.UNIQUE_COLLECTION_IDS || '')
          .split(',')
          .map((x) => Number(x.trim()))
          .filter((x) => !isNaN(x) && x > 0 && x !== Infinity),
      },
      kusama: {
        wsEndpoint: process.env.KUSAMA_WS_ENDPOINT || 'wss://kusama-node.polkadot.io',
        network: process.env.KUSAMA_NETWORK || 'kusama',
        startFromBlock: parseInt(process.env.KUSAMA_START_FROM_BLOCK) || 0,
        ss58Format: parseInt(process.env.KUSAMA_SS58_FORMAT) || 0,
        marketCommission: parseInt(process.env.KUSAMA_MARKET_COMMISSION) || 0,
        waitBlocks: parseInt(process.env.KUSAMA_WAIT_BLOCKS) || 0,
      }
    }
    this.env.testing = {
      escrowSeed: '//Alice',
      unique: {
        wsEndpoint: process.env.UNIQUE_WS_ENDPOINT || 'wss://quartz.unique.network',
        network: process.env.UNIQUE_NETWORK || 'quartz',
        startFromBlock: parseInt(process.env.UNIQUE_START_FROM_BLOCK) || 0,
        contractOwnerSeed: process.env.UNIQUE_CONTRACT_OWNER_SEED || null,
        contractOwnerAddress: process.env.UNIQUE_CONTRACT_OWNER_ADDRESS || null,
        collectionIds: (process.env.UNIQUE_COLLECTION_IDS || '')
          .split(',')
          .map((x) => Number(x.trim()))
          .filter((x) => !isNaN(x) && x > 0 && x !== Infinity),
      },
      kusama: {
        wsEndpoint: process.env.KUSAMA_WS_ENDPOINT || 'wss://kusama-node.polkadot.io',
        network: process.env.KUSAMA_NETWORK || 'kusama',
        startFromBlock: parseInt(process.env.KUSAMA_START_FROM_BLOCK) || 0,
        ss58Format: parseInt(process.env.KUSAMA_SS58_FORMAT) || 0,
        marketCommission: parseInt(process.env.KUSAMA_MARKET_COMMISSION) || 0,
        waitBlocks: parseInt(process.env.KUSAMA_WAIT_BLOCKS) || 0,
      },
    }
    this.env.auction = {
      seed: process.env.AUCTION_SEED || null,
      commission: parseInt(process.env.AUCTION_COMMISSION) || 10,
    }
    this.env.ipfs = process.env.IPFS || 'https://ipfs.unique.network/ipfs'
  }



  get(key: string): any {
    return this.env[key];
  }
}
