import React, { FunctionComponent, useEffect, useState } from 'react'
import { useModal } from '../../components/modal-dialog'
import { AddFoodModal } from '../AddFoodModal'
import { NutritionListEntry } from './NutritionListEntry'
import { useAddDessert, useNutritionList, useRemoveDessert, useResetList } from './queries'
import './styles.css'



export const NutritionListPage: FunctionComponent = () => {
    const modalActions = useModal()

    // Main list query
    const { loading, data } = useNutritionList()
    const nutritionList = data?.nutritionList
    
    // Calls to mutations
    const [addDessert] = useAddDessert()
    const [removeDessert] = useRemoveDessert()
    const [resetList] = useResetList()


    const [selectedMap, setSelectedMap] = useState<{ [dessert: string]: boolean }>({})
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const selectedCount = Object.values(selectedMap).reduce((prev, current) => prev + (current ? 1 : 0), 0)


    // reset selected map when data changes.    
    useEffect(() => {
        setSelectedMap({})
        setSelectAllChecked(false)
    }, [nutritionList])

    // select/deselect all
    useEffect(() => {
        const updatedSelectedMap: { [dessert: string]: boolean } = {}
        nutritionList?.forEach((x: NutritionListEntry) => {
            updatedSelectedMap[x.dessert] = selectAllChecked
        })
        setSelectedMap(updatedSelectedMap)
    }, [selectAllChecked, nutritionList])

    const toggleSelected = (dessert: string) => {
        setSelectedMap((selected) => ({
            ...selected,
            [dessert]: !selectedMap[dessert],
        }))
    }

    const toggleSelectAll = () => {
        setSelectAllChecked(x => !x);
    }

    const handleDelete = async () => {
        if (!selectedCount) {
            return
        }

        const dessertsToBeDeleted = Object.entries(selectedMap).reduce((accum, current) => {
            const [dessert, selected] = current
            if (selected) {
                accum.push(dessert)
            }
            return accum
        }, [] as string[])

        try {
            await removeDessert({
                variables: {
                    desserts: dessertsToBeDeleted,
                },
            })
        } catch (err) {
            alert(err);
        }
    }

    const handleReset = () => {
        resetList()
    }

    const handleAdd = () => {
        modalActions?.showModal(AddFoodModal, {
            onSubmit: async (values: NutritionListEntry) => {
                try {
                    await addDessert({
                        variables: {
                            dessert: {
                                dessert: values.dessert,
                                calories: values.nutritionInfo.calories,
                                fat: values.nutritionInfo.fat,
                                carb: values.nutritionInfo.carb,
                                protein: values.nutritionInfo.protein,
                            },
                        },
                    })

                    modalActions?.hideModal(null);
                } catch (err) {
                    alert(err);
                }
            },
        })
    }

    if (loading) {
        return (
            <div>
                <i className="fa fa-refresh ma2 fa-spin" aria-hidden="true"></i>
                Loading...
            </div>
        )
    }

    return (
        <div className="fl w-100 bg-light-gray">
            <NutritionListControls
                selectedCount={selectedCount}
                handleAdd={handleAdd}
                handleDelete={handleDelete}
                handleReset={handleReset}
            />

            <table className="f6 w-100 mw8 center">
                <thead className="table-header">
                    <tr>
                        <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white">
                            <input type="checkbox" checked={selectAllChecked} onChange={toggleSelectAll} />
                        </th>
                        <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white">Dessert (100g serving)</th>
                        <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white">Calories</th>
                        <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white">Fat (g)</th>
                        <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white">Carbs (g)</th>
                        <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white">Protein (g)</th>
                    </tr>
                </thead>
                <tbody className="lh-copy">
                    {nutritionList.map((dessert: NutritionListEntry) => <NutritionListEntry
                        dessert={dessert}
                        selected={selectedMap[dessert.dessert]}
                        onSelect={() => toggleSelected(dessert.dessert)}
                        key={dessert.dessert}
                    />)}
                </tbody>
            </table>

        </div>
    )
}

type NutritionListControlsProps = {
    selectedCount: number;
    handleReset: () => any;
    handleAdd: () => any;
    handleDelete: () => any;
}

const NutritionListControls: FunctionComponent<NutritionListControlsProps> = (props) => {
    const {selectedCount, handleReset, handleAdd, handleDelete } = props;

    return (
        <>
            <div className="flex flex-row justify-between">
                <span className="f1 fw6">
                    Nutrition List
                </span>
                <span className="action-button f6 link dim br1 ph3 pv2 mb2 dib white bg-dark-green ba b--blue bw2 fw6" onClick={handleReset}>
                    <i className="fa fa-refresh ma2" aria-hidden="true"></i>
                    Reset Data
                </span>
            </div>

            <div className="action-container bg-washed-red fw6 flex flex-row justify-between w-100">
                <div className="selected-label purple v-mid pa3 ">{selectedCount} selected</div>
                <div className="actions-bar w-40 flex flex-row items-end ">
                    <span className="action-button link dim br1 ph3 pv2 mb2 dib dark-green bg-white ma2" onClick={handleAdd}>
                        <i className="fa fa-plus mr2" aria-hidden="true"></i>
                        ADD NEW
                    </span>
                    <span
                        className={'action-button f6 link br1 ph3 pv2 mb2 dib dark-green bg-white ma2 ' + (selectedCount ? 'dim' : 'disabled')}
                        onClick={handleDelete}
                    >
                        <i className="fa fa-trash mr2" aria-hidden="true"></i>
                        DELETE
                    </span>
                </div>
            </div>
        </>
    )
}


