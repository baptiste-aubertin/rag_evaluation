from fastapi import APIRouter, HTTPException

from ..schemas.rag_results import RagResultsSchema
from ..services.rag_results import compute_scores

## import http error
import traceback


rag_results_router = APIRouter(prefix="/rag_results")


@rag_results_router.post("/test")
async def syntaxic_search_route(
    rag_results: RagResultsSchema,
):
    try:
        scores = compute_scores(rag_results)

        return scores
    except Exception as exc:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Une erreur est survenue") from exc
