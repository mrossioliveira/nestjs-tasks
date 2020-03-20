import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.GCP_HOSTNAME || dbConfig.host,
  port: process.env.GCP_PORT || dbConfig.port,
  username: process.env.GCP_USERNAME || dbConfig.username,
  password: process.env.GCP_PASSWORD || dbConfig.password,
  database: process.env.GCP_DB_NAME || dbConfig.database,
  synchronize: process.env.TYPEOR_SYNC || dbConfig.synchronize,
  entities: [__dirname + '/../**/*.entity.{js, ts}'],
};
