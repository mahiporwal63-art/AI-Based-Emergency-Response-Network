# ============================================================
# AI EMERGENCY RESPONSE NETWORK
# FastAPI Backend - Main Application
# ============================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Database
from database.db import Base, engine

# Import models so SQLAlchemy knows about the tables
from database import models

# API Routes
from routes.incidents import router as incidents_router
from routes.resources import router as resources_router
from routes.users import router as users_router


# ============================================================
# CREATE DATABASE TABLES
# ============================================================

Base.metadata.create_all(
    bind=engine
)


# ============================================================
# CREATE FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="AI Emergency Response Network",
    description=(
        "AI-assisted emergency incident reporting, "
        "analysis, resource management and control room API."
    ),
    version="1.0.0"
)


# ============================================================
# CORS CONFIGURATION
# ============================================================
#
# Allows the React frontend running on port 5173
# to communicate with the FastAPI backend running
# on port 8000.
#

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ]
)


# ============================================================
# REGISTER API ROUTES
# ============================================================

app.include_router(
    incidents_router,
    prefix="/api"
)

app.include_router(
    resources_router,
    prefix="/api"
)

app.include_router(
    users_router,
    prefix="/api"
)


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():

    return {
        "application":
            "AI Emergency Response Network",

        "status":
            "running",

        "version":
            "1.0.0",

        "message":
            "Emergency Response API is running successfully."
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health")
def health():

    return {

        "status":
            "healthy",

        "database":
            "connected",

        "service":
            "AI Emergency Response API"
    }


# ============================================================
# APPLICATION INFORMATION
# ============================================================

@app.get("/api/info")
def info():

    return {

        "name":
            "AI Emergency Response Network",

        "version":
            "1.0.0",

        "features": [

            "Emergency Reporting",

            "AI Emergency Classification",

            "Severity Analysis",

            "Priority Scoring",

            "People-at-Risk Detection",

            "Vulnerable Person Detection",

            "Trapped Person Detection",

            "Resource Recommendation",

            "Emergency Resource Management",

            "Incident Status Management",

            "Control Room Dashboard"
        ]
    }