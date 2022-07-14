import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { yellow, green } from 'cli-color';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { promises } from 'fs';
import { join } from 'path';
import helmet from 'helmet';

const logger = new Logger('NestApplication', { timestamp: true });

const initSwagger = (app: INestApplication, config, pkg) => {
  const swaggerConf = new DocumentBuilder()
    .setTitle(config.swagger.title)
    .setDescription(fs.readFileSync('docs/description.md').toString())
    .addBearerAuth()
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
      },
      'address:signature',
    )
    .setVersion(pkg.version)
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConf);
  SwaggerModule.setup('api/docs/', app, swaggerDocument);
};

let app: INestApplication;

async function bootstrap() {
  process.env.NODE_ENV === 'production'
    ? (app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn'] }))
    : (app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn', 'debug'] }));
  const config = app.get('CONFIG').env;
  console.log(config);
  const pkg = JSON.parse(await promises.readFile(join('.', 'package.json'), 'utf8'));

  if (config.disableSecurity) {
    app.enableCors({
      allowedHeaders: 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Observe, Signature, Authorization',
      origin: true,
      credentials: true,
    });
    app.use(helmet());
  }


  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
  app.enableShutdownHooks();


  initSwagger(app, config, pkg);

  const port = parseInt(process.env.API_PORT) || config.listenPort;
  await app.listen(port, () => {
    logger.log(`Nest application listening on port: ${yellow(port)}`);
    logger.log(`Nest application ${green('version:')} ${yellow(pkg.version)} ${green('started!')}`);
  });
}

bootstrap().catch((error: unknown) => {
  logger.error('Bootstrapping application failed! ' + error);
});

async function gracefulShutdown(): Promise<void> {
  if (app !== undefined) {
    await app.close();
    logger.warn('Application closed!');
  }
  process.exit(0);
}

process.once('SIGTERM', async () => {
  logger.warn('SIGTERM: Graceful shutdown... ');
  await gracefulShutdown();
});

process.once('SIGINT', async () => {
  logger.warn('SIGINT: Graceful shutdown... ');
  await gracefulShutdown();
});
