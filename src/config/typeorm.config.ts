import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.API_DB_HOSTNAME || dbConfig.host,
  port: process.env.API_DB_PORT || dbConfig.port,
  username: process.env.API_DB_USERNAME || dbConfig.username,
  password: process.env.API_DB_PASSWORD || dbConfig.password,
  database: process.env.API_DB_NAME || dbConfig.database,
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
  entities: [__dirname + '/../**/*.entity.{js, ts}'],
  logging: 'all',
};
