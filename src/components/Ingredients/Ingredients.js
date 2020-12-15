import React, { useEffect, useCallback, useReducer, useMemo } from "react";
import useHttp from "../../hooks/http";

import ErrorModal from "../UI/ErrorModal";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const ingredientReducer = (currentIngredients, action) => {
    switch (action.type) {
        case "SET":
            return action.ingredients;
        case "ADD":
            return [...currentIngredients, action.ingredient];
        case "DELETE":
            return currentIngredients.filter((ing) => ing.id !== action.id);
        default:
            throw new Error("Should not be here!!");
    }
};

const Ingredients = () => {
    const [ingredients, dispatch] = useReducer(ingredientReducer, []);
    const {
        isLoading,
        error,
        data,
        sendRequest,
        reqExtra,
        method,
        clear,
    } = useHttp();

    useEffect(() => {
        sendRequest(
            `https://hook-ingredients-default-rtdb.firebaseio.com/ingredients.json`,
            "GET"
        );
    }, [sendRequest]);
    useEffect(() => {
        if (method === "DELETE") {
            dispatch({ type: "DELETE", id: reqExtra });
        } else if (method === "POST") {
            dispatch({
                type: "ADD",
                ingredient: { id: data.name, ...reqExtra },
            });
        } else if (method === "GET") {
            const fetchedIngredients = [];
            for (const key in data) {
                fetchedIngredients.push({
                    id: key,
                    title: data[key].title,
                    amount: data[key].amount,
                });
            }
            dispatch({ type: "SET", ingredients: fetchedIngredients });
        }
    }, [data, reqExtra, method]);

    const addIngredientsHandler = useCallback(
        (ingredient) => {
            sendRequest(
                `https://hook-ingredients-default-rtdb.firebaseio.com/ingredients.json`,
                "POST",
                JSON.stringify(ingredient),
                ingredient
            );
        },
        [sendRequest]
    );
    const removeIngredientHandler = useCallback(
        (id) => {
            sendRequest(
                `https://hook-ingredients-default-rtdb.firebaseio.com/ingredients/${id}.json`,
                "DELETE",
                null,
                id
            );
        },
        [sendRequest]
    );
    const onSearchHandler = useCallback(
        (query) => {
            sendRequest(
                `https://hook-ingredients-default-rtdb.firebaseio.com/ingredients.json${query}`,
                "GET"
            );
        },
        [sendRequest]
    );
    const ingredientList = useMemo(() => {
        return (
            <IngredientList
                isLoading={isLoading}
                ingredients={ingredients}
                onRemoveItem={removeIngredientHandler}
            />
        );
    }, [ingredients, isLoading, removeIngredientHandler]);
    return (
        <div className="App">
            {error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
            <IngredientForm addIngredients={addIngredientsHandler} />
            <section>
                <Search onSearch={onSearchHandler} />
                {ingredientList}
            </section>
        </div>
    );
};

export default Ingredients;
