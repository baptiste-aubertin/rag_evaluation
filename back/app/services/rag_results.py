from ..utils.semantic_analys import semantic_documents_similarity
from ..utils.syntaxic_analys import fuzzy_documents_similarity
from ..schemas.rag_results import DocumentSchema, RagResultsSchema
import time


def _compute_fuzzy_score(
    documents1: list[DocumentSchema], documents2: list[DocumentSchema]
):
    documents1 = [doc.text for doc in documents1]
    documents2 = [doc.text for doc in documents2]
    sim_matrix = fuzzy_documents_similarity(documents1, documents2)

    return sim_matrix


def _compute_semantic_score(
    documents1: list[DocumentSchema], documents2: list[DocumentSchema]
):
    documents1 = [doc.text for doc in documents1]
    documents2 = [doc.text for doc in documents2]
    sim_matrix = semantic_documents_similarity(documents1, documents2)

    return sim_matrix


def compute_scores(rag_results: RagResultsSchema):
    t = time.time()
    res = []

    for sample in rag_results.samples:
        fuzzy_score = _compute_fuzzy_score(sample.goldstandard_docs, sample.top5docs)
        semantic_score = _compute_semantic_score(
            sample.goldstandard_docs, sample.top5docs
        )

        res.append(
            {
                "fuzzy_score": [max(scores) for scores in fuzzy_score],
                "semantic_score": [max(scores) for scores in semantic_score],
            }
        )

    print("Time taken:", time.time() - t)
    return res
