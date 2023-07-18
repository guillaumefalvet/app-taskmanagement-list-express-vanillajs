import { closeModals, openEditCardModal, openDeleteCardModal } from "./modals.js";
import { createCard, updateCard, deleteCard } from "./api.js";
import Sortable from "sortablejs";

export function listenToSubmitOnAddCardForm() {
  const addCardForm = document.querySelector("#add-card-modal form");
  addCardForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const newCardData = Object.fromEntries(new FormData(addCardForm)); // { title: "..." }
    const listId = document.querySelector("#add-card-modal").dataset.listId; // listId = 42 par exemple
    newCardData.list_id = listId;

    // On créer la carte côté backend
    const createdCard = await createCard(newCardData);
    if (! createCard) {
      alert(`Un problème est survenu. Veuillez réessayer plus tard.`); // UX : techniquement, il faudrait ouvrir une vraie MODAL propre ou rediriger vers une page "500"
      closeModals();
      return;
    }

    addCardToList(createdCard);
  });
}

export function addCardToList(card) { // { id: 4, title: "Bonjour" }
  // Selectionner le template d'une carte
  const cardTemplate = document.querySelector("#card-template");

  // Le cloner
  const cardClone = cardTemplate.content.cloneNode(true);

  // Changer les valeurs qu'il faut
  cardClone.querySelector('[slot="card-title"]').textContent = card.title;
  cardClone.querySelector('[slot="card-id"]').id = `card-${card.id}`;
  cardClone.querySelector('[slot="card-id"]').style.backgroundColor = card.color;

  // On pose un listener pour écouter le click sur le bouton EDITION ✏️ (crayon) de la carte
  const cardEditButton = cardClone.querySelector('[slot="card-edit-button"]');
  cardEditButton.addEventListener("click", () => { openEditCardModal(card.id); });

  // On pose un listener pour écouter le click sur le bouton SUPPRIMER 🗑️ de la carte
  const cardDeleteButton = cardClone.querySelector('[slot="card-delete-button"]');
  cardDeleteButton.addEventListener("click", () => { openDeleteCardModal(card.id); });

  // L'insérer dans la carte
  const listElement = document.getElementById(`list-${card.list_id}`);
  const listContentContainer = listElement.querySelector('[slot="list-content"]');
  listContentContainer.append(cardClone);

  // Reset
  closeModals();
  document.querySelector("#add-card-modal form").reset();
}


export function listenToSubmitOnEditCardForm() {
  const editCardModal = document.querySelector("#edit-card-modal");
  const editCardForm = document.querySelector("#edit-card-modal form");

  editCardForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // On empeche le rechargement de la page

    // récupérer les données du form
    const newDataForCardUpdate = Object.fromEntries(new FormData(editCardForm)); // Données du form. Ex : { title: "nouveau nom" }
    const cardId = editCardModal.dataset.cardId; // Id dans le dataset de la modal. Ex : cardId = 8

    // appelle backend
    const updatedCard = await updateCard(cardId, newDataForCardUpdate);

    if (updatedCard) {
      // Tout s'est bien passé, on met à jour le title de la bonne carte
      document.querySelector(`#card-${cardId}`).querySelector('[slot="card-title"]').textContent = updatedCard.title;
      document.querySelector(`#card-${cardId}`).style.backgroundColor = updatedCard.color;
    } else {
      alert(`Un problème est survenu. Veuillez réessayer plus tard.`); // UX : techniquement, il faudrait ouvrir une vraie MODAL propre ou rediriger vers une page "500"
    }

    closeModals();
  });
}

export function listenToSubmitOnDeleteCardForm() {
  const deleteCardForm = document.querySelector("#delete-card-modal form");
  deleteCardForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const cardId = document.querySelector("#delete-card-modal").dataset.cardId;

    const isDeletionSuccessfull = await deleteCard(cardId);

    if (isDeletionSuccessfull) {
      // Selectioner la carte par son ID
      const card = document.querySelector(`#card-${cardId}`);
      card.remove(); // Et la retirer du DOM

    } else {
      alert(`Un problème est survenu. Veuillez réessayer plus tard.`);
    }

    closeModals();
  });
}


export function listenToDragAndDropOnCards() {
  const cardContainers = document.querySelectorAll('[slot="list-content"]');

  cardContainers.forEach(cardContainer => {
    Sortable.create(cardContainer, {
      group: "cards",
      onEnd: async (event) => {
        const cardId = parseInt(event.item.id.replace("card-", ""));

        const newListId = parseInt(event.to.parentElement.id.replace("list-", ""));

        await updateCard(cardId, { list_id: newListId });

        // Puis on gère les positionnements

        const cardContainer = event.to.parentElement;
        const cards = cardContainer.querySelectorAll("article");

        cards.forEach(async (card, index) => {
          const cardId = card.id.replace("card-", "");
          const newPosition = index;
          await updateCard(cardId, { position: newPosition });
        });
      }
    });
  });
}
