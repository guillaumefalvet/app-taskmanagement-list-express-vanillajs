const sanitizer = require('sanitizer');

const bodySanitizer = (req, res, next) => {
    if (req.body){                                                          // Si on a un body, autrement dit, si on est sur autre chose qu'une requete GET/DELETE
        for(let propName in req.body){                                      // Pour chaque propriété dans le body (par exemple .name, .position, etc...)
            req.body[propName] = sanitizer.escape(req.body[propName]);      // On nettoie le contenu de la propriété "sale"
            // Par exemple, pour le name, le traitement ressemble à ça
            // req.body.name = sanitizer.escape(req.body.name);
        }
    }
    next();
}

module.exports = bodySanitizer;
