import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.routes.resume import router as resume_router
from app.schemas.resume import HealthResponse
from app.services.llm_service import llm_service

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("resume_customizer")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade Resume Customizer API powered by Groq LLM",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS setup
# Allows development origins, wildcard vercel preview deployments, and custom FRONTEND_URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Production safe: can be refined via settings.cors_origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    error_msg = "; ".join([f"{err.get('loc', ['field'])[-1]}: {err.get('msg', 'invalid')}" for err in errors])
    logger.warning(f"Validation error on {request.url.path}: {error_msg}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": f"Validation Error: {error_msg}"}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again or verify your inputs."}
    )

# Routes
app.include_router(resume_router, prefix="/api")

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify backend status, version, and Groq LLM configuration.
    """
    return HealthResponse(
        status="ok",
        service=settings.PROJECT_NAME,
        version=settings.VERSION,
        llm_configured=llm_service.is_configured(),
        llm_model=settings.GROQ_MODEL
    )

@app.get("/", tags=["Health"])
async def root():
    return {
        "message": "Resume Customizer API is running",
        "health": "/health",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
