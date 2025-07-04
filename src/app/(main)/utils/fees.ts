export const getCreateProductFee = (price: number, quantity: number) => {
  return 0.04 * (price * quantity);
};

export const getUpdateProductFee = (
  oldPrice: number,
  oldQuantity: number,
  newPrice: number,
  newQuantity: number
) => {
  const oldTotalValue = oldPrice * oldQuantity;
  const newTotalValue = newPrice * newQuantity;
  const addedValue = Math.max(0, newTotalValue - oldTotalValue);

  return 0.04 * addedValue;
};
