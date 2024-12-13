import React from "react";
import { FuzzyScoreTitle, SemanticScoreTitle, LlmAsJudgeScoreTitle, GlobalScoreTitle } from "./Scores";

const Sorters = () => {
    return (
        <div className="grid grid-cols-5 gap-4 bg-neutral shadow-xl rounded-lg p-2">
            
        <div className="col-span-3">
        </div>
        
        <div className="col-span-2 grid grid-cols-5">
            <FuzzyScoreTitle/>
            <SemanticScoreTitle/>
            <LlmAsJudgeScoreTitle/>
            <GlobalScoreTitle/>
        </div>
    </div>
    );
  };

export default Sorters;
