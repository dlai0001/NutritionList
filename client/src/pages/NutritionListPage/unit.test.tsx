import {NutritionListPage} from '.'
import React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import { ApolloProvider } from '@apollo/client'
import { createMockClient } from 'mock-apollo-client';
import { nutritionListQuery } from './queries';


const originalError = console.error;

describe('NutritionListPage', () => {

    beforeAll(() => {
        console.error = (...args) => {
            if (/Warning.*not wrapped in act/.test(args[0])) {
                return
            }
            originalError.call(console, ...args)
        }
    })

    afterAll(() => {
        console.error = originalError
    })

    it('should render list of ', () => {
        const mockClient = createMockClient();

        mockClient.setRequestHandler(
            nutritionListQuery,
            () => Promise.resolve({ data: testData }));

        const renderTree = render(
            <ApolloProvider client={mockClient}>
                <NutritionListPage />
            </ApolloProvider>
        )

        expect(renderTree).toMatchSnapshot()
    });
});

const testData:NutritionListEntry[] = [
    {
        dessert: "Oreo",
        nutritionInfo: {
            calories: 437,
            fat: 18,
            carb: 63,
            protein: 4,
        }
    },
    {
        dessert: "Nougat",
        nutritionInfo: {
            calories: 360,
            fat: 19,
            carb: 9,
            protein: 37,
        }
    },
]