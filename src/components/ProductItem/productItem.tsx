import React from "react";
import "./productItem.scss";
import { Card } from "../UI/Card/card.tsx";
import { productItem } from "../../types/productsType";

interface ProductItemProps extends React.HTMLAttributes<HTMLDivElement> {
  productItem: productItem,
  className?: string,
}
export const ProductItem = ({productItem, className, ...props }: ProductItemProps) => {

  const template = (label: string, value: string) => { 
    return <div className="productItem__property">
      <span className="productItem__labelProperty">{label + ":"}</span>
      <span className="productItem__valueProperty">{value}</span>
    </div>
   }

  return (
    <Card className="productItem">
      {template("ID", productItem.id)}
      {template("Название", productItem.product)}
      {template("Бренд", productItem.brand === null ? "без Бренда" : productItem.brand)}
      {template("Цена", productItem.price.toString())}
    </Card>
  )
}
