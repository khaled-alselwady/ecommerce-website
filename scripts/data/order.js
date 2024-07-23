export const orders = initializeOrders();

export function addOrder(order) {
  if (!order) {
    return;
  }

  orders.unshift(order);
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem("orders", JSON.stringify(orders));
}

function initializeOrders() {
  const storageOrders = localStorage.getItem("orders");

  return storageOrders ? JSON.parse(storageOrders) : [];
}
