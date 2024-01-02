const addBookmarkEl = document.getElementById("add-btn");
const modalEl = document.getElementById("modal");
const closeModalEl = document.getElementById("close-modal");
const bookmarkContainerEl = document.getElementById("bookmark-container");
const formEl = document.getElementById("form");
const websiteNameEl = document.getElementById("name");
const websiteUrlEl = document.getElementById("url");

let bookmarks = {};
addBookmarkEl.addEventListener("click", () => {
  modalEl.classList.add("show-modal");
  websiteNameEl.focus();
});

closeModalEl.addEventListener("click", () => {
  modalEl.classList.remove("show-modal");
});

//Valida Form
const validate = (nameValue, urlValue) => {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please submit values for both fields");
    return false;
  }

  if (!urlValue.match(regex)) {
    alert("Please Provide a valid web address");
    return false;
  }
  return true;
};

const displayBookmarks = () => {
  //This is to reset our Bookmark Container. Otherwise what will happen is every time when the forEach loop runs the Items will get added, will not get replaced
  bookmarkContainerEl.textContent = "";

  Object.keys(bookmarks).forEach((id) => {
    const { name, url } = bookmarks[id];
    const item = document.createElement("div");
    item.setAttribute("class", "item");

    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-xmark");
    icon.setAttribute("id", "delete-bookmark");
    icon.setAttribute("title", "Delete Bookmark");
    icon.setAttribute("onclick", `deleteBookmark('${id}')`);

    const innerContainer = document.createElement("div");
    innerContainer.setAttribute("class", "name");

    const img = document.createElement("img");
    img.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    img.setAttribute("alt", "favicon");

    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;

    innerContainer.append(img, link);
    item.append(icon, innerContainer);
    bookmarkContainerEl.appendChild(item);
  });
};

const fetchBookmarks = () => {
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    const id = `https://WWW.google.com`;
    (bookmarks[id] = {
      name: "Google",
      url: "https://WWW.google.com",
    }),
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  displayBookmarks();
};

const storeBookmark = (e) => {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  console.log(urlValue);
  if (!urlValue.includes("https://")) {
    urlValue = `https://${urlValue}`;
  }
  if (!validate(nameValue, urlValue)) {
    return false;
  }

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks[urlValue] = bookmark;
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  formEl.reset();
  websiteNameEl.focus();
};

formEl.addEventListener("submit", storeBookmark);

const deleteBookmark = (id) => {
  if (bookmarks[id]) {
    delete bookmarks[id];
  }
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  displayBookmarks();
};
window.addEventListener("click", (e) => {
  e.target === modalEl && modalEl.classList.remove("show-modal");
});

fetchBookmarks();
