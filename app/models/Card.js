const { Model, DataTypes } = require('sequelize');
const sequelize = require('../db');

class Card extends Model {}

Card.init({
    title: DataTypes.TEXT,
    position: DataTypes.INTEGER,
    color: DataTypes.TEXT
}, {
    sequelize,
    tableName: "card"
});

module.exports = Card;