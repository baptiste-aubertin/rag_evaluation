import uvicorn

from dotenv import load_dotenv
import os

from fastapi import (
    FastAPI,
)

# from fastapi.responses import FileResponse

# from fastapi.templating import Jinja2Templates

# from fastapi.requests import Request

# from fastapi.staticfiles import StaticFiles

from fastapi.middleware.cors import CORSMiddleware

from .routers.rag_results_router import rag_results_router

# if os.environ.get("DEV") == "true":
#     env_path = "./Back/.env.dev"

# load_dotenv(env_path, override=True)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


app.include_router(rag_results_router)


# templates = Jinja2Templates(directory="./Back/static")

# app.mount("/assets", StaticFiles(directory="./Back/static/assets"))

# @app.get("/{rest_of_path:path}")
# async def react_app(req: Request, rest_of_path: str):
#     image_extensions = [".jpg", ".jpeg", ".png", ".gif"]
#     print(rest_of_path)
#     # Check if the requested path ends with one of the image extensions
#     if any(rest_of_path.endswith(ext) for ext in image_extensions):
#         # Construct the full path to the image
#         image_path = os.path.join("./Back/static", rest_of_path)

#         # Check if the image file exists
#         if os.path.isfile(image_path):
#             # Serve the image
#             return FileResponse(image_path)
#         else:
#             # If the file does not exist, you might want to return a 404 response or similar
#             return "Asset not found", 404
#     return templates.TemplateResponse("index.html", {"request": req})


if __name__ == "__main__":
    uvicorn.run(
        "app.server:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )
