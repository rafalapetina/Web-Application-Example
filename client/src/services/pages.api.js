import { PageContent } from "../models/PageContent";

const SERVER_URL = "http://localhost:3001";

const addNewPage = async (page) => {
  const response = await fetch(SERVER_URL + "/api/pages/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(page.serialize()),
  });
  if (response.ok) {
    const pageId = await response.json();
    return pageId;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getAllPages = async () => {
  const response = await fetch(SERVER_URL + "/api/pages/all", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  if (response.ok) {
    const pages = await response.json();
    const publishedPages = PageContent.fromJsonArray(pages.publishedPages);
    const userPages = PageContent.fromJsonArray(pages.userPages);
    return { publishedPages, userPages };
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const deletePageById = async (id) => {
  const response = await fetch(SERVER_URL + "/api/pages/" + id, {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) {
    return true;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const editPageById = async (page) => {
  const response = await fetch(SERVER_URL + "/api/pages/" + page.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(page.serialize()),
  });
  if (response.ok) {
    return true;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const pagesAPI = { addNewPage, getAllPages, deletePageById, editPageById };
export default pagesAPI;
