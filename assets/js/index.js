
import {
  listenToClickOnAddListButton,
  listenToClicksOnModalClosingElements,
} from "./modals.js";

import {
  listenToSubmitOnAddCardForm,
  listenToSubmitOnEditCardForm,
  listenToSubmitOnDeleteCardForm,
  listenToDragAndDropOnCards
} from "./cards.module.js";

import {
  fetchAndDisplayListsAndCards,
  listenToSubmitOnAddListForm,
  listenToSubmitOnEditListForm,
  listenToDragAndDropOnLists
} from "./lists.module.js";


// Initialisation du JavaScript
document.addEventListener("DOMContentLoaded", async () => { // Déclenche le callback lorsque l'intégralité du DOM est chargé
  listenToUserActions();
  await fetchAndDisplayListsAndCards();

  listenToDragAndDropOnLists();
  listenToDragAndDropOnCards();
});


function listenToUserActions() {
  listenToClickOnAddListButton();
  listenToClicksOnModalClosingElements();
  listenToSubmitOnAddListForm();
  listenToSubmitOnAddCardForm();
  listenToSubmitOnEditListForm();
  listenToSubmitOnEditCardForm();
  listenToSubmitOnDeleteCardForm();
}


