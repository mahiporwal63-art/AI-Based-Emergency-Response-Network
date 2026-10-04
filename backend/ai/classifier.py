# ============================================================
# Emergency Classification
# ============================================================


def classify_emergency(text: str) -> str:
    """
    Classify an emergency based on keywords
    found in the user's description.

    This is a rule-based AI/NLP prototype.
    """

    text = text.lower().strip()

    emergency_groups = {

        "Flood": [
            "flood",
            "flooded",
            "water entered",
            "waterlogging",
            "water logging",
            "water logged",
            "heavy rain",
            "flash flood",
            "flood water"
        ],

        "Fire": [
            "fire",
            "flames",
            "burning",
            "burn",
            "smoke",
            "fire accident",
            "building fire",
            "house fire",
            "explosion"
        ],

        "Medical": [
            "heart attack",
            "unconscious",
            "bleeding",
            "severe bleeding",
            "injury",
            "injured",
            "accident",
            "ambulance",
            "medical emergency",
            "medical"
        ],

        "Earthquake": [
            "earthquake",
            "earthquake tremor",
            "building collapsed",
            "building collapse",
            "collapse",
            "tremor",
            "shaking"
        ],

        "Landslide": [
            "landslide",
            "mudslide",
            "rocks falling",
            "rockfall",
            "mountain collapse"
        ],

        "Missing Person": [
            "missing person",
            "missing child",
            "missing",
            "cannot find",
            "can't find",
            "lost child",
            "lost person"
        ]
    }

    # Check each emergency category
    for emergency_type, keywords in emergency_groups.items():

        for keyword in keywords:

            if keyword in text:
                return emergency_type

    # If nothing matches
    return "General Emergency"