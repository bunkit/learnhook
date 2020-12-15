import React, { useState } from "react";

import Card from "../UI/Card";
import "./IngredientForm.css";

const IngredientForm = React.memo((props) => {
  console.log("form render...");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const submitHandler = (event) => {
    event.preventDefault();
    props.addIngredients({
      title: name,
      amount: amount,
    });
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              onChange={(event) =>
                setName(event.target.value)
              }
              value={name}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              onChange={(event) =>
                setAmount(event.target.value)
              }
              value={amount}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
