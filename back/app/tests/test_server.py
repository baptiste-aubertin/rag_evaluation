from fastapi.testclient import TestClient
from ..server import app
from ..schemas.rag_results_schema import RagEvaluationResponse
import json

client = TestClient(app)


def test_evaluate_route():
    with open("../datas/rag_results.json", "r") as file:
        rag_results = json.load(file)

    response = client.post("/rag_results/evaluate", json=rag_results)
    # Assert the status code and response
    assert response.status_code == 200

    response_json = response.json()

    # Validate the response against the RagEvaluationResponse schema
    # If the response isn't in the correct format, this will raise a ValidationError.
    parsed_response = RagEvaluationResponse.model_validate(response_json)

    assert len(parsed_response.results) == len(rag_results["samples"])
