import React from "react"
import RagResult from "./RagResult";
import Sorters from "./Sorters";


const RagResults = ({ ragResults, setRagResults, setOpenedResult }) => {
    return (
      <div className="w-full h-full overflow-y-auto space-y-4">
        <Sorters ragResults={ragResults} setRagResults={setRagResults}/>
        {ragResults.map((result, i) => (
          <RagResult key={i} ragResult={result} setOpenedResult={setOpenedResult} />
        ))}
      </div>
    );
  };
export default RagResults;