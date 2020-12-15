import React from 'react';
import LoadingIndicator from '../UI/LoadingIndicator';
import './IngredientList.css';

const IngredientList = props => {
    console.log('IngredientList render...')
    const listIngredients = props.isLoading
        ? <LoadingIndicator />
        : props.ingredients.map(ig => (
            <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
                <span>{ig.title}</span>
                <span>{ig.amount}x</span>
            </li>
        ))
    return (
        <section className="ingredient-list">
            <h2>Loaded Ingredients</h2>
            <ul>
                {listIngredients}
            </ul>
        </section>
    );
};

export default IngredientList;
