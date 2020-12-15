import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
    const { onSearch } = props;
    const [keyword, setKeyword] = useState("");
    const keywordRef = useRef();

    useEffect(() => {
        console.log("Search render...");

        const timer = setTimeout(() => {
            if (keyword === keywordRef.current.value) {
                (async () => {
                    try {
                        onSearch(null, true);
                        const query =
                            keyword.length === 0
                                ? ""
                                : `?orderBy="title"&equalTo="${keyword}"`;
                        const res = await fetch(
                            "https://hook-ingredients-default-rtdb.firebaseio.com/ingredients.json" +
                                query
                        );
                        const data = await res.json();
                        if (res.ok) {
                            const fetchedIngredients = [];
                            for (const key in data) {
                                fetchedIngredients.push({
                                    id: key,
                                    title: data[key].title,
                                    amount: data[key].amount,
                                });
                            }
                            onSearch(fetchedIngredients, false);
                        }
                    } catch (err) {
                        console.log(err);
                    }
                })();
            }
        }, 500);
        return () => {
            clearTimeout(timer);
        };
    }, [keyword, onSearch, keywordRef]);
    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input
                        ref={keywordRef}
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            </Card>
        </section>
    );
});

export default Search;
