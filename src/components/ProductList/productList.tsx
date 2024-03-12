import React from "react";
import "./productList.scss";
import { productsList } from "../../types/productsType";
import { ProductItem } from "../ProductItem/productItem.tsx";

interface ProductListProps extends  React.HTMLAttributes<HTMLDivElement>{
  productList: productsList,
  className?: string,
}
export const ProductList = ({productList, className, ...props }: ProductListProps) => {

  return (
    <ul className="productList">
      {productList?.map((product) => { 
        return <li key={product.id}>
          <ProductItem  productItem={product}/>
        </li>
       })}
    </ul>
  )
}
