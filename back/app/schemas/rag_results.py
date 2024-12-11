from typing import List, Optional
from pydantic import BaseModel, Field


class DocumentSchema(BaseModel):
    text: str = Field(..., description="Le texte du document.")
    score: Optional[float] = Field(
        None, description="Un score de pertinence (entre 0 et 1)."
    )
    used_for_generation: Optional[bool] = Field(
        None,
        description="Indique si le document a été utilisé pour générer la réponse.",
    )


class SampleSchema(BaseModel):
    query: str = Field(
        ..., description="La question posée par l’utilisateur, en langage naturel."
    )
    goldstandard_answer: str = Field(
        ..., description="Une réponse détaillée considérée comme référence."
    )
    goldstandard_keywords: List[str] = Field(
        ...,
        description="Un tableau de mots-clés pertinents pour la réponse de référence.",
    )
    goldstandard_docs: List[DocumentSchema] = Field(
        ...,
        description="Un tableau de documents de référence utilisés pour construire la réponse standard.",
    )
    answer: str = Field(
        ..., description="Une réponse produite par le système de RAG à évaluer."
    )
    top5docs: List[DocumentSchema] = Field(
        ...,
        description="Les 5 documents les plus pertinents, identifiés par le système de RAG à évaluer.",
    )


class RagResultsSchema(BaseModel):
    samples: List[SampleSchema] = Field(
        ..., description="Une liste d'échantillons à évaluer."
    )
