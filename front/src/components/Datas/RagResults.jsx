import React from "react"
import RagResult from "./RagResult";

const RagResults = ({ ragResults }) => {

    

    return (
        <div className="w-full h-full overflow-y-auto space-y-4">
            {
                ragResults.map((result, i) => (
                    <RagResult key={i} ragResult={result} />
                ))
            }
        </div>
    );
}
export default RagResults;