import { DataSource, DataSourceOptions } from 'typeorm';

const connects: {
  [key: string]: DataSource;
} = {};

export const getConnection = (name = 'default'): DataSource => {
  return connects[name];
};

export const initTypeorm = (options: { [key: string]: DataSourceOptions }) => {
  for (const key in options) {
    if (Object.prototype.hasOwnProperty.call(options, key)) {
      const dataSource = new DataSource(options[key]);
      dataSource
        .initialize()
        .then(() => {
          console.log('Data Source has been initialized!');
        })
        .catch(err => {
          console.error('Error during Data Source initialization', err);
        });
      connects[key] = dataSource;
    }
  }
};
