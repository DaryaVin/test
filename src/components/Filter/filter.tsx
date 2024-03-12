import React, { useContext, useLayoutEffect, useState } from "react";
import "./filter.scss";
import { FilterContext } from "../App/App.tsx";
import { productAPI } from "../../API/productsAPI.ts";
import { FilterFieldForBrand } from "../FilterFieldForBrand/filterFieldForBrand.tsx";
import { FilterFieldForPrice } from "../FilterFieldForPrice/filterFieldForPrice.tsx";
import { FilterFieldForStrSearch } from "../FilterFieldForStrSearch/filterFieldForStrSearch.tsx";

interface FilterProps extends React.HTMLAttributes<HTMLDivElement>{
}
export const Filter = ({...props}: FilterProps) => {
  // const [brandsList, setBrandsList] = useState<(string | null)[]>([]);
  // const {state, dispatch} = useContext(FilterContext);


  // const getBrandsList = async () => { 
  //   const newBrandsList = await productAPI.getFields({ "field": "brand" }) as (string | null)[];
  //   setBrandsList(newBrandsList);
  //  }
  // useLayoutEffect(() => { 
  //   getBrandsList();
  //  }, [])


  return (
    <div {...props} className={"filter " + (props.className || "")}>
      <FilterFieldForStrSearch className="filter__StrSearch"></FilterFieldForStrSearch>
      <FilterFieldForBrand className="filter__brand"></FilterFieldForBrand>
      <FilterFieldForPrice className="filter__price"></FilterFieldForPrice>
    </div>
  )
}
