import React, { useState, useEffect } from "react";

import Card from "../UI/Card";
import "./Search.css";

let timer = 0;
const Search = React.memo((props) => {
    const { onSearch } = props;
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        console.log("Search render...");
    }, []);

    const onSearchHandler = async (keywordValue) => {
        setKeyword(keywordValue);
        clearTimeout(timer);
        timer = setTimeout(() => {
            const query =
                keywordValue.length === 0
                    ? ""
                    : `?orderBy="title"&equalTo="${keywordValue}"`;
            onSearch(query);
        }, 500);
    };
    return (
        <section className="search">
            <Card>
                <div className="search-input">
                    <label>Filter by Title</label>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => onSearchHandler(e.target.value)}
                    />
                </div>
            </Card>
        </section>
    );
});

export default Search;
