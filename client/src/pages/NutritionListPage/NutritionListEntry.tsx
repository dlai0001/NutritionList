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
            <td className="pv3 pr3 bb b--black-20">
                <input type="checkbox"
                    defaultChecked={selected}
                    onChange={onSelect}
                    data-testId={`select-${label}`}
                />
            </td>
            <td className="pv3 pr3 bb b--black-20">{label}</td>
            <td className="pv3 pr3 bb b--black-20">{calories}</td>
            <td className="pv3 pr3 bb b--black-20">{fat}</td>
            <td className="pv3 pr3 bb b--black-20">{carb}</td>
            <td className="pv3 pr3 bb b--black-20">{protein}</td>
        </tr>
    )
}