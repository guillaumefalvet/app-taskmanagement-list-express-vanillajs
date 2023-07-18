const List = require('./List');
const Card = require('./Card');
const Tag = require('./Tag');

/* Associations */

//cf: https://sequelize.org/docs/v6/core-concepts/assocs/

// One-to-One : hasOne + belongsTo
// One-to-Many : hasMany + belongsTo
// Many-to-Many : belongsToMany (through) + belongsToMany (through)

// List <-> Card (One-to-Many)

List.hasMany(Card, {
    foreignKey: "list_id",
    as: "cards"
});

Card.belongsTo(List, {
    foreignKey: "list_id",
    as: "list"
});

// Card <-> Tag (Many-To-Many)

Card.belongsToMany(Tag, {
    foreignKey: "card_id",
    otherKey: "tag_id",
    as: "tags",
    through: "card_has_tag"
})

Tag.belongsToMany(Card, {
    foreignKey: "tag_id",
    otherKey: "card_id",
    as: "cards",
    through: "card_has_tag"
})

// Tag.findAll({ include: cards })

module.exports = { List, Card, Tag }