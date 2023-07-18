const { Sequelize } = require('sequelize');

const PG_URL = process.env.PG_URL || "postgres://okanban2:okanban@localhost:5432/okanban2";

const defineAttributes = {
    define: {
        underscored: true,          // On indique à sequelize de passer en mode snake case
        createdAt: "created_at",    // On indique à sequelize la syntaxe pour nos timestamps
        updatedAt: "updated_at",
    }
};

const sequelize = new Sequelize(PG_URL, defineAttributes);

module.exports = sequelize;