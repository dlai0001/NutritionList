/**
 * Main App Entry point
 * - mostly handles routing for this example.
 */
import React from 'react'
import { FunctionComponent } from 'react'
import { ModalProvider } from './components/modal-dialog/'
import { NutritionListPage } from './pages/NutritionListPage/index'

export const App: FunctionComponent = () => {

  return (
    <div className="App">      
      <ModalProvider>
        <NutritionListPage/>  
      </ModalProvider>
    </div>
  )
}