import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

dotenvExpand.expand(dotenv.config());

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  secret: process.env.JWT_SECRET || 'secret-string',
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/src/**/**.entity{.ts,.js}'],
    migrations: [__dirname + '/src/database/migrations/*{.ts,.js}'],
    synchronize: false,
  },
});
