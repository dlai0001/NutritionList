/**
 * Provides a Modal Context and Controller.
 */

import React, {useState, FunctionComponent, SyntheticEvent} from 'react'
import { createContext } from 'react'
import { useContext } from 'react'
import './styles.css'

/**
 * Available actions provided Modal Context
 */
type ModalActions = {
    showModal: (component: FunctionComponent<any>, props: object) => Promise<any>;
    hideModal: (returnVal: any) => void;
}

/**
 * Modal context allowing any child of the App to open a new modal.
 */
const ModalContext = createContext<ModalActions | null >(null);

export const useModal = () => {    
    const modalActions = useContext(ModalContext)
    return modalActions;
}


export const ModalProvider: FunctionComponent = ({children}) => {
    const [modalState, setModalState] = useState<{
        isShowing: boolean;
        component: FunctionComponent | null;
        props: object | null;
        resolve: any | null;
    }>({
        isShowing: false,
        component: null,
        props: null,
        resolve: null,
    })

    /**
     * Shows modal dialog.
     * @param component Component to show
     * @param props Props to pass to component
     * @returns Promise resolves to return value given to hideModal()
     */
    const showModal = (component: FunctionComponent, props: object): Promise<any> => {
        return new Promise((resolve) => {
            setModalState({
                isShowing: true,
                component,
                props,
                resolve
            })
        })
    }

    const hideModal = (returnValue: any) => {
        const resolveFn = modalState.resolve;
        
        setModalState({
            isShowing: false,
            component: null,
            props: null,
            resolve: null,
        })

        !!resolveFn && resolveFn(returnValue)
    }

    // Handle dismiss on clicking backdrop.
    const handleClick = (evt: SyntheticEvent) => {
        if((evt as any).target?.id === 'modal-backdrop') {
            hideModal(null);
        }
    }

    return (
        <ModalContext.Provider value={{showModal, hideModal}}>
            {children}
            {
                modalState.isShowing && 
                <div id="modal-backdrop" onClick={handleClick}>
                    <div id="modal-popup">
                        {modalState.component?.(modalState.props ?? {})}
                    </div>
                </div>
            }
        </ModalContext.Provider>
    )
}