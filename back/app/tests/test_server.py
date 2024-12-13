from fastapi.testclient import TestClient
from ..server import app
import json

client = TestClient(app)


def test_evaluate_route():
    with open("../datas/rag_results.json", "r") as file:
        rag_results = json.load(file)

    response = client.post("/rag_results/evaluate", json=rag_results)
    # Assert the status code and response
    assert response.status_code == 200

    response_json = response.json()

    assert len(response_json) == len(rag_results["samples"])
