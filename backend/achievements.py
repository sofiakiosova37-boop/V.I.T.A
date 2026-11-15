from datetime import datetime, timedelta

ACHIEVEMENTS = [
    {"id": 1, "title": "First Steps", "description": "Complete your first test in V.I.T.A.", "required_tests": 1, "icon": "/achievements/bronze.png"},
    {"id": 2, "title": "Space Explorer", "description": "Complete 3 tests.", "required_tests": 3, "icon": "/achievements/silver.png"},
    {"id": 3, "title": "Safety Expert", "description": "Complete 5 tests.", "required_tests": 5, "icon": "/achievements/gold.png"},
    {"id": 4, "title": "Crew Veteran", "description": "Complete 10 tests.", "required_tests": 10, "icon": "/achievements/super.png"},
]


def current_streak(days):
    today = datetime.utcnow().date()
    day = today if today in days else today - timedelta(days=1)
    streak = 0
    while day in days:
        streak += 1
        day -= timedelta(days=1)
    return streak


def build_achievements(results):
    completed = len({(test_type, dt.date()) for test_type, dt in results})
    days = {dt.date() for _, dt in results}

    items = []
    for a in ACHIEVEMENTS:
        items.append({
            **a,
            "unlocked": completed >= a["required_tests"],
            "progress": min(100, round(completed / a["required_tests"] * 100)),
        })
    return {
        "completed_tests": completed,
        "streak_days": current_streak(days),
        "achievements": items,
    }