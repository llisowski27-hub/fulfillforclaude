export type CartItem = {
  id: string;
  title: string;
  image: string | null;
  price: number;
  quantity: number;
  maxQuantity: number;
  slug: string | null;
};
