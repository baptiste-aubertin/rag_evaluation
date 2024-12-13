from fastapi import APIRouter, HTTPException

from ..schemas.rag_results_schema import RagResultsSchema, RagEvaluationResponse
from ..services.rag_results_service import compute_scores

import traceback


## import http error
import traceback


rag_results_router = APIRouter(prefix="/rag_results")


rag_results_router = APIRouter(prefix="/rag_results")


@rag_results_router.post(
    "/evaluate",
    response_model=RagEvaluationResponse,
    summary="Evaluate RAG results",
    description=(
        "Takes a JSONL file input containing RAG samples and computes evaluation metrics. "
        "Returns an array of results, each corresponding to one sample, including fuzzy scores, "
        "semantic scores, and LLM-based judge scores."
    ),
)
async def syntaxic_search_route(
    rag_results: RagResultsSchema,
):
    """
    Returns a structured list of evaluation results, one per sample.
    """
    try:
        scores = compute_scores(rag_results)
        return {"results": scores}
    except Exception as exc:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Une erreur est survenue") from exc
