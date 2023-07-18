const { List, Card } = require('../models');

const cardController = {
  getCardsInList: async (req, res) => {
    try {
      const listId = req.params.id;
      /*Une autre façon de récupérer une liste avec ses cards
      const cards = await List.findByPk(listId, {
        include: {
          association: 'cards',               
          include: 'tags'                     
        },
        order: [                              
          ['position', 'ASC'],                
          ['cards', 'position', 'ASC']       
        ]
      });
      */
      const cards = await Card.findAll( // On cherche toutes les cards
        {
          where: { // toutes les cards qui possèdent un list_id = params.id
            list_id: listId
          },
          include: 'tags', // On incclue pour chaque card l'association "tags"
          order: [
            ['position', 'ASC'] // On trie par position ascendante
          ]
        });

      if (!cards) {
        res.status(404).json('Cant find cards with list_id ' + listId);
      } else {
        res.json(cards);
      }

    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  getOneCard: async (req, res) => {
    try {
      const cardId = req.params.id;
      const card = await Card.findByPk(cardId, { // On cherche un card qui possède un id = cardId
        include: 'tags', // Pour cette card on inclue l'association tags, donc tous les tags qui concernent cette carte
        order: [
          ['position', 'ASC']
        ]
      });
      if (!card.length ) { // Si on ne trouve pas la card, on préfera utiliser .length
        res.status(404).json('Cant find card with id ' + cardId);
      } else { // Sinon, on envoie le résultat au client
        res.json(card);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  createCard: async (req, res) => {
    try {
      const { title, color, position, list_id } = req.body;

      let bodyErrors = [];
      if (!title) {
        bodyErrors.push(`title can not be empty`);
      }
      if (!list_id) {
        bodyErrors.push(`list_id can not be empty`);
      }

      // if (color && ! /^#[0-9A-F]{3,6}$/i.test(color)) {
      //   bodyErrors.push(`la couleur doit etre un code hexadecimal`);
      // }

      if (bodyErrors.length) {
        res.status(400).json(bodyErrors);
      } else {
        let newCard = Card.build({ title, list_id }); // On utilise .build() pour créer une instance avec les valeurs obligatoires
        if (color) { // On test les valeurs optionnelles, et on les ajoute si besoin à notre instance
          newCard.color = color;
        }
        if (position) {
          newCard.position = position;
        }
        await newCard.save(); // On enregistre notre instance dans la bdd
        res.json(newCard);
      }

    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  modifyCard: async (req, res) => {
    try {
      const cardId = req.params.id;
      const { title, color, list_id, position } = req.body;

      // on inclue les tags pour pouvoir les renvoyer à la fin de l'update
      let card = await Card.findByPk(cardId, {
        include: ['tags']
      });
      if (!card) {
        res.status(404).json(`Cant find card with id ${cardId}`);
      } else {
        // on ne change que les paramètres envoyés
        if (title) {
          card.title = title;
        }
        if (list_id) {
          card.list_id = list_id;
        }
        if (color) {
          card.color = color;
        }
        if (!isNaN(position)) {
          card.position = position;
        }
        await card.save();
        res.json(card);
      }

    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  },

  deleteCard: async (req, res) => {
    try {
      const cardId = req.params.id;
      let card = await Card.findByPk(cardId);
      if (!card) {
        res.status(404).json(`Cant find card with id ${cardId}`);
      } else {
        await card.destroy();
        res.json('ok');
      }

    } catch (error) {
      console.trace(error);
      res.status(500).json(error);
    }
  }
};


module.exports = cardController;
