import { Md5 } from "ts-md5";
import { fieldValuesList, fieldsList, idsList, productsList } from "../types/productsType";

// type idsList = string[];
// type productsList = productItem[] | null;
// type fieldsList = string[];
// type fieldValuesList = (string | null | number)[];

interface getIdsParams {
    "offset": number,
    "limit": number,
}
interface getItemsParams {
    "ids": idsList;
}
interface getFieldsParams {
    "field": string,
    "offset"?: number,
    "limit"?: number,
}
interface filterParams {
    [prop: string]: string | number | null,
}

type fetchProductAPIType = {
  (action: "get_ids",  params? : getIdsParams): Promise<any>,
  (action: "get_items",  params? : getItemsParams): Promise<any>,
  (action: "get_fields",  params? : getFieldsParams): Promise<any>,
  (action: "filter",  params : filterParams): Promise<any>,
}

const fetchProductAPI: fetchProductAPIType = async function fetchFunc(
  action: "get_ids" | "get_items" | "get_fields" | "filter",
  params? : getIdsParams | getItemsParams | getFieldsParams | filterParams
  ) {
  const now = new Date;
  const xAuthStr = Md5.hashStr("Valantis_"
    + now.getUTCFullYear()
    + ("0" + (now.getUTCMonth() + 1)).slice(-2)
    + ("0" + now.getUTCDate()).slice(-2)
  );

  let response = await fetch("http://api.valantis.store:40000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
      "X-Auth": xAuthStr,
    },
    body: JSON.stringify({
      "action": action,
      "params": params
    }),
  })

  if (response.ok) {
    let json = await response.json();
    return json.result;
  } else {
    console.log("Ошибка получения данных с API: " + response.status);
    return fetchFunc(action, params);
    // throw new Error("Ошибка получения данных с API");
  }
}

export const productAPI = {
  getIds: async(params?: getIdsParams) => {
    let idsList = await fetchProductAPI("get_ids", params) as idsList;
    return [...new Set(idsList)];
  },

  getItems: async(params?: getItemsParams) => {
    let productsList = await fetchProductAPI("get_items", params) as productsList;
    if (productsList !== null) {
      let idsList: idsList = [];
      let newProductsList: productsList = [];

      for (const product of productsList) {
        if (!idsList.includes(product.id)) {
          idsList.push(product.id);
          newProductsList.push(product);
        }
      }
  
      return newProductsList;
    }
    return productsList;
  },

  getFields: async(params?: getFieldsParams) => {
    let fieldsList = await fetchProductAPI('get_fields', params);

    if (params === undefined) return fieldsList as fieldsList;
    const newProductsList = [...new Set(fieldsList)];
    return newProductsList as fieldValuesList;
  },

  filter: async(params: filterParams) => {
    let filterIdsList = await fetchProductAPI("filter", params) as idsList;
    return [...new Set(filterIdsList)];
  },
}