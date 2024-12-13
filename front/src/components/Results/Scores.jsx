import React from "react";


export const FuzzyScoreTitle = () => {
    return (
        <span className="">Fuzzy</span>
    );
}

export const FuzzyScore = ({ score }) => {
    return (
        <span className=" ">{score && score.toFixed(2)}</span>
    );
}

export const SemanticScoreTitle = () => {
    return (
        <span className="">Semantic</span>
    );
}

export const SemanticScore = ({ score }) => {
    return (
        <span className=" ">{score && score.toFixed(2)}</span>
    );
}

export const LlmAsJudgeScoreTitle = () => {
    return (
        <span className="">LLM</span>
    );
}

export const LlmAsJudgeScore = ({ score }) => {
    return (
        <span className=" ">{score && score.toFixed(2)}</span>
    );
}

export const GlobalScoreTitle = () => {
    return (
        <span className="">Global</span>
    );
}

export const GlobalScore = ({ score }) => {
    return (
        <span className=" ">{score && score.toFixed(2)}</span>
    );
}

