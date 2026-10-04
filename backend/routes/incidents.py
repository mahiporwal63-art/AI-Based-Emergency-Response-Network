import json

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from auth import require_role
from database.db import get_db
from database.models import Incident, User
from ai.analyzer import analyze_incident


router = APIRouter(
    prefix="/incidents",
    tags=["Incidents"]
)


# =========================
# Request Models
# =========================

class IncidentCreate(BaseModel):

    description: str = Field(
        min_length=5
    )

    latitude: float

    longitude: float

    reporter_name: str = "Anonymous"


class StatusUpdate(BaseModel):

    status: str


# =========================
# Convert Database Object
# to API Response
# =========================

def out(x):

    return {
        "id": x.id,

        "description": x.description,

        "reporter_name": x.reporter_name,

        "latitude": x.latitude,

        "longitude": x.longitude,

        "status": x.status,

        "created_at":
            x.created_at.isoformat()
            if x.created_at
            else None,

        "analysis": {

            "emergency_type":
                x.emergency_type,

            "severity":
                x.severity,

            "priority":
                x.priority,

            "score":
                x.priority_score,

            "people_at_risk":
                x.people_at_risk,

            "vulnerable":
                x.vulnerable,

            "trapped":
                x.trapped,

            "required_resources":
                json.loads(
                    x.required_resources or "[]"
                )
        }
    }


# =========================
# CREATE INCIDENT
# =========================

@router.post("")
def create(
    p: IncidentCreate,
    _: User = Depends(require_role("Citizen")),
    db: Session = Depends(get_db)
):

    # Analyze emergency using AI analyzer
    a = analyze_incident(
        p.description
    )

    # Create database record
    x = Incident(

        description=p.description,

        reporter_name=p.reporter_name,

        latitude=p.latitude,

        longitude=p.longitude,

        emergency_type=
            a["emergency_type"],

        severity=
            a["severity"],

        priority=
            a["priority"],

        priority_score=
            a["score"],

        people_at_risk=
            a["people_at_risk"],

        vulnerable=
            a["vulnerable"],

        trapped=
            a["trapped"],

        required_resources=
            json.dumps(
                a["required_resources"]
            )
    )

    db.add(x)

    db.commit()

    db.refresh(x)

    return {
        "incident": out(x),
        "analysis": a
    }


# =========================
# GET ALL INCIDENTS
# =========================

@router.get("")
def all_incidents(
    _: User = Depends(require_role("Control Officer")),
    db: Session = Depends(get_db)
):

    incidents = (
        db.query(Incident)
        .order_by(
            Incident.created_at.desc()
        )
        .all()
    )

    return [
        out(x)
        for x in incidents
    ]


# =========================
# GET ONE INCIDENT
# =========================

@router.get("/{incident_id}")
def one(
    incident_id: int,
    _: User = Depends(require_role("Control Officer")),
    db: Session = Depends(get_db)
):

    x = (
        db.query(Incident)
        .filter(
            Incident.id == incident_id
        )
        .first()
    )

    if not x:

        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    return out(x)


# =========================
# UPDATE INCIDENT STATUS
# =========================

@router.patch("/{incident_id}/status")
def status(
    incident_id: int,
    p: StatusUpdate,
    _: User = Depends(require_role("Control Officer")),
    db: Session = Depends(get_db)
):

    allowed = [

        "New",

        "Investigating",

        "Dispatched",

        "On Scene",

        "Resolved"

    ]

    if p.status not in allowed:

        raise HTTPException(
            status_code=400,
            detail="Invalid status"
        )

    x = (
        db.query(Incident)
        .filter(
            Incident.id == incident_id
        )
        .first()
    )

    if not x:

        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    x.status = p.status

    db.commit()

    db.refresh(x)

    return out(x)