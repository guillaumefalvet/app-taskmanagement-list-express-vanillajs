export function closeModals() {
  const activeModals = document.querySelectorAll(".is-active"); // on selectionne toutes les modals qui a la classe "is-active"
  activeModals.forEach(activeModal => {
    activeModal.classList.remove("is-active"); // on retire cette classe de l'élément
  });
}

export function openAddListModal() {
  const addListModal = document.querySelector("#add-list-modal"); // Selectionner la modal d'ajout de liste
  addListModal.classList.add("is-active"); // et lui ajouter la classe "is-active"
}

export function listenToClickOnAddListButton() {
  const addListButton = document.querySelector("#add-list-button"); // Selectionner le bouton d'ajout d'une liste
  addListButton.addEventListener("click", openAddListModal);
}

export function listenToClicksOnModalClosingElements() {
  const closeElements = [ // Selectionner tous les élements qui ont la classe "close" ET tous les éléments qui ont la classe "modal-background"
    ...document.querySelectorAll(".close"), // Tableau d'objet !! Attention
    ...document.querySelectorAll(".modal-background") // Idem, tableau des éléments qui ont la classe modal-background
  ];

  closeElements.forEach((element) => { // Pour chaque élément, on :
    element.addEventListener("click", closeModals);
  });
}

export function openAddCardModalWithListId(listId) { // ex: listId = 42
  const addCardModal = document.querySelector("#add-card-modal");
  addCardModal.classList.add("is-active");

  // On veut ajouter la listId dans la modal qqpart pour la récupérer plus tard
  addCardModal.dataset.listId = listId;
}

export async function openEditListModal(listId) {
  const editListModal = document.getElementById("edit-list-modal");
  editListModal.classList.add("is-active");

  editListModal.dataset.listId = listId; // On met l'ID de la liste dans les dataset de la modal pour le récupérer plus tard
  // editListModal.dataset.previousListName = previousListName; // Pas besoin !

  // On choppe le previousListName dans la liste elle même
  const previousListName = document.getElementById(`list-${listId}`).querySelector('[slot="list-name"]').textContent;

  // Et on le met dans le input de la modal
  editListModal.querySelector("input").value = previousListName;
}

export function openEditCardModal(cardId) { // ex: cardId = 13
  const editCardModal = document.querySelector("#edit-card-modal"); // On selectionne la bonne modale à ouvrir
  editCardModal.classList.add("is-active"); // On ouvre la bonne modale;

  editCardModal.dataset.cardId = cardId; // Ajoute `data-card-id="13"` sur la modal

  const previousCardTitle = document.getElementById(`card-${cardId}`).querySelector('[slot="card-title"]').textContent;
  editCardModal.querySelector("input#edit-card-title").value = previousCardTitle;

  const previousColorCardRGB = document.getElementById(`card-${cardId}`).style.backgroundColor;
  const previousColorCardHexa = rgbToHex(previousColorCardRGB);
  editCardModal.querySelector("input#edit-card-color").value = previousColorCardHexa; // Seule une valeur hexa avec 6 chiffres fonctionne ici
}

export function openDeleteCardModal(cardId) {
  const deleteCardModal = document.querySelector("#delete-card-modal");
  deleteCardModal.classList.add("is-active");

  deleteCardModal.dataset.cardId = cardId;
}


function rgbToHex(rgbCode) {
  // Séparer les valeurs R, G et B en utilisant une expression régulière
  const match = rgbCode.match(/\d+/g);
  if (!match || match.length !== 3) {
    throw new Error("Le code RGB doit être au format 'rgb(r, g, b)' avec r, g et b des nombres entiers.");
  }

  // Convertir les valeurs R, G et B en nombres entiers
  const r = parseInt(match[0], 10);
  const g = parseInt(match[1], 10);
  const b = parseInt(match[2], 10);

  // Vérifier que les valeurs R, G et B sont valides (entre 0 et 255)
  if (isNaN(r) || isNaN(g) || isNaN(b) || r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    throw new Error("Les valeurs R, G et B doivent être des nombres entiers entre 0 et 255.");
  }

  // Convertir les valeurs R, G et B en code hexadécimal
  const hex = ((r << 16) | (g << 8) | b).toString(16).toUpperCase();

  // Remplir avec des zéros à gauche jusqu'à obtenir 6 caractères
  return "#".concat("0".repeat(6 - hex.length), hex);
}
