import React, { useState, useEffect } from "react";
import { FuzzyScore, SemanticScore, LlmAsJudgeScore, GlobalScore } from "./Scores";

const RagResult = ({ ragResult, setOpenedResult }) => {

    

    return (
        <div className="grid grid-cols-5 gap-4 bg-neutral shadow-xl rounded-lg p-2 items-center">
            
            <div className="col-span-3">
                {ragResult.query}
            </div>
            
            <div className="col-span-2 grid grid-cols-5 items-center" >
                <FuzzyScore score={ragResult.fuzzy_score} />
                <SemanticScore score={ragResult.semantic_score}/>
                <LlmAsJudgeScore score={ragResult.llm_as_judge_score}/>
                <GlobalScore score={ragResult.global_score}/>
                <button className="btn btn-sm btn-outline btn-primary " onClick={() => setOpenedResult(ragResult)}>Details</button>
            </div>
        </div>
    );
}
export default RagResult;