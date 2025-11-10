// DOM components
const btnAsideShow = document.querySelector(".btn-aside-show");

const tagsContainer = document.querySelector(".tags-container");

const modal = document.querySelector(".modal-add-bookmarks");
const modalOpenBtn = document.querySelector(".btn-add-bookmark");
const modalCloseBtn = document.querySelector(".close-modal");
const overlay = document.querySelector(".overlay-modal");

const bookmarkContainer = document.querySelector(".bookmark-container");

const btnHome = document.querySelector("#home-all");
const btnArchives = document.querySelector("#home-arquives");

const sortBy = document.querySelector(".btn-order-by");
let sortAscending = true;

const btnSearch = document.getElementById("btn-search");
const edSearch = document.getElementById("edSearch");

// form components
btnSubmitForm = document.querySelector("#bookmark-add-btn");

const selectTags = document.querySelector(".selectTagsContainer");

// Array and Object
const tagsList = [
  "AI",
  "Community",
  "Compatibility",
  "CSS",
  "Design",
  "Framework",
  "Git",
  "HTML",
  "JavaScript",
  "Layout",
  "Learning",
  "Performance",
  "Practice",
  "Reference",
  "Tips",
  "Tools",
  "Tutorial",
];

const bookmarkDB = [
  {
    name: "Frontend Mentor",
    link: "https://www.frontendmentor.io/",
    description:
      "O Frontend Mentor oferece desafios profissionais de design para código que refletem o trabalho de desenvolvimento do mundo real.",
    tags: ["Practice", "Learning", "Community"],
    archived: false,
  },
  {
    name: "MDN Web Docs",
    link: "https://developer.mozilla.org/",
    description:
      "MDN is an open-source, collaborative project owned by Mozilla Corporation and developed by Mozilla, in partnership with a global community of volunteers and partners. ",
    tags: ["Reference", "HTML", "CSS", "JavaScript"],
    archived: true,
  },
  {
    name: "React Docs",
    link: "https://react.dev/",
    description:
      "O React permite que você crie interfaces de usuário a partir de partes individuais chamadas componentes. Crie seus próprios componentes React, como Button, Navbar e Footer.",
    tags: ["JavaScript", "Framework", "Reference"],
    archived: false,
  },
  {
    name: "Claude",
    link: "https://claude.ai/login?returnTo=%2F%3F",
    description:
      "O Claude é um assistente de IA de última geração criado pela Anthropic e treinado para ser seguro, preciso e protegido, tudo para você fazer seu melhor trabalho.",
    tags: ["Tools", "AI", "Learning"],
    archived: false,
  },
];

const storedData = localStorage.getItem("bookmarkDB");
if (storedData) {
  bookmarkDB.splice(0, bookmarkDB.length, ...JSON.parse(storedData));
}
// Functions
const renderCards = (data = bookmarkDB) => {
  bookmarkContainer.innerHTML = "";

  data.forEach((book) => {
    const cardBookmark = document.createElement("div");
    cardBookmark.classList.add("card-bookmark");
    //   header-card-bookmark
    const headerCard = document.createElement("div");
    headerCard.classList.add("header-card");

    const divCardName = document.createElement("div");
    divCardName.classList.add("div-card-name");

    const cardName = document.createElement("h4");
    cardName.classList.add("card-name");
    cardName.textContent = book.name;

    const cardLink = document.createElement("a");
    cardLink.classList.add("card-link");
    cardLink.href = book.link;
    cardLink.target = "_blank";
    cardLink.rel = "noopener noreferrer";

    let domain = book.link;
    try {
      const url = new URL(book.link);
      domain = url.hostname.replace(/^www\./, "");
    } catch (error) {
      console.warn(
        `URL inválida encontrada em "${book.name}": ${book.link}. Erro: ${error}`
      );
    }

    cardLink.textContent = domain;

    divCardName.append(cardName, cardLink);

    const optCard = document.createElement("span");
    optCard.classList.add("opt-card");
    optCard.innerHTML = `<ion-icon name="ellipsis-vertical-outline"></ion-icon>`;

    // menu-option-card ( edit/delete)
    const divOptMenu = document.createElement("div");
    divOptMenu.classList.add("div-opt-menu");

    const optEditBtn = document.createElement("p");
    optEditBtn.classList.add("opt-edit-btn");
    optEditBtn.textContent = "Edit";

    const optDeleteBtn = document.createElement("p");
    optDeleteBtn.classList.add("opt-delete-btn");
    optDeleteBtn.textContent = "Delete";

    divOptMenu.append(optEditBtn, optDeleteBtn);

    headerCard.append(divCardName, optCard, divOptMenu);

    optCard.addEventListener("click", (ev) => {
      ev.stopPropagation();

      document.querySelectorAll(".div-opt-menu.show").forEach((m) => {
        if (m !== divOptMenu) m.classList.remove("show");
      });

      divOptMenu.classList.toggle("show");
    });
    divOptMenu.addEventListener("click", (ev) => ev.stopPropagation());

    optDeleteBtn.addEventListener("click", () => {
      const indexDBDelete = bookmarkDB.indexOf(book);
      if (indexDBDelete !== -1) {
        bookmarkDB.splice(indexDBDelete, 1);
        localStorage.setItem("bookmarkDB", JSON.stringify(bookmarkDB));
        renderCards();
        tagsContainer.innerHTML = "";
        tagsRender(tagsContainer);
      }
    });

    const indexDBEdit = bookmarkDB.indexOf(book);

    optEditBtn.addEventListener("click", () => {
      overlay.classList.add("dark");
      modal.classList.add("active");

      const edName = document.querySelector("#edName");
      const edURL = document.querySelector("#edURL");
      const edInfo = document.querySelector("#edInfo");

      edName.value = book.name;
      edURL.value = book.link;
      edInfo.value = book.description;

      selectTags.querySelectorAll('input[type="checkbox"]').forEach((chk) => {
        const label = chk.nextElementSibling;
        const tagText = label.textContent;

        const isChecked = book.tags.includes(tagText);
        chk.checked = isChecked;

        label.classList.toggle("checked-tag", chk.checked);
      });

      const actualIndexInDB = bookmarkDB.indexOf(book);
      if (actualIndexInDB !== -1) {
        btnSubmitForm.dataset.editIndex = actualIndexInDB;
      }
    });
    // body card-bookmerk

    const bodyCardBookmark = document.createElement("div");
    bodyCardBookmark.classList.add("body-card-bookmark");

    const descriptionCard = document.createElement("p");
    descriptionCard.classList.add("description-card");
    descriptionCard.textContent = book.description;

    const tagsBodyContainer = document.createElement("div");
    tagsBodyContainer.classList.add("tags-body-container");

    book.tags.forEach((tagsbook) => {
      const tagSpan = document.createElement("span");
      tagSpan.classList.add("tag-span");
      tagSpan.textContent = tagsbook;

      tagsBodyContainer.append(tagSpan);
    });

    bodyCardBookmark.append(descriptionCard, tagsBodyContainer);

    // footer card

    const footerCard = document.createElement("div");
    footerCard.classList.add("footer-card");

    const archivePin = document.createElement("span");
    archivePin.classList.add("archive-pin");
    archivePin.innerHTML = `<ion-icon name="pin-outline"></ion-icon>`;
    if (book.archived === true) {
      archivePin.classList.add("marc");
      cardBookmark.classList.add("archived-card", book.archived);
    } else {
      archivePin.classList.remove("marc");
      cardBookmark.classList.remove("archived-card", book.archived);
    }
    // btn archived
    archivePin.addEventListener("click", () => {
      book.archived = !book.archived;

      archivePin.classList.toggle("marc", book.archived);
      cardBookmark.classList.toggle("archived-card", book.archived);
    });

    footerCard.append(archivePin);

    cardBookmark.append(headerCard, bodyCardBookmark, footerCard);
    bookmarkContainer.append(cardBookmark);
  });
};
const tagsRender = (div) => {
  tagsList.forEach((tagItem) => {
    const tagDiv = document.createElement("div");
    tagDiv.classList.add("tag");

    const chkTags = document.createElement("input");
    chkTags.type = "checkbox";
    chkTags.id = `chk-${tagItem}`;
    chkTags.name = `chk-${tagItem}`;

    const labelTag = document.createElement("label");
    labelTag.htmlFor = chkTags.id;
    labelTag.textContent = tagItem;

    const spanTag = document.createElement("span");
    spanTag.classList.add("number-tag-items");
    spanTag.textContent = bookmarkDB.filter((b) =>
      b.tags.includes(tagItem)
    ).length;

    tagDiv.append(chkTags, labelTag, spanTag);

    div.append(tagDiv);
  });
};

document.addEventListener("DOMContentLoaded", () => {
  // tags chk from aside
  tagsRender(tagsContainer);

  selectTagsRender(selectTags);
  // card-bookmarker
  renderCards();

  sortBy.addEventListener("click", () => {
    bookmarkDB.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase())
        return sortAscending ? -1 : 1;
      if (a.name.toLowerCase() > b.name.toLowerCase())
        return sortAscending ? 1 : -1;

      return 0;
    });
    sortAscending = !sortAscending;
    renderCards();
  });
});

tagsContainer.addEventListener("change", () => {
  const checkedTags = Array.from(
    tagsContainer.querySelectorAll('input[type="checkbox"]:checked')
  ).map((chk) => chk.nextElementSibling.textContent);

  const allCards = bookmarkContainer.querySelectorAll(".card-bookmark");

  allCards.forEach((card) => {
    const cardTags = Array.from(card.querySelectorAll(".tag-span")).map(
      (tag) => tag.textContent
    );

    const match =
      checkedTags.length === 0 ||
      checkedTags.some((tag) => cardTags.includes(tag));

    card.style.display = match ? "flex" : "none";
  });
});

btnArchives.addEventListener("click", (ev) => {
  const cards = document.querySelectorAll(".card-bookmark");

  cards.forEach((card, indexDB) => {
    const book = bookmarkDB[indexDB];

    card.style.display = book.archived ? "flex" : "none";
  });
});

btnHome.addEventListener("click", (ev) => {
  const cards = document.querySelectorAll(".card-bookmark");
  cards.forEach((card) => (card.style.display = "flex"));
});

btnSearch.addEventListener("click", (eve) => {
  eve.preventDefault();
  searchBookmark();
});

const searchBookmark = () => {
  const searchTerms = edSearch.value.trim().toLowerCase();

  if (searchTerms === "") {
    renderCards();
    return;
  }

  const dbFiltered = bookmarkDB.filter((book) => {
    return book.name.toLowerCase().includes(searchTerms);
  });

  renderCards(dbFiltered);
};

edSearch.addEventListener("keyup", (ev) => {
  if (ev.key === "Enter") searchBookmark();
});

// functions - modal open and close

modalOpenBtn.addEventListener("click", (ev) => {
  ev.preventDefault();

  overlay.classList.add("dark");
  modal.classList.add("active");
});

modalCloseBtn.addEventListener("click", (ev) => {
  ev.preventDefault();

  overlay.classList.remove("dark");
  modal.classList.remove("active");
});

overlay.addEventListener("click", () => {
  modal.classList.remove("active");
  overlay.classList.remove("dark");
});
//
// modal form
const selectTagsRender = (div) => {
  tagsList.forEach((tagItem) => {
    const tagSelect = document.createElement("div");
    tagSelect.classList.add("tag");

    const chkTagsSelect = document.createElement("input");
    chkTagsSelect.type = "checkbox";
    chkTagsSelect.id = `chk-${tagItem}-select`;
    chkTagsSelect.name = `chk-${tagItem}-select`;

    const labelTagSelect = document.createElement("label");
    labelTagSelect.htmlFor = chkTagsSelect.id;
    labelTagSelect.textContent = tagItem;

    chkTagsSelect.addEventListener("change", () => {
      labelTagSelect.classList.toggle("checked-tag", chkTagsSelect.checked);
    });

    tagSelect.append(chkTagsSelect, labelTagSelect);

    div.append(tagSelect);
  });
};

selectTags.addEventListener("click", () => {
  selectTags.classList.add("expand");
});
document.addEventListener("click", (ev) => {
  if (!selectTags.contains(ev.target)) {
    selectTags.classList.remove("expand");
  }

  document.querySelectorAll(".div-opt-menu.show").forEach((m) => {
    if (!m.contains(ev.target)) m.classList.remove("show");
  });
});

btnSubmitForm.addEventListener("click", (ev) => {
  ev.preventDefault();
  const edName = document.querySelector("#edName");
  const edURL = document.querySelector("#edURL");
  const edInfo = document.querySelector("#edInfo");
  const tagSelected = Array.from(
    selectTags.querySelectorAll('input[type="checkbox"]:checked')
  ).map((chk) => chk.nextElementSibling.textContent);

  const editIndex = btnSubmitForm.dataset.editIndex;
  try {
    const name = edName.value.trim();
    const url = edURL.value.trim();
    const info = edInfo.value.trim();

    if (!name || !url || !info || tagSelected.length === 0) {
      throw new Error("Dados vazios!!");
    }
    if (editIndex !== undefined && editIndex !== "") {
      // update
      const book = bookmarkDB[editIndex];

      book.name = name;
      book.link = url;
      book.description = info;
      book.tags = tagSelected;

      delete btnSubmitForm.dataset.editIndex;
    } else {
      bookmarkDB.push({
        name: name,
        link: url,
        description: info,
        tags: tagSelected,
        archived: false,
      });
    }

    localStorage.setItem("bookmarkDB", JSON.stringify(bookmarkDB));

    renderCards();

    tagsContainer.innerHTML = "";
    tagsRender(tagsContainer);
  } catch (error) {
    alert(error.message);
  }

  edName.value = "";
  edURL.value = "";
  edInfo.value = "";

  selectTags.querySelectorAll(".tag").forEach((tagDiv) => {
    // Agora 'tagDiv' está definida e representa cada div com a classe 'tag'
    const chk = tagDiv.querySelector('input[type="checkbox"]');
    const label = tagDiv.querySelector("label");

    if (chk) chk.checked = false;
    if (label) label.classList.remove("checked-tag"); // Limpa a classe visual
  });
});

// menu aside (max-width: 1024px)
const lateralMenu = document.querySelector("#lateral-menu");

btnAsideShow.addEventListener("click", () => {
  lateralMenu.classList.toggle("show-aside");
});
const btnCloseAside = document
  .querySelector(".btn-aside-close")
  .addEventListener("click", () => {
    lateralMenu.classList.remove("show-aside");
  });
