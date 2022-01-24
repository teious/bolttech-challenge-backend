import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as PouchdbFind from 'pouchdb-find';
import * as PouchDB from 'pouchdb';

async function bootstrap() {
  PouchDB.plugin(PouchdbFind);

  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(8000);
}
bootstrap();
