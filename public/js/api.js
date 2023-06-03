export const sendOrder = async (userData) => {
  return await fetch("/products/cart/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((res) => res.json())
    .catch((error) => {
      console.error(error);
    });
};

export const getProduct = async (productId) => {
  return await fetch(`/api/select/${productId}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((error) => {
      console.log(error);
    });
};
