import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from './config/config.service';
import { OffersModule } from './offers/offers.module';
import { TradesModule } from './trades/trades.module';
import { AuctionsModule } from './auctions/auctions.module';
import { BlockchainModule } from './blockchain/blockchain.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'marketplace'),
      serveRoot: '/marketplace',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OffersModule,
    TradesModule,
    AuctionsModule,
    BlockchainModule,

  ],
  controllers: [],
  providers: [
    {
      provide: 'CONFIG',
      useClass: ConfigService,
    },
  ],
})
export class AppModule {}
