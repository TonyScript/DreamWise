const { Sequelize } = require('sequelize');
const path = require('path');

// 确保数据库目录存在
const fs = require('fs');
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DATABASE_URL || path.join(__dirname, '../database/dreamwise.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
        timestamps: true,
        underscored: false,
        freezeTableName: false
    }
});

module.exports = sequelize;