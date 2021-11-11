/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const pg = require('pg');
pg.defaults.ssl = true;
const Sequelize = require('sequelize');
const fs = require('fs');

const DataTypes = Sequelize.DataTypes;

const DATABASE_URL = process.env.DATABASE_URL;
const dbConnectionString = DATABASE_URL;
const sequelize = new Sequelize(dbConnectionString, {
    dialect: 'postgres',
    logging: false,
    ssl: true,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    pool: {
        acquire: 2000,
    },
});

const models = fs.readdirSync(__dirname)
    .reduce((all, fileName) => {
        if (fileName === 'index.js') {
            return all;
        }
        const modelName = fileName.split('.')[0];
        return {
            ...all,
            [modelName]: require(`${__dirname}/${fileName}`)(sequelize, DataTypes),
        };
    }, {});

Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});
module.exports = {
    NOW: Sequelize.NOW,
    sequelize,
    Sequelize,
    ...models,
};
