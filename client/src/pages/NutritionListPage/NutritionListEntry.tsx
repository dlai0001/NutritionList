import React, { FunctionComponent } from "react";

export type NutritionListEntryProps = {
    dessert: NutritionListEntry;
    selected: boolean;
    onSelect: () => void;
}

export const NutritionListEntry: FunctionComponent<NutritionListEntryProps> = ({ dessert, selected, onSelect }) => {
    const label = dessert.dessert
    const {
        calories,
        fat,
        carb,
        protein
    } = dessert.nutritionInfo;

    return (
        <tr>
            <td className="pv3 pr3 bb b--black-20 flex flex-row items-middle">
                <input type="checkbox"
                    defaultChecked={selected}
                    onChange={onSelect}
                    data-testId={`select-${label}`}
                    className="ma3"
                />
                <div className="table-cell__inner-content--hidden-md">
                    <p>{label}</p>
                    <p>Calories: {calories}</p>
                    <p>Fat: {fat}</p>
                    <p>Carbs: {carb}</p>
                    <p>Protein: {protein}</p>
                </div>
            </td>
            <td className="pv3 pr3 bb b--black-20 table-cell--hidden-sm">{label}</td>
            <td className="pv3 pr3 bb b--black-20 table-cell--hidden-sm">{calories}</td>
            <td className="pv3 pr3 bb b--black-20 table-cell--hidden-sm">{fat}</td>
            <td className="pv3 pr3 bb b--black-20 table-cell--hidden-sm">{carb}</td>
            <td className="pv3 pr3 bb b--black-20 table-cell--hidden-sm">{protein}</td>
        </tr>
    )
}