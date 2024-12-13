import React from "react";
import { useState } from "react";

export const ScoreTitle = ({ label, sortType, onSort, active }) => {
    const [sortOrder, setSortOrder] = useState("desc");

    const handleClick = () => {
        // Toggle sort order
        const newOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newOrder);
        onSort(sortType, newOrder);
    };

    return (
        <span 
            onClick={handleClick} 
            className="cursor-pointer hover:underline flex items-center gap-1"
        >
            {label}
        </span>
    );
};

export const Score = ({ score }) => {
    return <span>{score !== undefined && score !== null ? score.toFixed(2) : ""}</span>;
};