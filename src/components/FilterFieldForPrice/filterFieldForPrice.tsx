import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import "./filterFieldForPrice.scss";
import { FilterContext } from "../App/App.tsx";
import { FieldText } from "../UI/FieldText/FieldText.tsx";
import { ResetButton } from "../UI/ResetButton/resetButton.tsx";
import { Label } from "../UI/Label/label.tsx";

interface FilterFieldForPriceProps extends React.HTMLAttributes<HTMLInputElement> {
  className?: string,
}
export const FilterFieldForPrice = ({className, ...props }: FilterFieldForPriceProps) => {
  const { state: filterFieldsState, dispatch: filterFieldsDispatch } = useContext(FilterContext);
  const [price, setPrice] = useState<string>("");
  const [validatorMessage, setValidatorMessage] = useState<string>("");

  const onChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (/^[0-9.]+$/.test(e.target.value) || e.target.value === "") {
      const newPrice = e.target.value === "" ? null : +e.target.value;
      if (newPrice === null || newPrice > 0) {
        // setPrice(e.target.value);
        filterFieldsDispatch({
          type: "onChangePrice",
          payload: newPrice,
        })
      }
      if (newPrice !== null && newPrice < 0) setValidatorMessage("Цена должна быть больше 0");
    } else {
      setValidatorMessage("Цена должна быть числом");
    }

  }
  useEffect(() => {
    const newPriceStr = filterFieldsState.price === null ? "" : filterFieldsState.price.toString();
    setPrice(newPriceStr);
  }, [filterFieldsState.price]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (validatorMessage !== "") {
      timer = setTimeout(() => {
        setValidatorMessage("");
      }, 2000);
    }
    return () => {
      clearTimeout(timer);
    }
  }, [validatorMessage]);

  return (
    <Label className={"filterFieldForPrice" + (className ? " " + className : "")} label="Цена">
      <FieldText {...props}  onChange={onChangePrice} value={price} placeholder="Введите цену">
        <ResetButton onClick={() => filterFieldsDispatch({
            type: 'onChangePrice',
            payload: null,
          })}
          isShow={filterFieldsState.price !== null}
          className="filterFieldForPrice__resetBtn"
        />
      </FieldText>
      <div className="filterFieldForPrice__validatorMessage">{validatorMessage}</div>
    </Label>

  )
}
