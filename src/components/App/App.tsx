import React, { createContext, useEffect, useReducer, useState } from "react";
import "./App.scss";
import { productAPI } from "../../API/productsAPI.ts";
import { Filter } from "../Filter/filter.tsx";
import { ProductContainer } from "../ProductContainer/productContainer.tsx";



export interface FilterFieldStateType {
  brand: string | null,
  price: number | null,
  strForsearch: string,
}

interface onChangeBrandAction {
  type: "onChangeBrand",
  payload: string | null
}
interface onChangePriceAction {
  type: "onChangePrice",
  payload: number | null
}
interface onChangeSearchAction {
  type: "onChangeSearch",
  payload: string,
}

type ActionType = onChangeBrandAction | onChangePriceAction | onChangeSearchAction;

const initialState: FilterFieldStateType = {
  brand: "",
  price: null,
  strForsearch: "",
}

const reducer = (state: FilterFieldStateType, action: ActionType) => {
  switch (action.type) {
    case "onChangeBrand": return { ...state, brand: action.payload }
    case "onChangePrice": return { ...state, price: action.payload }
    case "onChangeSearch": return { ...state, strForsearch: action.payload }
    default: return state
  }
};

export const FilterContext = createContext<{ state: FilterFieldStateType, dispatch: React.Dispatch<ActionType> }>({
  state: initialState,
  dispatch: () => null,
});

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [filterShow, setFilterShow] = useState<boolean>(false);

  const getData = async () => {
    const allIds = await productAPI.getIds();
    const filter = await productAPI.filter({ "product": "" });
    const fieldsList = await productAPI.getFields();
    const pricesList = await productAPI.getFields({ "field": "price" });
    const brandsList = await productAPI.getFields({ "field": "brand" });
    const productsList = await productAPI.getFields({ "field": "product" });
    const newPriceList = [...new Set(pricesList)];
    const newBrandList = [...new Set(brandsList)];
    const newProductList = [...new Set(productsList)];

  }

  useEffect(() => {
    getData();
  }, [])

  return (
    <FilterContext.Provider value={{ state, dispatch }}>
      <div className="App">
        <div className="wrapApp">
          <h1>Тестовое задание для компании Валантис</h1>
          <Filter className={"wrapApp__filter" + (filterShow ? " wrapApp__filter_show" : "")} />
          <ProductContainer />
          <button
            type="button"
            className={"burgerButton" + (filterShow ? " burgerButton_show" : "")}
            onClick={() => { setFilterShow(!filterShow) }}
          >
            Открыть/скрыть фильтр
            <span></span>
          </button>
        </div>
      </div>
    </FilterContext.Provider>
  );
}

export default App;