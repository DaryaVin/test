import React, { useContext, useEffect, useState } from "react";
import "./productContainer.scss";
import { idsList, productItem } from "../../types/productsType";
import { FilterContext, FilterFieldStateType } from "../App/App.tsx";
import { productAPI } from "../../API/productsAPI.ts";
import { Pagination } from "../UI/Pagination/pagination.tsx";
import { ProductList } from "../ProductList/productList.tsx";


const getFullFilterIdsList = async (FilterFieldState: FilterFieldStateType) => {
  const isNeedFilterByBrand = (FilterFieldState.brand !== "");
  const isNeedFilterByPrice = FilterFieldState.price !== null;
  const isNeedFilterByStrForSearch = FilterFieldState.strForsearch !== '';

  if (!isNeedFilterByBrand
    && !isNeedFilterByPrice
    && !isNeedFilterByStrForSearch
  ) return await productAPI.getIds();

  const idsListWithStrForSearchFilter = isNeedFilterByStrForSearch
    ? await productAPI.filter({ "product": FilterFieldState.strForsearch })
    : [];

  const idsListWithBrandFilter = isNeedFilterByBrand
    ? await productAPI.filter({ "brand": FilterFieldState.brand })
    : [];

  const idsListWithPriceFilter = isNeedFilterByPrice
    ? await productAPI.filter({ "price": FilterFieldState.price })
    : [];

  const allIdsListWithFilter = [...new Set([
    ...idsListWithStrForSearchFilter,
    ...idsListWithBrandFilter,
    ...idsListWithPriceFilter
  ])];

  return allIdsListWithFilter.filter((id) => {
    return (idsListWithStrForSearchFilter.includes(id) || !isNeedFilterByStrForSearch)
      && (idsListWithBrandFilter.includes(id) || !isNeedFilterByBrand)
      && (idsListWithPriceFilter.includes(id) || !isNeedFilterByPrice);
  });
}

const getPageProducts = async (idsList: idsList, currentPage: number, pageSize: number,) => {
  const countPage = Math.ceil(idsList.length / pageSize);

  const indexStartId = (currentPage - 1) * pageSize;
  const indexEndId = countPage === currentPage ? idsList.length : indexStartId + pageSize;

  const idsListForGetPageProduct = idsList.slice(indexStartId, indexEndId);
  return await productAPI.getItems({ "ids": idsListForGetPageProduct });
}

interface ProductContainerProps extends React.HTMLAttributes<HTMLDivElement> {
}
export const ProductContainer = ({ ...props }: ProductContainerProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [productList, setProductList] = useState<productItem[]>([]);
  const [idsList, setIdsList] = useState<idsList>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { state: filterState } = useContext(FilterContext);

  const onChangeFilterState = async (filterState: FilterFieldStateType) => {
    await setIsLoading(true);
    const newIdsList = await getFullFilterIdsList(filterState);
    await setIdsList(newIdsList);
  }
  const onChangeProductList = async (idsList: idsList, currentPage: number, pageSize: number,) => {
    await setIsLoading(true);
    const newProductList = await getPageProducts(idsList, currentPage, pageSize);
    await setProductList(newProductList === null ? [] : newProductList);
    await setIsLoading(false);
  }

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    timer = setTimeout(() => {
      onChangeFilterState(filterState);
    }, 1000);
    return () => {
      clearTimeout(timer);
    }
  }, [filterState.brand, filterState.price, filterState.strForsearch]);

  useEffect(() => {
    onChangeProductList(idsList, currentPage, 50);
  }, [currentPage, idsList]);

  return (
    <div {...props} className={"productContainer " + (props.className || "")}>
      {
        isLoading
          ? "Идет загрузка, подождите ..."
          : idsList.length === 0
            ? "Ничего не найдено"
            : <>
              <ProductList productList={productList} />
              <Pagination
                totalCount={idsList.length}
                onPageChange={setCurrentPage}
                pageSize={50}
                currentPage={currentPage}
                disabled={isLoading}
              />
            </>

      }
    </div>
  )
}
