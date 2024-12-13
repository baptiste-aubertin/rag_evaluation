import React from "react";
import { ScoreTitle } from "./Scores";

const Sorters = ({ ragResults, setRagResults }) => {
    const handleSort = (sortType, sortOrder) => {
        
        console.log(sortType, sortOrder);

        const sortedResults = [...ragResults].sort((a, b) => {
            switch (sortType) {
                case "fuzzy":
                    return sortOrder === "asc" 
                        ? a.fuzzy_score - b.fuzzy_score 
                        : b.fuzzy_score - a.fuzzy_score;
                case "semantic":
                    return sortOrder === "asc"
                        ? a.semantic_score - b.semantic_score
                        : b.semantic_score - a.semantic_score;
                case "llm_as_judge":
                    return sortOrder === "asc"
                        ? a.llm_as_judge_score - b.llm_as_judge_score
                        : b.llm_as_judge_score - a.llm_as_judge_score;
                case "global":
                    return sortOrder === "asc"
                        ? a.global_score - b.global_score
                        : b.global_score - a.global_score;
                default:
                    return 0;
            }
        });

        setRagResults(sortedResults);
    };

    return (
        <div className="grid grid-cols-5 gap-4 bg-neutral shadow-xl rounded-lg p-2">
            <div className="col-span-3"></div>
            <div className="col-span-2 grid grid-cols-5">
                <ScoreTitle label="Fuzzy" sortType="fuzzy" onSort={handleSort} />
                <ScoreTitle label="Semantic" sortType="semantic" onSort={handleSort} />
                <ScoreTitle label="LLM" sortType="llm_as_judge" onSort={handleSort} />
                <ScoreTitle label="Global" sortType="global" onSort={handleSort} />
            </div>
        </div>
    );
};

export default Sorters;
