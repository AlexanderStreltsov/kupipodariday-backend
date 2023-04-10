import { DataSource, type DataSourceOptions } from 'typeorm';
import configuration from './appconfig';

export const AppDataSource = new DataSource(
  configuration().database as DataSourceOptions,
);
