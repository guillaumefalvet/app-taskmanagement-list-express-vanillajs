const { List } = require('../models');

const listController = {
    /**
     * Cette fonction va récupérer toutes les listes en DB
     * @param {*} req 
     * @param {*} res 
     */
    getAllLists: async (req, res) => {
        try {
            const lists = await List.findAll({
              include: {
                association: 'cards',               // On inclue l'association cards (une list avec ses cards)
                include: 'tags'                     // Pour chaque card, on inclue l'association tags (une card avec ses tags)
              },
              order: [                              // On trie
                ['position', 'ASC'],                // Les listes par position ascendante (du plus petit au plus grand)
                ['cards', 'position', 'ASC']        // Les cards par position ascendante 
              ]
            });
            res.status(200).json(lists);            // On renvoie la réponse avec un code 200 : OK
          } catch (error) {                         // En cas d'erreur
            console.trace(error);                   // On affiche l'erreur en console
            res.status(500).json(error.toString()); // On renvoie une réponse avec code 500 : internal server error, ainsi que le message d'erreur
          }
    },

    getOneList: async (req, res) => {
        try {
          const listId = req.params.id;             // On récupère l'id de la liste dans la requête
          const list = await List.findByPk(listId, {
            include: {
              association: 'cards',                 // On inclue l'association cards (une list avec ses cards)
              include: 'tags'                       // Pour chaque card, on inclue l'association tags (une card avec ses tags)
            },
            order: [
              ['cards', 'position', 'ASC']          // On trie les cards par position ascendante (du plus petit au plus grand)
            ]
          });
          if (list) {                               // Si on a bien récupéré la liste 
            res.status(200).json(list);             // On renvoie la liste avec code 200
          } else {
            res.status(404).json('Cant find list ' + listId);
          }
    
        } catch (error) {
          console.trace(error);
          res.status(500).json(error.toString());
        }
      },
    
    createList: async (req, res) => {
      try {
        /*const name = req.body.name;
          const position = req.body.position;*/
        const { name, position } = req.body;        // On récupère les valeurs dans le body (en déstructuration)
        const bodyErrors = [];                      // On créé une array dans laquelle on glissera les erreurs éventuelles
        if (!name) {                                // Si le name est absent de la requete
          bodyErrors.push('name can not be empty'); // On glisse l'erreur dans l'array bodyErrors
        }
                                                    // Si il y avait d'autres valeurs à tester, on pourrait glisser les erreurs dans bodyErrors
                                                    // Cela permet de lister les différentes erreurs et de renvoyer le tout vers le frontend
  
        if (bodyErrors.length) {                    // Si une (ou plusieurs) erreur est détectée
          res.status(422).json(bodyErrors);         // On envoie la liste d'erreurs avec le code 400 : Requête incorrecte
        } else {                                    // Sinon, s'il n'y a pas d'erreurs
          let newList = List.build({                // On créé une instance de la liste avec .build() (cf : https://sequelize.org/docs/v6/core-concepts/model-instances/#creating-an-instance)
            name,
            position,
            //equipement
          });
          // ... Par exemple, on veut donner un suffixe au nom de la liste
          // newList = newList + "-MonSuperSuffixe";
          // newList.password = leRésultatDeBcrypt
          await newList.save();                     // On enregistre l'instance créée dans la db
          res.status(201).json(newList);            // On répond avec la liste créée  
        }
  
      } catch (error) {
        console.trace(error);
        res.status(500).json(error.toString());
      }
    },
    
    modifyList: async (req, res) => {
      try {
        const listId = req.params.id;                       // On récupère l'id de la liste à modifier
        const list = await List.findByPk(listId);           // On cherche la liste dans la db
        if (!list) {                                        // Si la liste n'existe pas
          res.status(404).send('Cant find list ' + listId); // On retourne une erreur 404
        } else {                                            // Sinon, si la liste existe
  
          const { name, position } = req.body;              // On récupère les nouvelles infos dans le body
                                                            // On ne change que les paramètres présents
          if (name) {                                       // Si name est présent dans le body
            list.name = name;                               // On change le name de l'objet instancié "list" (récupéré à la ligne 77)
          }
  
          if (!isNaN(position)) {                                   // Si position est présent dans le body
            list.position = position;                       // On change la position de l'objet instancié "list" 
          } 
  
          await list.save();                                // Une fois toutes les modifs faites, on enregistre l'instance dans la db
  
          res.status(200).json(list);                       // Une fois que l'instance est enregistrée, on envoie la list en réponse à la requête
        }
  
      } catch (error) {
        console.trace(error);
        res.status(500).json(error.toString());
      }
    },
    
    deleteList: async (req, res) => {
      try {
        const listId = req.params.id;
        const list = await List.findByPk(listId);
        if(list){
          await list.destroy();
          res.status(200).json('OK');
        }
        
      } catch (error) {
        console.trace(error);
        res.status(500).json(error.toString());
      }
    }
}

module.exports = listController;
