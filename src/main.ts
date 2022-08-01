import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, BadRequestException } from '@nestjs/common';

const logger: Logger = new Logger('Main');
const PORT = process.env.SERVER_PORT || 8800;

async function bootstrap() {
  const appOptions = { cors: true };
  const app = await NestFactory.create(AppModule, appOptions);
  app.useGlobalPipes(
    new ValidationPipe({
      // exceptionFactory: (): BadRequestException =>
      //   new BadRequestException('Validation error'),
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(PORT);
  logger.log(`Application listening on port ${PORT}`);
}
bootstrap();
