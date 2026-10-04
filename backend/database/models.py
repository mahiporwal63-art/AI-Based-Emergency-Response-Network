from datetime import datetime

from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    Text,
    DateTime
)

from database.db import Base


# ==================================================
# INCIDENT TABLE
# ==================================================

class Incident(Base):

    __tablename__ = "incidents"


    # Primary key
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    # Emergency description
    description = Column(
        Text,
        nullable=False
    )


    # Person who reported emergency
    reporter_name = Column(
        String,
        default="Anonymous"
    )


    # Emergency location
    latitude = Column(
        Float,
        nullable=False
    )

    longitude = Column(
        Float,
        nullable=False
    )


    # AI analysis
    emergency_type = Column(
        String,
        default="Unknown"
    )

    severity = Column(
        String,
        default="Medium"
    )

    priority = Column(
        String,
        default="Medium"
    )


    # AI priority score
    priority_score = Column(
        Integer,
        default=0
    )


    # Number of people potentially affected
    people_at_risk = Column(
        Integer,
        default=0
    )


    # Vulnerable person detected
    vulnerable = Column(
        Boolean,
        default=False
    )


    # Trapped person detected
    trapped = Column(
        Boolean,
        default=False
    )


    # Required emergency resources
    #
    # Example:
    # ["Ambulance", "Fire Truck", "Rescue Team"]
    #
    # This will be stored as JSON text.
    required_resources = Column(
        Text,
        default="[]"
    )


    # Incident status
    status = Column(
        String,
        default="New"
    )


    # Time of incident report
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# ==================================================
# RESOURCE TABLE
# ==================================================

class Resource(Base):

    __tablename__ = "resources"


    # Primary key
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )


    # Resource name
    #
    # Example:
    # Central Ambulance 01
    name = Column(
        String,
        nullable=False
    )


    # Resource type
    #
    # Examples:
    # Ambulance
    # Fire Truck
    # Rescue Team
    type = Column(
        String,
        nullable=False
    )


    # Resource location
    latitude = Column(
        Float,
        default=0
    )

    longitude = Column(
        Float,
        default=0
    )


    # Availability
    available = Column(
        Boolean,
        default=True
    )


    # Current resource status
    #
    # Available
    # Busy
    # Dispatched
    # Offline
    status = Column(
        String,
        default="Available"
    )


# ==================================================
# USER TABLE
# ==================================================

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    email = Column(
        String,
        nullable=False,
        unique=True,
        index=True
    )

    password_hash = Column(
        String,
        nullable=False
    )

    role = Column(
        String,
        nullable=False
    )