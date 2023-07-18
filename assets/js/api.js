import { apiBaseUrl } from "./config.js";

export async function getListFromAPI() {
  // Appeler le backend sur la route /lists pour récupérer toutes les cartes !
  const url = `${apiBaseUrl}/lists`;
  const httpResponse = await fetch(url);
  const lists = await httpResponse.json();
  return lists;
}

export async function createList(listData) {
  const responseHttp = await fetch(`${apiBaseUrl}/lists`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(listData)
  });

  if (! responseHttp.ok) { return null; }

  const createdList = await responseHttp.json();
  return createdList;
}

export async function createCard(cardData) { // { title: "...", list_id: "..." }
  const httpResponse = await fetch(`${apiBaseUrl}/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cardData)
  });

  if (! httpResponse.ok) { return null; }

  const createdCard = await httpResponse.json();
  return createdCard;
}

export async function updateList(listId, newListData) { // newListData = { name: "..." }
  const url = `${apiBaseUrl}/lists/${listId}`;
  const httpResponse = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newListData)
  });

  if (! httpResponse.ok) { return null; }

  const updatedList = await httpResponse.json();
  return updatedList;
}

export async function updateCard(cardId, newCardData) { // newCardData = { title: "..." }
  const url = `${apiBaseUrl}/cards/${cardId}`;
  const httpResponse = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCardData)
  });

  if (! httpResponse.ok) { return null; }

  const updatedCard = await httpResponse.json();
  return updatedCard;
}


export async function deleteCard(cardId) {
  const url = `${apiBaseUrl}/cards/${cardId}`;
  const httpResponse = await fetch(url, { method: "DELETE" });
  return httpResponse.ok; // si OK, on renvoie true. si pas OK, on renvoie false !
}
