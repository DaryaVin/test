import React, { useContext, useLayoutEffect, useState } from "react";
import "./filterFieldForBrand.scss";
import { FilterContext } from "../App/App.tsx";
import { productAPI } from "../../API/productsAPI.ts";
import { Dropdown } from "../UI/Dropdown/dropdown.tsx";
import { RadioBox } from "../UI/RadioBox/radioBox.tsx";
import { ResetButton } from "../UI/ResetButton/resetButton.tsx";
import { Label } from "../UI/Label/label.tsx";

interface FilterFieldForBrandProps extends React.HTMLAttributes<HTMLInputElement> {
  className: string,
}
export const FilterFieldForBrand = ({ className, ...props }: FilterFieldForBrandProps) => {
  const [brandsList, setBrandsList] = useState<(string | null)[]>([]);
  const { state: filterFieldsState, dispatch: filterFieldsDispatch } = useContext(FilterContext);


  const getBrandsList = async () => {
    const newBrandsList = await productAPI.getFields({ "field": "brand" }) as (string | null)[];
    setBrandsList(newBrandsList);
  }
  useLayoutEffect(() => {
    getBrandsList();
  }, [])

  const onChangeBrand = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newBrand = e.target.value === "null" ? null : e.target.value;
    filterFieldsDispatch({
      type: "onChangeBrand",
      payload: newBrand,
    })
  }

  const buttonBlock = <>
    <div
      className={"filterFieldForBrand__currantValueStr"
        + (filterFieldsState.brand === "" ? " filterFieldForBrand__currantValueStr_empty" : "")
      }
    >
      {filterFieldsState.brand === ""
        ? "Выберете бренд"
        : filterFieldsState.brand === null
          ? "Товары, не имеющие бренд"
          : filterFieldsState.brand
      }
    </div>
    <ResetButton
      onClick={() => filterFieldsDispatch({
        type: "onChangeBrand",
        payload: "",
      })}
      className={"filterFieldForBrand__resetBtn"}
      isShow={filterFieldsState.brand !== ""}
    />
  </>

  const contenerBlock = <ul className="filterFieldForBrand__brandList">
    {brandsList.map((brand) => {
      return <li className="filterFieldForBrand__brandItem">
        <RadioBox
          key={brand}
          className="filterFieldForBrand__brandRadioItem"
          name="FilterFieldForBrand"
          value={brand === null ? "null" : brand}
          label={brand === null ? "Товары, не имеющие бренд" : brand}
          onChange={onChangeBrand}
          checked={filterFieldsState.brand === brand}
        />
      </li>
    })}
  </ul>
  return (
    <Label label="Бренд" className={"filterFieldForBrand" + (className ? " " + className : "")}>
      <Dropdown
        {...props}
        className={"filterFieldForBrand__dropdown"}
        buttonBlock={buttonBlock}
        contenerBlock={contenerBlock}
        hasDropButton
      />
    </Label>
  )
}
