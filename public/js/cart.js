"use strict";

import {
  cartItemComponent,
  productComponent,
  modalComponent,
} from "./components.js";
import { Storage } from "./storage.js";
import { localePtBr } from "./locale-pt.js";

import {
  cartBtn,
  gallery,
  closeCartBtn,
  overlay,
  cartSideBar,
  clearCartBtn,
  cartTotal,
  cartItems,
  cartContent,
  sideBarFooter,
  orderBtn,
  finalize,
  tabs,
  userNameElem,
  dateElem,
  cellNumberElem,
  cellNumberError,
  sucessModal,
} from "./selectors.js";
import { sendOrder, getProduct } from "./api.js";

window.addEventListener("scroll", () => {
  const nav = document.querySelector(".nav");
  const { offsetTop, offsetHeight } = nav;

  window.scrollY > offsetTop + offsetHeight
    ? nav.classList.add("sticky")
    : nav.classList.remove("sticky");
});

// Cart Items
let cart = [];
let buttonsDom = [];
let currentTab = document.querySelector(
  `[data-category="${Storage.getCurrentTab()}"]`
);
currentTab.classList.add("active");

// TODO use api to fetch product data

class UI {
  products = [];
  total = 0;
  containsErrors = true;

  constructor() {
    this.setupApp();
  }

  setupApp() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    this.cartLogic();
    this.initDatePicker();
    this.updateCategories();
    this.getOrderButtons();

    cartBtn.addEventListener("click", () => {
      this.checkCart();
      this.showCart();
    });
    closeCartBtn.addEventListener("click", this.hideCart);
  }

  checkCart() {
    const isEmpty = cart.length === 0;
    sideBarFooter.classList.toggle("empty", isEmpty);
    cartContent.classList.toggle("empty-content", isEmpty);
    document.getElementById("empty-msg").classList.toggle("false", isEmpty);
  }

  displayProducts() {
    let components = "";
    this.products.forEach((prod) => (components += productComponent(prod)));
    gallery.innerHTML = components;
  }

  updateCategories() {
    const handleTabClick = (event) => {
      event.preventDefault();

      currentTab.classList.remove("active");
      Storage.saveCurrentTab(event.target.dataset.category);

      window.location.href = `/${event.target.dataset.category}`;
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", handleTabClick.bind(this));
    });
  }

  getOrderButtons() {
    buttonsDom = [...document.querySelectorAll(".checkout")];
    // buttonsDom = btns;

    buttonsDom.forEach((btn) => {
      const { id } = btn.dataset;
      const inCart = cart.find((item) => item.id === id);

      if (inCart) {
        btn.innerText = "In Cart";
        btn.disabled = true;
      }

      btn.addEventListener("click", async (e) => {
        e.target.innerText = "In Cart";
        e.target.disabled = true;

        const { data } = await getProduct(id);
        const cartItem = { ...data[0], amount: 1 };
        cart = [...cart, cartItem];
        console.log(cart);

        Storage.saveCart(cart);
        this.setCartValues(cart);
        this.addCartItem(cartItem);
        this.showCart();
      });
    });
  }

  initDatePicker() {
    new AirDatepicker("#date", {
      inline: false,
      isMobile: true,
      autoClose: true,
      timepicker: true,
      timeFormat: "HH:mm",
      locale: localePtBr,
    });
  }

  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");

    div.innerHTML = cartItemComponent(item);

    cartContent.appendChild(div);
    this.checkCart();
  }

  cartLogic() {
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    // cart functionality
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove")) {
        let removeItem = event.target;
        let { id } = removeItem.dataset;
        cartContent.removeChild(removeItem.parentElement);
        this.removeItem(id);
        return;
      }

      let value = event.target;
      const { id } = value.dataset;
      let tempItem = cart.find((item) => item.id === id);
      const valInc = value.classList.contains("fa-chevron-up");

      tempItem.amount += valInc ? 1 : -1;
      if (valInc) value.nextElementSibling.innerText = tempItem.amount;
      else value.previousElementSibling.innerText = tempItem.amount;

      Storage.saveCart(cart);
      this.setCartValues(cart);
      this.checkCart();
    });
  }

  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));

    while (cartContent.children.length > 1)
      cartContent.removeChild(cartContent.children[1]);

    this.checkCart();
    this.hideCart();
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    console.log(button);
    button.disabled = false;
    button.innerHTML = `Order <i class="fas fa-shopping-cart"></i>`;
    this.checkCart();
  }

  getSingleButton(id) {
    return buttonsDom.find((button) => button.dataset.id === id);
  }

  populateCart(cart) {
    cart.forEach((item) => item && this.addCartItem(item));
  }

  setCartValues(cart) {
    const tempTotal = cart.reduce(
      (total, item) => total + item.price * item.amount,
      0
    );
    const itemsTotal = cart.reduce((total, item) => total + item.amount, 0);

    this.total = Number(tempTotal.toFixed(2));
    cartTotal.innerText = Number(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  openDialogue() {
    const modal = document.querySelector(".modal");
    const modalClose = document.querySelector(".close");

    sideBarFooter.classList.add("order-ready");
    modal.classList.remove("hidden");
    modalClose.classList.remove("hidden");
    orderBtn.classList.add("clicked");
    finalize.classList.add("clicked");
    cartSideBar.style.overflowY = "hidden";

    modalClose.addEventListener("click", handleCloseModal);

    function handleCloseModal() {
      sideBarFooter.classList.remove("order-ready");
      modal.classList.add("hidden");
      modalClose.classList.add("hidden");
      finalize.classList.remove("clicked");
      orderBtn.classList.remove("clicked");
      cartSideBar.style.overflowY = "scroll";

      modalClose.removeEventListener("click", handleCloseModal);
    }

    cellNumberElem.addEventListener("input", () => this.handleNumberChange());
    return this;
  }

  parseDialogue() {
    const totalPrice = Number(cartTotal.innerText);

    const cartItems = cart.map(({ title, price, amount, category, image }) => {
      return {
        title: title,
        category,
        quantity: amount,
        price,
        subTotal: price * amount,
        image,
      };
    });
    console.log(cartItems);

    // TODO add phone number data
    return {
      fullName: userNameElem.value,
      phoneNumber: cellNumberElem.value,
      pickupDate: new Date(dateElem.value),
      cartItems,
      totalPrice,
    };
  }

  handleNumberChange() {
    const validateNumber = (cell) => {
      const regex = /^(?:\+?(258))?0?(?:8[2345679]|9[1235678])[0-9]{7}$/;
      const cleanedNumber = formatCellNumber(cell);

      return regex.test(cleanedNumber);
    };

    const formatCellNumber = (cell) => {
      const countryCode = "+258";

      return cell.includes(countryCode) ? cell : countryCode + cell;
    };

    const showCellNumberError = (isValid) => {
      if (!isValid) cellNumberError.classList.add("hasError");
      else cellNumberError.classList.remove("hasError");
    };

    const isValid = validateNumber(cellNumberElem.value);

    this.containsErrors = !isValid;
    this.checkErrors();

    cellNumberElem.addEventListener("blur", () => showCellNumberError(isValid));
    cellNumberElem.addEventListener("focus", () => {
      if (cellNumberError.classList.contains("hasError"))
        cellNumberError.classList.remove("hasError");
    });
  }

  onSucessfulOrderInteraction(orderData) {
    sucessModal.innerHTML = modalComponent(orderData);
  }

  checkErrors() {
    if (this.containsErrors) finalize.disabled = true;
    else finalize.disabled = false;
  }

  setTotal(total) {
    this.total = total;
  }

  getTotal() {
    return this.total;
  }

  hideCart() {
    overlay.classList.remove("show");
    cartSideBar.classList.remove("visible-cart");
    document.body.style.overflow = "auto";
  }

  showCart() {
    overlay.classList.add("show");
    cartSideBar.classList.add("visible-cart");
    document.body.style.overflow = "hidden";
  }
}

// ? Should I move the small script stuff to a separate file
document.addEventListener("DOMContentLoaded", () => {
  const uiManager = new UI();

  orderBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (cart.length < 1) return;

    const dialogue = uiManager.openDialogue();

    finalize.addEventListener("click", async (e) => {
      e.preventDefault();

      const user = dialogue.parseDialogue();
      await sendOrder(user).then((data) => {
        dialogue.onSucessfulOrderInteraction(data, user);
      });
    });
  });
});
