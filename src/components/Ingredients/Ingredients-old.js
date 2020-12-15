import React, { useEffect, useCallback, useReducer, useMemo } from 'react';

import ErrorModal from '../UI/ErrorModal';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';


const ingredientReducer = (currentIngredients, action) => {
    switch (action.type) {
        case 'SET':
            return action.ingredients
        case 'ADD':
            return [...currentIngredients, action.ingredient]
        case 'DELETE':
            return currentIngredients.filter(ing => ing.id !== action.id)
        default:
            throw new Error('Should not be here!!')
    }
}

const httpStateReducer = (currHttpState, action) => {
    switch (action.type) {
        case 'SEND':
            return { loading: true, error: null }
        case 'RESPONSE':
            return { ...currHttpState, loading: false }
        case 'ERROR':
            return { loading: false, error: action.errorMessage }
        case 'SEARCH':
            return { ...currHttpState, loading: action.isLoading }
        case 'CLEAR':
            return { ...currHttpState, error: null }
        default:
            throw new Error('Never going here!!')
    }
}

const Ingredients = () => {

    const [ingredients, dispatch] = useReducer(ingredientReducer, [])
    const [httpState, dispatchHttp] = useReducer(httpStateReducer, {
        loading: false, error: null
    });

    useEffect(() => {
    }, []);
    const addIngredientsHandler = useCallback(async ingredient => {
        try {
            dispatchHttp({ type: 'SEND' })
            const res = await fetch('https://hook-ingredients-default-rtdb.firebaseio.com/ingredients.json', {
                method: 'POST',
                body: JSON.stringify(ingredient),
                headers: { 'Content-Type': 'application/json' }
            })
            const data = await res.json();
            if (res.ok) {
                dispatchHttp({ type: 'RESPONSE' })
                dispatch({ type: 'ADD', ingredient: { id: data.name, ...ingredient } })
            }
        } catch (err) {
            dispatchHttp({ type: 'ERROR', errorMessage: 'Something Were Wrong!!' });
        }
    }, [])
    const removeIngredientHandler = useCallback(async id => {
        try {
            dispatchHttp({ type: 'SEND' });
            const res = await fetch(`https://hook-ingredients-default-rtdb.firebaseio.com/ingredients/${id}.json`, {
                method: 'DELETE',
            })
            if (res.ok) {
                dispatchHttp({ type: 'RESPONSE' });
                dispatch({ type: 'DELETE', id: id })
            }
        } catch (err) {
            dispatchHttp({ type: 'ERROR', errorMessage: 'Something Were Wrong!!' });
        }
    }, [])
    const onSearchHandler = useCallback((filteredIngredients, isLoading) => {
        dispatchHttp({ type: 'SEARCH', isLoading: isLoading });
        if (filteredIngredients !== null) {
            dispatch({ type: 'SET', ingredients: filteredIngredients })
        }
    }, [])
    const closeModalHandler = useCallback(() => {
        dispatchHttp({ type: 'CLEAR' });
    }, [])
    const ingredientList = useMemo(() => {
        return (
            <IngredientList isLoading={httpState.loading} ingredients={ingredients} onRemoveItem={removeIngredientHandler} />
        )
    }, [ingredients, httpState.loading, removeIngredientHandler])
    return (
        <div className="App">
            {httpState.error && <ErrorModal onClose={closeModalHandler}>{httpState.error}</ErrorModal>}
            <IngredientForm addIngredients={addIngredientsHandler} />
            <section>
                <Search onSearch={onSearchHandler} />
                {ingredientList}
            </section>
        </div>
    );
}

export default Ingredients;
