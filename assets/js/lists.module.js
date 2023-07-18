import Sortable from "sortablejs";
import { createList, getListFromAPI, updateList } from "./api.js";
import { addCardToList } from "./cards.module.js";
import { closeModals, openAddCardModalWithListId, openEditListModal } from "./modals.js";

export async function fetchAndDisplayListsAndCards() {
  const lists = await getListFromAPI(); // [ {}, {}, {} ]
  lists.forEach((list) => { // Pour chaque liste
    addListToListsContainer(list); // On insert la liste
    // On veut insérer les cartes de la liste
    list.cards.forEach((card) => {
      addCardToList(card);
    });
  });

  // === VERSION FOR OF FONCTIONNE AUSSI ===
  // for (const list of lists) {
  //   addListToListsContainer(list);
  //   for (const card of list.cards) {
  //     addCardToList(card);
  //   }
  // }
}

export function listenToSubmitOnAddListForm() {
  const addListForm = document.querySelector("#add-list-modal form"); // On selectionne le formulaire

  addListForm.addEventListener("submit", async (event) => { // On écoute le submit, en cas de submit
    event.preventDefault(); // Empêcher le rechargeemnt de la page

    // Récupérer les données de l'utilisateur
    const newListFormData = new FormData(addListForm); // => Format particulier, difficilement manipulable // Affiche {} si on le console.log
    const newListData = Object.fromEntries(newListFormData); // => Astuce pour avoir un "objet simple" plus facilement manipulable // Affiche { name: "Sport" } si on le log

    // Envoyer les données de la liste au backend pour création de la liste
    const createdList = await createList(newListData);
    if (! createdList) {
      alert(`Un problème est survenu. Veuillez réessayer plus tard.`); // UX : techniquement, il faudrait ouvrir une vraie MODAL propre ou rediriger vers une page "500"
      closeModals();
      return;
    }

    // Insérer la liste dans le DOM
    addListToListsContainer(createdList);
  });
}

export function addListToListsContainer(listToInsert) { // { id: 1, name: "Sport" }
  // === Insertion dans le DOM ===
  const listTemplate = document.querySelector("#list-template"); // Récupérer le template d'une liste
  const listClone = listTemplate.content.cloneNode(true); // Le cloner
  listClone.querySelector('[slot="list-name"]').textContent = listToInsert.name; // Changer son texte en fonction de la data qu'on veut afficher
  listClone.querySelector('[slot="list-id"]').id = `list-${listToInsert.id}`;

  const listsContainer = document.querySelector("#lists-container"); // Selectionner le parent
  listsContainer.appendChild(listClone); // On insère dans le lists-container. Naturellement, il va le mettre en "dernier" de cette liste

  // Ecouter le click sur le bouton + de la liste
  const listElement = document.getElementById(`list-${listToInsert.id}`); // On re-selectionne la liste car on ne peut pas poser de EventListener sur le "Clone" (limitation explicité dans la DOC)

  const addCardButton = listElement.querySelector('[slot="add-card-button"]');
  addCardButton.addEventListener("click", () => { openAddCardModalWithListId(listToInsert.id); });

  const listTitleElement = listElement.querySelector('[slot="list-name"]');
  listTitleElement.addEventListener("click", () => { openEditListModal(listToInsert.id); });

  closeModals(); // Refermer la modal
  document.querySelector("#add-list-modal form").reset(); // Reset le formulaire
}


export function listenToSubmitOnEditListForm() {
  const editListModal = document.querySelector("#edit-list-modal");

  // Selectionner le FORM de la modal d'edit
  const editListForm = editListModal.querySelector("form");

  // Ecouter le submit, en cas de submit :
  editListForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // - on récupère les données du form (nouveau 'name')
    const newListData = Object.fromEntries(new FormData(editListForm)); // { name: "Sports" }

    // - on récupère l'ID de la list qui est en train d'être updated (dans les dataset de la modal !)
    const listId = editListModal.dataset.listId;

    // - on fait un call API pour update la liste
    const updatedList = await updateList(listId, newListData);

    if (updatedList) { //   - si OK : on met à jour la BONNE liste
      // update le nom de la liste avec la nouvelle valeur qui est bien passée !!
      document.getElementById(`list-${listId}`).querySelector('[slot="list-name"]').textContent = updatedList.name;
    } else {
      alert(`Un problème est survenu. Veuillez réessayer plus tard.`); //   - si PAS OK : message d'erreur
    }

    closeModals(); // - on ferme la modal
    // - on reset le formulaire (pas necessaire car à chaque ouverture de modal, on écrase les valeurs existante)
  });
}



export function listenToDragAndDropOnLists() {
  // On selectionne le conteneur de listes
  // et on fait un sortable.create dessus

  const listsContainer = document.getElementById("lists-container");

  Sortable.create(listsContainer, {
    animation: 1000,
    handle: ".message-header",
    onEnd: () => { // On peut récupérer l'event pour avoir une meilleure granularité de l'update
      // console.log(event); // Ici, on récupère l'ancienne position de la liste qu'on a bougé et sa nouvelle position. Parfait. Mais notre backend n'étant pas optimiser pour changer la position d'1 liste, on va plutôt changer la position de TOUTES les listes

      // On selectionne toutes les listes
      const lists = document.querySelectorAll("#lists-container section"); // Tableau d'élément

      // Pour chaque carte, on met une nouvelle position correspondant à son index dans la liste des listes
      lists.forEach(async (list, index) => {
        // On veut update la liste dont l'id est "listId" à la position "newPosition"
        const listId = parseInt(list.id.replace("list-", "")); // "list-7" ==> 7
        const newPosition = index;

        await updateList(listId, { position: newPosition }); // A noter, il faudrait gérer la gestion d'erreur
      });
    }
  });
}
