import { NutritionListPage } from '.'
import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { MockedProvider } from '@apollo/client/testing'
import { nutritionListQuery, resetMutation } from './queries';


const originalError = console.error;

describe('NutritionListPage', () => {

    beforeAll(() => {
        console.error = (...args: string[]) => {
            if (/Warning.*not wrapped in act/.test(args[0])) {
                return
            }
            originalError.call(console, ...args)
        }
    })

    afterAll(() => {
        console.error = originalError
    })

    it('should reset list', async () => {
        let resetCalled = false

        const mockNultritionListQuery = {
            request: {
                query: nutritionListQuery,
            },
            result: () => ({
                data: {
                    nutritionList: resetCalled ? testData : [...testData, testEntry],
                },
            }),
        }

        const mocks = [
            // Note: There is a bug in MockProvider which requires us to put the request in the mock
            // provider 2x.
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

        const renderTree = render(
            <MockedProvider mocks={mocks}>
                <NutritionListPage />
            </MockedProvider>
        )

        // await end of promise queue
        await new Promise(resolve => setTimeout(resolve, 0));

        // Validate preconditions
        expect(renderTree.container.innerHTML).toMatchSnapshot()
        expect(screen.getByText('Oreo')).toBeInTheDocument()
        expect(screen.getByText('Ice Cream')).toBeInTheDocument()

        // the queries can accept a regex to make your selectors more resilient to content tweaks and changes.
        fireEvent.click(screen.getByText(/Reset/i))

        await new Promise(resolve => setImmediate(resolve, 0));

        expect(screen.getByText('Oreo')).toBeInTheDocument()

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