# ============================================================
# AI Emergency Analyzer
# ============================================================

import re

from ai.classifier import classify_emergency


# ============================================================
# Utility Function
# ============================================================

def contains_any(text: str, words: list[str]) -> bool:
    """
    Check whether any keyword exists in the text.
    """

    text = text.lower()

    return any(
        word.lower() in text
        for word in words
    )


# ============================================================
# Detect Number of People
# ============================================================

def detect_people(text: str) -> int:
    """
    Try to identify the number of people mentioned
    in the emergency description.
    """

    numbers = re.findall(
        r"\b\d+\b",
        text
    )

    valid_numbers = []

    for number in numbers:

        value = int(number)

        # Ignore unrealistic values
        if 0 < value < 1000:
            valid_numbers.append(value)

    if valid_numbers:

        return max(valid_numbers)

    # Estimate people if general words are used
    if contains_any(
        text,
        [
            "family",
            "people",
            "crowd",
            "group",
            "several people"
        ]
    ):
        return 5

    # Default
    return 1


# ============================================================
# Detect Vulnerable People
# ============================================================

def detect_vulnerable_people(text: str) -> bool:

    vulnerable_keywords = [

        "child",
        "children",
        "baby",
        "infant",

        "elderly",
        "old person",
        "old people",
        "grandmother",
        "grandfather",

        "pregnant",
        "pregnancy",

        "disabled",
        "disability",
        "wheelchair",

        "blind",
        "deaf"
    ]

    return contains_any(
        text,
        vulnerable_keywords
    )


# ============================================================
# Detect Trapped People
# ============================================================

def detect_trapped_people(text: str) -> bool:

    trapped_keywords = [

        "trapped",
        "stuck",
        "inside",
        "cannot get out",
        "can't get out",
        "unable to escape",
        "locked inside",
        "blocked inside",
        "buried",
        "stranded"
    ]

    return contains_any(
        text,
        trapped_keywords
    )


# ============================================================
# Detect Critical Situation
# ============================================================

def detect_critical_condition(text: str) -> bool:

    critical_keywords = [

        "unconscious",

        "severe bleeding",

        "heavy bleeding",

        "not breathing",

        "cannot breathe",

        "can't breathe",

        "building collapsed",

        "building collapse",

        "explosion",

        "multiple injuries",

        "critical condition",

        "life threatening",

        "life-threatening",

        "death",

        "dead"
    ]

    return contains_any(
        text,
        critical_keywords
    )


# ============================================================
# Calculate Severity
# ============================================================

def calculate_severity(
    text: str,
    vulnerable: bool,
    trapped: bool
) -> str:

    # Critical emergency
    if (
        trapped
        or detect_critical_condition(text)
    ):
        return "Critical"

    # High severity
    if (
        vulnerable
        or contains_any(
            text,
            [
                "fire",
                "flood",
                "accident",
                "injury",
                "bleeding",
                "earthquake",
                "landslide"
            ]
        )
    ):
        return "High"

    # Default
    return "Medium"


# ============================================================
# Calculate Priority Score
# ============================================================

def calculate_priority_score(
    severity: str,
    people_at_risk: int,
    vulnerable: bool,
    trapped: bool
) -> int:

    score = 30

    # Severity contribution
    if severity == "Critical":

        score += 45

    elif severity == "High":

        score += 25

    elif severity == "Medium":

        score += 0

    # People contribution
    score += min(
        people_at_risk * 3,
        15
    )

    # Vulnerable person
    if vulnerable:

        score += 10

    # Trapped person
    if trapped:

        score += 15

    # Maximum score = 100
    return min(
        score,
        100
    )


# ============================================================
# Convert Score to Priority
# ============================================================

def calculate_priority(score: int) -> str:

    if score >= 75:

        return "Critical"

    if score >= 55:

        return "High"

    if score >= 35:

        return "Medium"

    return "Low"


# ============================================================
# Recommend Emergency Resources
# ============================================================

def recommend_resources(
    emergency_type: str,
    trapped: bool
) -> list[str]:

    resource_map = {

        "Fire": [
            "Fire Truck",
            "Ambulance"
        ],

        "Flood": [
            "Rescue Team",
            "Boat",
            "Ambulance"
        ],

        "Medical": [
            "Ambulance"
        ],

        "Earthquake": [
            "Rescue Team",
            "Ambulance"
        ],

        "Landslide": [
            "Rescue Team",
            "Ambulance"
        ],

        "Missing Person": [
            "Search Team"
        ],

        "General Emergency": [
            "Rescue Team"
        ]
    }

    resources = resource_map.get(
        emergency_type,
        ["Rescue Team"]
    ).copy()

    # Trapped people require rescue
    if (
        trapped
        and "Rescue Team" not in resources
    ):

        resources.append(
            "Rescue Team"
        )

    return resources


# ============================================================
# MAIN AI ANALYSIS FUNCTION
# ============================================================

def analyze_incident(text: str) -> dict:
    """
    Perform complete emergency analysis.

    Returns:
        emergency type
        severity
        priority
        priority score
        people at risk
        vulnerable status
        trapped status
        recommended resources
        explanation
    """

    if not text or not text.strip():

        return {
            "emergency_type": "General Emergency",
            "severity": "Medium",
            "priority": "Medium",
            "score": 30,
            "people_at_risk": 1,
            "vulnerable": False,
            "trapped": False,
            "required_resources": [
                "Rescue Team"
            ],
            "explanation":
                "Emergency description was empty."
        }

    # --------------------------------------------------------
    # Step 1: Emergency classification
    # --------------------------------------------------------

    emergency_type = classify_emergency(
        text
    )

    # --------------------------------------------------------
    # Step 2: Detect people
    # --------------------------------------------------------

    people_at_risk = detect_people(
        text
    )

    # --------------------------------------------------------
    # Step 3: Detect vulnerable people
    # --------------------------------------------------------

    vulnerable = detect_vulnerable_people(
        text
    )

    # --------------------------------------------------------
    # Step 4: Detect trapped people
    # --------------------------------------------------------

    trapped = detect_trapped_people(
        text
    )

    # --------------------------------------------------------
    # Step 5: Calculate severity
    # --------------------------------------------------------

    severity = calculate_severity(
        text,
        vulnerable,
        trapped
    )

    # --------------------------------------------------------
    # Step 6: Calculate priority score
    # --------------------------------------------------------

    score = calculate_priority_score(
        severity,
        people_at_risk,
        vulnerable,
        trapped
    )

    # --------------------------------------------------------
    # Step 7: Calculate priority
    # --------------------------------------------------------

    priority = calculate_priority(
        score
    )

    # --------------------------------------------------------
    # Step 8: Recommend resources
    # --------------------------------------------------------

    resources = recommend_resources(
        emergency_type,
        trapped
    )

    # --------------------------------------------------------
    # Step 9: Return complete analysis
    # --------------------------------------------------------

    return {

        "emergency_type":
            emergency_type,

        "severity":
            severity,

        "priority":
            priority,

        "score":
            score,

        "people_at_risk":
            people_at_risk,

        "vulnerable":
            vulnerable,

        "trapped":
            trapped,

        "required_resources":
            resources,

        "explanation":
            (
                "AI-assisted advisory analysis. "
                "The result should be reviewed by "
                "trained emergency personnel before "
                "dispatch."
            )
    }