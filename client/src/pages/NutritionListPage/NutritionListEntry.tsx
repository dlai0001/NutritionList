import React, { FunctionComponent } from "react";

export type NutritionListEntryProps = {
    dessert: NutritionListEntry;
    selected: boolean;
    onSelect: () => void;
}

export const NutritionListEntry: FunctionComponent<NutritionListEntryProps> = ({ dessert, selected, onSelect }) => {
    const {
        calories,
        fat,
        carb,
        protein
    } = dessert.nutritionInfo;

    return (
        <tr>
            <td className="pv3 pr3 bb b--black-20"><input type="checkbox" defaultChecked={selected} onChange={onSelect} /></td>
            <td className="pv3 pr3 bb b--black-20">{dessert.dessert}</td>
            <td className="pv3 pr3 bb b--black-20">{calories}</td>
            <td className="pv3 pr3 bb b--black-20">{fat}</td>
            <td className="pv3 pr3 bb b--black-20">{carb}</td>
            <td className="pv3 pr3 bb b--black-20">{protein}</td>
        </tr>
    )
}