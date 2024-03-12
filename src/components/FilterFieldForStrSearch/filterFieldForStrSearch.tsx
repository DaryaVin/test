import React, { useContext, useEffect, useState } from "react";
import "./filterFieldForStrSearch.scss";
import { FilterContext } from "../App/App.tsx";
import { FieldText } from "../UI/FieldText/FieldText.tsx";
import { ResetButton } from "../UI/ResetButton/resetButton.tsx";
import { Label } from "../UI/Label/label.tsx";

interface FilterFieldForStrSearchProps extends React.HTMLAttributes<HTMLInputElement> {
  className?: string
}
export const FilterFieldForStrSearch = ({ className, ...props }: FilterFieldForStrSearchProps) => {
  const { state: filterFieldsState, dispatch: filterFieldsDispatch } = useContext(FilterContext);
  const [strSearch, setStrSearch] = useState<string>("");

  const onChangeStrSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStrSearch = e.target.value;
    setStrSearch(newStrSearch);
    filterFieldsDispatch({
      type: "onChangeSearch",
      payload: newStrSearch.trim(),
    })
  }
  useEffect(() => {
    if (filterFieldsState.strForsearch !== strSearch.trim()) setStrSearch(filterFieldsState.strForsearch);
  }, [filterFieldsState.strForsearch]);

  return (
    <Label label="Поиск" className={className}>
      <FieldText
        // wrapProps={{
        //   className: className
        // }}
        className={"filterFieldForStrSearch" + (className ? " " + className : "")}
        onChange={onChangeStrSearch}
        value={strSearch} {...props}
        placeholder="Введите интересующее вас название продукта"
      >
        <ResetButton
          onClick={() => filterFieldsDispatch({
            type: "onChangeSearch",
            payload: '',
          })}
          isShow={filterFieldsState.strForsearch !== ""}
          className="filterFieldForStrSearch__resetBtn"
        />
      </FieldText>
    </Label>
  )
}
