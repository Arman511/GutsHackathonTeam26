from pathlib import Path
from typing import Annotated, List
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi import Depends, FastAPI, HTTPException, Response, status

from backend import models
from backend.auth import get_current_user, auth_router
from backend.events import event_router
from backend.locations import location_router
from backend.result import result_router
from backend.keywords import keyword_router
from backend.database import engine
from backend.dependencies import db_dependency as db_dependency

app = FastAPI()
app.include_router(auth_router, prefix="/api")
app.include_router(event_router, prefix="/api")
app.include_router(location_router, prefix="/api")
app.include_router(result_router, prefix="/api")
app.include_router(keyword_router, prefix="/api")

models.Base.metadata.create_all(bind=engine)

user_dependency = Annotated[dict, Depends(get_current_user)]


@app.get("/api/users", status_code=status.HTTP_200_OK)
async def get_users(db: db_dependency):
    users = db.query(models.Users).all()
    return {"users": users}


@app.get("/api/health", status_code=status.HTTP_200_OK)
async def health_check():
    return {"status": "healthy"}


base_dir = Path(__file__).resolve().parent.parent
candidates = [
    base_dir / "static",
    base_dir / "guts-template" / "dist",
]
dist_dir = None
for p in candidates:
    try:
        p = p.resolve()
    except Exception:
        continue
    if p.exists():
        dist_dir = p
        break

if dist_dir and dist_dir.exists():
    app.mount("/static", StaticFiles(directory=dist_dir, html=True), name="static")

    @app.get("/", include_in_schema=False)
    async def serve_index():
        if dist_dir:
            index_path = dist_dir / "index.html"
            print(f"Serving index file from: {index_path}")
            if index_path.exists():
                return FileResponse(index_path)
            else:
                raise HTTPException(status_code=404, detail="Index file not found")

    @app.middleware("http")
    async def fallback_to_index(request, call_next):
        response = await call_next(request)
        try:
            status = response.status_code
        except Exception:
            return response

        if status == 404 and request.method in ("GET", "HEAD") and dist_dir:
            path = request.url.path or "/"

            excluded_prefixes = ("/api",)
            if any(path.startswith(p) for p in excluded_prefixes):
                return response

            if Path(path).suffix:
                file_path = dist_dir / path.lstrip("/")
                if file_path.exists():
                    return FileResponse(file_path)
                return response

            index_path = dist_dir / "index.html"
            if index_path.exists():
                return FileResponse(index_path)

        return response
