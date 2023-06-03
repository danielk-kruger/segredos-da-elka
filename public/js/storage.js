export class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }

  static saveCurrentTab(tab) {
    localStorage.setItem("currentTab", JSON.stringify(tab));
  }

  static getCurrentTab() {
    return localStorage.getItem("currentTab")
      ? JSON.parse(localStorage.getItem("currentTab"))
      : "all";
  }
}
