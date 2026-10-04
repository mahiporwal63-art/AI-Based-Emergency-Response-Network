from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import require_role
from database.db import get_db
from database.models import Resource, User


router = APIRouter(
    prefix="/resources",
    tags=["Resources"]
)


# =========================
# Request Model
# =========================

class ResourceCreate(BaseModel):

    name: str

    type: str

    latitude: float = 22.7196

    longitude: float = 75.8577

    available: bool = True


# =========================
# Convert Database Object
# =========================

def out(x):

    return {

        "id": x.id,

        "name": x.name,

        "type": x.type,

        "latitude": x.latitude,

        "longitude": x.longitude,

        "available": x.available,

        "status": x.status
    }


# =========================
# GET ALL RESOURCES
# =========================

@router.get("")
def all_resources(
    _: User = Depends(require_role("Control Officer")),
    db: Session = Depends(get_db)
):

    resources = (
        db.query(Resource)
        .all()
    )

    # Create demo resources
    # if database is empty

    if not resources:

        resources = [

            Resource(
                name="Central Ambulance 01",
                type="Ambulance",
                latitude=22.7196,
                longitude=75.8577
            ),

            Resource(
                name="Fire Unit 01",
                type="Fire Truck",
                latitude=22.735,
                longitude=75.85
            ),

            Resource(
                name="Rescue Team Alpha",
                type="Rescue Team",
                latitude=22.71,
                longitude=75.87
            ),

            Resource(
                name="Ambulance 02",
                type="Ambulance",
                latitude=22.70,
                longitude=75.84,
                available=False,
                status="Busy"
            )
        ]

        db.add_all(resources)

        db.commit()

    return [
        out(x)
        for x in db.query(Resource).all()
    ]


# =========================
# CREATE RESOURCE
# =========================

@router.post("")
def create(
    p: ResourceCreate,
    _: User = Depends(require_role("Control Officer")),
    db: Session = Depends(get_db)
):

    x = Resource(

        **p.model_dump(),

        status=
            "Available"
            if p.available
            else "Busy"
    )

    db.add(x)

    db.commit()

    db.refresh(x)

    return out(x)