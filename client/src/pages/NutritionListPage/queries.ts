import {gql, useQuery, useMutation} from '@apollo/client'


export const nutritionListQuery = gql`
    query GetNutritionList {
        nutritionList {
            dessert
            nutritionInfo {
                calories
                fat
                carb
                protein
            }
        }
    }
`
debugger;

export const useNutritionList = () => useQuery(nutritionListQuery)

export const resetMutation = gql`
    mutation ResetNutritionList {
        nutritionList {
            reset
        }
    }
`

export const useResetList = () => useMutation(resetMutation, {
    awaitRefetchQueries: true,
    refetchQueries: ['GetNutritionList']
})

export const removeMutation = gql`
    mutation DeleteNutritionEntry($desserts: [String]!) {
        nutritionList {
            remove(desserts: $desserts)
        }
    }
`
export const useRemoveDessert = () => useMutation(removeMutation, {
    awaitRefetchQueries: true,
    refetchQueries: ['GetNutritionList']
})


export const addMutation = gql`
    mutation AddNutritionEntry($dessert: NutritionEntryInput!) {
        nutritionList {
            add(input: $dessert)
        }
    }
`

export const useAddDessert = () => useMutation(addMutation, {
    awaitRefetchQueries: true,
    refetchQueries: ['GetNutritionList']
})