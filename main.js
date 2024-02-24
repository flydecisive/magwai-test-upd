import "./styles/style.scss";

const API_URL = "https://jsonplaceholder.typicode.com";

let burgerClickState = false;
const phoneRegex = /[^0-9+]/;
const nameRegex = /[^а-яА-Яa-zA-Z ']/;
const textRegex = /[^а-яА-Яa-zA-Z0-9 '.,-]/;
const inputsErrorState = {
  name: false,
  phone: false,
  text: false,
};
const inputsValueState = {
  name: "",
  phone: "",
  text: "",
};
const imagesSrc = {
  0: "cards/1.png",
  1: "cards/2.png",
  2: "cards/3.png",
  3: "cards/4.png",
  4: "cards/5.png",
  5: "cards/6.png",
  6: "cards/7.png",
  7: "cards/8.png",
  8: "cards/9.png",
  9: "cards/10.png",
};

const cardLabelsData = {
  0: "water",
  1: "bridge",
  2: "nature",
  3: "forest",
};

const confirmMessageTemplate = `
    <div class="confirm-message">
        <p class='confirm-message__text'>Заявка отправлена</p>
        <div class='confirm-message__icon'>
            <img src="confirm.svg" alt="confirm" />
        </div>
    </div>
`;

const errorMessageTemplate = `
  <p class="error-message">Не удалось загрузить данные. Попробуйте позже.</p>
`;

const modalTemplate = `
    <h3 class="application-modal__title">Оставить заявку</h3>
    <div class="application-modal__cross">
        <img class="application-modal__img" src="cross.svg" alt="cross" />
    </div>

    <input
        type="text"
        class="application-modal__input input-name"
        placeholder="Введите имя"
    />
    <input
        type="text"
        class="application-modal__input input-phone"
        placeholder="Введите телефон"
    />
    <textarea
        class="application-modal__textarea"
        name=""
        id=""
        cols="30"
        rows="10"
        placeholder="Введите сообщение"
    ></textarea>

    <div class="application-modal__buttons">
        <button class="button button-modal">
            <span class="button__content">Оставить заявку</span>
        </button>
        <button class="button button-cancel">отменить</button>
    </div>  
`;

document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".burger");
  const buttons = document.querySelector(".header__buttons");
  const nav = document.querySelector(".nav");
  const header = document.querySelector(".header");
  const scroll = document.querySelector(".scroll");
  const appButtons = document.querySelectorAll(".button-app");
  const modal = document.querySelector(".application-modal");
  const overlay = document.querySelector(".overlay");
  const phoneButton = document.querySelector(".button-phone");
  const cardsWrapper = document.querySelector(".main__wrapper");
  const downloadButton = document.querySelector(".button-download");
  const loader = document.querySelector(".loader");

  modal.innerHTML = modalTemplate;

  const nameInput = modal.querySelector(".input-name");
  const phoneInput = modal.querySelector(".input-phone");
  const modalTextarea = modal.querySelector(".application-modal__textarea");
  const modalButton = modal.querySelector(".button-modal");

  getPosts();

  const inputsForClear = [nameInput, phoneInput, modalTextarea];

  modal.addEventListener("click", (e) => {
    const target = e.target;

    if (
      target.classList.contains("button-modal") ||
      target.parentElement.classList.contains("button-modal")
    ) {
      handleModalButton();
    } else if (
      target.classList.contains("application-modal__cross") ||
      target.parentElement.classList.contains("application-modal__cross")
    ) {
      handleCrossButton();
    } else if (target.classList.contains("button-cancel")) {
      handleModalCancelButton();
    }
  });

  modal.addEventListener("input", (e) => {
    const target = e.target;

    if (target.classList.contains("input-name")) {
      handleNameInput(target);
    } else if (target.classList.contains("input-phone")) {
      handlePhoneInput(target);
    } else if (target.classList.contains("application-modal__textarea")) {
      handleTextarea(target);
    }

    if (
      !inputsErrorState.name ||
      !inputsErrorState.phone ||
      !inputsErrorState.text ||
      inputsValueState.name === "" ||
      inputsValueState.phone === "" ||
      inputsValueState.text === ""
    ) {
      modalButton.setAttribute("style", "display: none");
    } else {
      modalButton.setAttribute("style", "display: block");
    }
  });

  phoneButton.addEventListener("click", () => {
    window.open("tel: 88003003333", "_blank");
  });

  appButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modal.setAttribute("style", "display: flex;");
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      overlay.setAttribute("style", "display: block;");
    });
  });

  burger.addEventListener("click", () => {
    const screenWidth = window.innerWidth;
    burgerClickState = !burgerClickState;

    if (burgerClickState && screenWidth <= 768 && screenWidth > 425) {
      nav.setAttribute("style", "display: block;");
      header.setAttribute(
        "style",
        "position: fixed; top: 0;left: 0; height: 100dvh; align-items: start; padding-bottom: 387px; overflow: auto;"
      );
    } else if (burgerClickState && screenWidth <= 425) {
      nav.setAttribute("style", "display: block;");
      buttons.setAttribute("style", "display: flex;");
      header.setAttribute(
        "style",
        "position: fixed; top: 0; left: 0; height: 100dvh; align-items: start; padding-bottom: 21px; overflow: auto;"
      );
      burger.setAttribute("style", "justify-self: start;");
    } else if (!burgerClickState && screenWidth <= 425) {
      nav.setAttribute("style", "display: none");
      buttons.setAttribute("style", "display: none");
      header.setAttribute(
        "style",
        "position: unset; top: 0;left: 0; width: 100%; height: auto"
      );
    } else {
      nav.setAttribute("style", "display: none");
      header.setAttribute(
        "style",
        "position: unset; top: 0;left: 0; width: 100%; height: auto"
      );
    }
  });

  window.addEventListener("scroll", function () {
    const scrollTop = window.scrollY;
    const docHeight = document.body.offsetHeight;
    const winHeight = window.innerHeight;
    const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;

    scrollPercent > 10
      ? scroll.setAttribute("style", "display: block;")
      : scroll.setAttribute("style", "display: none;");
  });

  scroll.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  downloadButton.addEventListener("click", getPosts);

  function handleModalButton() {
    clearModalInputs(inputsForClear);
    modal.innerHTML = confirmMessageTemplate;
    const timeoutId = setTimeout(() => {
      modal.setAttribute("style", "display: none;");
      overlay.setAttribute("style", "display: none;");
      clearTimeout(timeoutId);
      modal.innerHTML = modalTemplate;
    }, 1500);
  }

  function handleCrossButton() {
    modal.setAttribute("style", "display: none;");
    overlay.setAttribute("style", "display: none;");
    clearModalInputs(inputsForClear);
  }

  function handleModalCancelButton() {
    modal.setAttribute("style", "display: none;");
    overlay.setAttribute("style", "display: none;");
    clearModalInputs(inputsForClear);
  }

  function handleNameInput(target) {
    const value = target.value;
    const isValueCorrect = nameRegex.test(value);
    inputsErrorState.name = !isValueCorrect;
    inputsValueState.name = value;

    if (isValueCorrect) {
      target.setAttribute("style", "border: 1px solid red");
    } else {
      target.removeAttribute("style");
    }
  }

  function handlePhoneInput(target) {
    const value = target.value;
    const isValueCorrect = phoneRegex.test(value);
    inputsErrorState.phone = !isValueCorrect;
    inputsValueState.phone = value;

    if (isValueCorrect) {
      target.setAttribute("style", "border: 1px solid red");
    } else {
      target.removeAttribute("style");
    }
  }

  function handleTextarea(target) {
    const value = target.value;
    const isValueCorrect = textRegex.test(value);
    inputsErrorState.text = !isValueCorrect;
    inputsValueState.text = value;

    if (isValueCorrect) {
      target.setAttribute("style", "border: 1px solid red");
    } else {
      target.removeAttribute("style");
    }
  }

  function getPosts() {
    cardsWrapper.setAttribute("style", "display: none;");
    loader.setAttribute("style", "display: block");

    fetch(`${API_URL}/posts`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка загрузки постов");
        }

        return response.json();
      })
      .catch((error) => {
        console.log(error.message);
        cardsWrapper.innerHTML = errorMessageTemplate;
        cardsWrapper.setAttribute("style", "display: flex; margin-bottom: 0;");
        downloadButton.setAttribute("style", "display: none;");
      })
      .then((responseData) => {
        cardsWrapper.removeAttribute("style");
        loader.setAttribute("style", "display: none");
        renderCards(responseData);
      });
  }

  function renderCards(cardsData) {
    const maxCount = 30;
    const cardsCount = cardsWrapper.childElementCount;
    if (cardsCount < maxCount) {
      let counter = cardsCount + 5;
      const cards = [];
      for (let i = 0; i < counter; i++) {
        let randomSrcIndex = Math.floor(Math.random() * 10);
        let randomLabelIndex = Math.floor(Math.random() * 4);
        cards.push(
          `<div class="card">
            <img src="${imagesSrc[randomSrcIndex]}" alt="card img" class="card__img" />
            <div class="card__content">
              <h3 class="card__label">${cardLabelsData[randomLabelIndex]}</h3>
              <h2 class="card__title">
                ${cardsData[i].title}
              </h2>
              <p class="card__text">
                ${cardsData[i].body}
              </p>
              <p class="card__info">
                Posted by <span class="card__info-span">Eugenia</span>, on July
                24, 2019
              </p>
              <button class="card__button">Continue reading</button>
            </div>
          </div>`
        );
      }

      cardsWrapper.innerHTML = cards.join("");
    } else {
      downloadButton.setAttribute("style", "display: none");
      cardsWrapper.setAttribute("style", "margin-bottom: 0;");
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }
});

function clearModalInputs(inputsArr) {
  for (let input of inputsArr) {
    input.value = "";
  }

  for (let value in inputsValueState) {
    inputsValueState[value] = "";
  }
}
