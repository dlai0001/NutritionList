import { GraphQLServer } from 'graphql-yoga'
import gql from 'graphql-tag'
import {config as dotenvInit} from 'dotenv'

dotenvInit()

const INIT_DATA = [
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

// Schema
const typeDefs = gql`
    type NutritionInfo {
        calories: Int!
        fat: Int!
        carb: Int!
        protein: Int!
    }

    type NutritionEntry {
        dessert: String!
        nutritionInfo: NutritionInfo!
    }    
    
    input NutritionEntryInput {
        dessert: String!
        calories: Int!
        fat: Int!
        carb: Int!
        protein: Int!
    }

    type NutritionListOps {
        reset: Boolean!
        add(input: NutritionEntryInput!): Boolean!
        remove(desserts: [String]!): Boolean!
    }

    type Query {
        nutritionList: [NutritionEntry]!
    }

    type Mutation {
        nutritionList: NutritionListOps
    }
    
`

let database = INIT_DATA.slice()

const rootResolvers = {
  Query: {
    nutritionList: () => database,
  },
  Mutation: {
    nutritionList: () => ({}),
  },
    NutritionListOps: {
        add: async (parent, args, context, info) => {
            const {dessert, calories, fat, carb, protein} = args.input
            
            if(!database.some(x => x.dessert === dessert)) {
                database.push({
                    dessert,
                    nutritionInfo: {
                        calories,
                        fat,
                        carb,
                        protein
                    },
                })
                return true
            }

            return false
        },
        remove: async (parent, args, context, info) => {
            const {desserts} = args            

            const origCount = database.length
            database = database.filter(x => !desserts.includes(x.dessert))

            return origCount !== database.length
        },
        reset: async () => {
            database = INIT_DATA.slice()
            return true
        }
    }
}

const server = new GraphQLServer({ typeDefs, resolvers: rootResolvers })
server.start(() => console.log('Server is running on localhost:4000'))
