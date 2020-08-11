import { NutritionListPage } from '.'
import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { nutritionListQuery, resetMutation, removeMutation, addMutation } from './queries'
import { InMemoryCache } from '@apollo/client'
import { ModalProvider } from '../../components/modal-dialog'

describe('NutritionListPage', () => {

    beforeEach(() => {
        jest.resetAllMocks()
        jest.spyOn(window, 'alert').mockImplementation((...args) => { });
    })

    it('should reset list when reset is clicked.', async () => {
        let resetCalled = false

        const mockNultritionListQuery = {
            request: {
                query: nutritionListQuery,
            },
            result: () => {
                return ({
                    data: {
                        nutritionList: resetCalled ? testData : [...testData, testEntry],
                    },
                })
            },
        }

        const mocks = [
            // Note: There is a bug in MockProvider which requires us to put the request in the mock
            // provider 2x (once for each time we expect it to be called).
            mockNultritionListQuery,
            mockNultritionListQuery,
            {
                request: {
                    query: resetMutation,
                },
                result: () => {
                    resetCalled = true

                    return {
                        data: {
                            nutritionList: {
                                reset: true,
                            },
                        },
                    }
                },
            },
        ]

        const cache = createCache();

        const renderTree = render(
            <MockedProvider mocks={mocks} cache={cache}>
                <NutritionListPage />
            </MockedProvider>
        )

        // await end of promise queue
        await new Promise(resolve => setTimeout(resolve, 0));

        // Validate preconditions
        expect(renderTree.container.innerHTML).toMatchSnapshot()
        expect(renderTree.getByText('Oreo')).toBeInTheDocument()
        expect(renderTree.getByText('Ice Cream')).toBeInTheDocument()

        // Perform action
        fireEvent.click(renderTree.getByText(/Reset/i))

        // Await promise queue 2x to 1st allow data to update, then once again to finish rerendering.
        await new Promise(resolve => setTimeout(resolve, 0));
        await new Promise(resolve => setTimeout(resolve, 0));

        // Validate
        expect(renderTree.getByText('Oreo')).toBeInTheDocument()
        expect(() => renderTree.getByText('Ice Cream')).toThrow()
    });

    it('should remove selected item when Remove is clicked.', async () => {
        let deleteCalled = false

        const mockNultritionListQuery = {
            request: {
                query: nutritionListQuery,
            },
            result: () => {
                return ({
                    data: {
                        nutritionList: deleteCalled ? testData : [...testData, testEntry],
                    },
                })
            },
        }

        const mocks = [
            // Note: There is a bug in MockProvider which requires us to put the request in the mock
            // provider 2x.
            mockNultritionListQuery,
            mockNultritionListQuery,
            {
                request: {
                    query: removeMutation,
                    variables: {
                        desserts: ['Ice Cream'],
                    },
                },
                result: () => {
                    deleteCalled = true

                    return {
                        data: {
                            nutritionList: {
                                remove: true,
                            },
                        },
                    }
                },
            },
        ]

        const cache = createCache();

        const renderTree = render(
            <MockedProvider mocks={mocks} cache={cache}>
                <NutritionListPage />
            </MockedProvider>
        )

        // await end of promise queue        
        await new Promise(resolve => setTimeout(resolve, 0));

        // Validate preconditions
        expect(renderTree.container.innerHTML).toMatchSnapshot()
        expect(renderTree.getByText('Oreo')).toBeInTheDocument()
        expect(renderTree.getByText('Ice Cream')).toBeInTheDocument()

        // Perform action
        fireEvent.click(renderTree.getByTestId('select-Ice Cream'))
        fireEvent.click(renderTree.getByText('DELETE'))

        // Await promise queue 2x to 1st allow data to update, then once again to finish rerendering.
        await new Promise(resolve => setTimeout(resolve, 0));
        await new Promise(resolve => setTimeout(resolve, 0));

        // Validate
        expect(screen.getByText('Oreo')).toBeInTheDocument()
        expect(() => screen.getByText('Ice Cream')).toThrow()
    });

    it('should display add dessert modal.', async () => {
        const mockNultritionListQuery = {
            request: {
                query: nutritionListQuery,
            },
            result: () => ({
                data: {
                    nutritionList: testData,
                },
            }),
        }

        const mocks = [            
            mockNultritionListQuery,            
        ]

        const cache = createCache();

        const renderTree = render(
            <MockedProvider mocks={mocks} cache={cache}>
                <ModalProvider>
                    <NutritionListPage />
                </ModalProvider>
            </MockedProvider>
        )

        // await end of promise queue        
        await new Promise(resolve => setTimeout(resolve, 0));

        // Perform action
        fireEvent.click(renderTree.getByText('ADD NEW'))

        // Await promise queue 2x to 1st allow data to update, then once again to finish rerendering.
        await new Promise(resolve => setTimeout(resolve, 0));

        // Validate preconditions
        expect(renderTree.container.innerHTML).toMatchSnapshot()

        // Validate
        expect(renderTree.getByTestId('AddFoodModal')).toBeInTheDocument()
    });

    it('should submit new dessert.', async () => {
        let addedItems: NutritionListEntry[] = []

        const mockNultritionListQuery = {
            request: {
                query: nutritionListQuery,
            },
            result: () => {
                return ({
                    data: {
                        nutritionList: [...testData, ...addedItems],
                    },
                })
            },
        }

        const mocks = [
            // Note: There is a bug in MockProvider which requires us to put the request in the mock
            // provider 2x.
            mockNultritionListQuery,
            mockNultritionListQuery,
            {
                request: {
                    query: addMutation,
                    variables: {
                        dessert: {
                            dessert: testEntry.dessert,
                            calories: testEntry.nutritionInfo.calories,
                            fat: testEntry.nutritionInfo.fat,
                            carb: testEntry.nutritionInfo.carb,
                            protein: testEntry.nutritionInfo.protein,
                        },
                    },
                },
                result: () => {
                    addedItems.push(testEntry)

                    return {
                        data: {
                            nutritionList: {
                                add: true,
                            },
                        },
                    }
                },
            },
        ]

        const cache = createCache();

        const renderTree = render(
            <MockedProvider mocks={mocks} cache={cache}>
                <ModalProvider>
                    <NutritionListPage />
                </ModalProvider>
            </MockedProvider>
        )

        // await end of promise queue
        await new Promise(resolve => setTimeout(resolve, 0));

        // Perform action
        fireEvent.click(renderTree.getByText('ADD NEW'))

        await new Promise(resolve => setTimeout(resolve, 0));

        // Validate preconditions
        expect(renderTree.getByTestId('AddFoodModal')).toBeInTheDocument()
        expect(renderTree.container.innerHTML).toMatchSnapshot()

        // Perform action - fill out form and submit        
        fireEvent.change(renderTree.getByTestId('DessertNameInput'), { target: { value: testEntry.dessert } })
        fireEvent.blur(renderTree.getByTestId('DessertNameInput'))
        await new Promise(resolve => setTimeout(resolve, 0));

        fireEvent.change(renderTree.getByTestId('CaloriesInput'), { target: { value: testEntry.nutritionInfo.calories.toString() } })
        fireEvent.blur(renderTree.getByTestId('CaloriesInput'))
        await new Promise(resolve => setTimeout(resolve, 0));

        fireEvent.change(renderTree.getByTestId('FatInput'), { target: { value: testEntry.nutritionInfo.fat.toString() } })
        fireEvent.blur(renderTree.getByTestId('FatInput'))
        await new Promise(resolve => setTimeout(resolve, 0));

        fireEvent.change(renderTree.getByTestId('CarbInput'), { target: { value: testEntry.nutritionInfo.carb.toString() } })
        fireEvent.blur(renderTree.getByTestId('CarbInput'))
        await new Promise(resolve => setTimeout(resolve, 0));

        fireEvent.change(renderTree.getByTestId('ProteinInput'), { target: { value: testEntry.nutritionInfo.protein.toString() } })
        fireEvent.blur(renderTree.getByTestId('ProteinInput'))
        await new Promise(resolve => setTimeout(resolve, 0));

        fireEvent.click(renderTree.getByTestId('SubmitButton'))

        // await end of promise queue - wait 3x to allow modal to dismiss and to refetch updated list.
        await new Promise(resolve => setTimeout(resolve, 0));
        await new Promise(resolve => setTimeout(resolve, 0));
        await new Promise(resolve => setTimeout(resolve, 0));

        // Validate
        // Modal should be dismissed
        expect(() => renderTree.getByTestId('AddFoodMoal')).toThrow()
        // New item should be added to list.
        expect(renderTree.getByText(testEntry.dessert)).toBeInTheDocument()
    });
});




const testData = [
    {
        dessert: 'Oreo',
        nutritionInfo: {
            calories: 437,
            fat: 18,
            carb: 63,
            protein: 4,
        },
        __typename: 'NutritionEntry',
    },
    {
        dessert: 'Nougat',
        nutritionInfo: {
            calories: 360,
            fat: 19,
            carb: 9,
            protein: 37,
        },
        __typename: 'NutritionEntry',
    },
]

const testEntry = {
    dessert: 'Ice Cream',
    nutritionInfo: {
        calories: 140,
        fat: 7,
        carb: 16,
        protein: 2,
    },
    __typename: 'NutritionEntry',
}
function createCache() {
    return new InMemoryCache({
        typePolicies: {
            NutritionEntry: {
                keyFields: ['dessert'],
            },
            Query: {
                fields: {
                    nutritionList: {
                        merge(_ignored, incoming) {
                            return incoming;
                        },
                    }
                }
            }
        },
    });
}

