from typing import List, Optional
from pydantic import BaseModel, Field


class DocumentSchema(BaseModel):
    text: str = Field(
        ...,
        description="Le texte du document.",
        example="Trains are a very safe mode of transport...",
    )
    score: Optional[float] = Field(
        None, description="Un score de pertinence (entre 0 et 1).", example=0.87
    )
    used_for_generation: Optional[bool] = Field(
        None,
        description="Indique si le document a été utilisé pour générer la réponse.",
    )


class SampleSchema(BaseModel):
    query: str = Field(
        ...,
        description="La question posée par l’utilisateur, en langage naturel.",
        example="Why are there no seat belts on trains?",
    )
    goldstandard_answer: str = Field(
        ...,
        description="Une réponse détaillée considérée comme référence.",
        example="The absence of seat belts on trains can be attributed to their high safety levels...",
    )
    goldstandard_keywords: List[str] = Field(
        ...,
        description="Un tableau de mots-clés pertinents pour la réponse de référence.",
        example=[
            "trains safe",
            "impractical boarding/alighting",
            "seat belts no safety increase",
        ],
    )
    goldstandard_docs: List[DocumentSchema] = Field(
        ...,
        description="Un tableau de documents de référence utilisés pour construire la réponse standard.",
        example=[
            {
                "text": "Trains are a very safe way of travelling...",
                "score": None,
                "used_for_generation": None,
            }
        ],
    )
    answer: str = Field(
        ...,
        description="Une réponse produite par le système de RAG à évaluer.",
        example="Trains are considered safe enough that seat belts are not deemed necessary...",
    )
    top5docs: List[DocumentSchema] = Field(
        ...,
        description="Les 5 documents les plus pertinents, identifiés par le système de RAG à évaluer.",
        example=[
            {
                "text": "Trains in most countries have never had seatbelts...",
                "score": 0.9983,
                "used_for_generation": True,
            }
        ],
    )


class RagResultsSchema(BaseModel):
    samples: List[SampleSchema] = Field(
        ..., description="Une liste d'échantillons à évaluer."
    )


#### RESPONSE SCHEMAS ####


class TopFiveDocScore(BaseModel):
    score: float = Field(
        ...,
        description="The best matching score for a single retrieved doc against the gold documents.",
    )
    gold_doc_index: int = Field(
        ...,
        description="Index of the reference (gold) document that achieved the highest score.",
    )


class ScoreDetails(BaseModel):
    sample_score: float = Field(
        ...,
        description="Aggregated score for the sample (e.g., average of best matches across used documents).",
    )
    top5doc_scores: List[TopFiveDocScore] = Field(
        ...,
        description="Per-doc best-matching scores, each with associated gold doc index.",
    )


class LlmJudgeEvaluation(BaseModel):
    sample_score: float = Field(
        ..., description="Overall evaluation score assigned by the LLM."
    )
    feedback: str = Field(
        ...,
        description="Textual feedback from the LLM regarding the quality of the answer.",
        example="The response provides a detailed explanation for the absence of seat belts on trains ...",
    )


class RagSampleEvaluation(BaseModel):
    llm_as_judge_score: LlmJudgeEvaluation = Field(
        ...,
        description="LLM-based evaluation (judge) score and feedback for this sample.",
    )
    fuzzy_score: ScoreDetails = Field(
        ..., description="Fuzzy matching evaluation results (aggregated and per-doc)."
    )
    semantic_score: ScoreDetails = Field(
        ...,
        description="Semantic similarity evaluation results (aggregated and per-doc).",
    )


class RagEvaluationResponse(BaseModel):
    results: List[RagSampleEvaluation] = Field(
        ..., description="List of evaluation results, one per sample."
    )
