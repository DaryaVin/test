export interface productItem {
  brand: string | null,
  id: string,
  price: number,
  product: string,
}

export type idsList = string[];
export type productsList = productItem[] | null;
export type fieldsList = string[];
export type fieldValuesList = (string | null | number)[];