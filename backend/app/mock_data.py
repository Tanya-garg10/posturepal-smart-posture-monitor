posture_score_data = {
    "score": 84,
    "status": "Good posture",
    "alerts": 2,
    "good_posture_minutes": 185,
    "bad_posture_minutes": 42,
    "improvement_percentage": 12.5,
}

posture_history_data = [
    {"date": "2026-03-09", "score": 72, "good_minutes": 150, "bad_minutes": 70},
    {"date": "2026-03-10", "score": 76, "good_minutes": 162, "bad_minutes": 62},
    {"date": "2026-03-11", "score": 80, "good_minutes": 171, "bad_minutes": 54},
    {"date": "2026-03-12", "score": 79, "good_minutes": 168, "bad_minutes": 57},
    {"date": "2026-03-13", "score": 83, "good_minutes": 178, "bad_minutes": 48},
    {"date": "2026-03-14", "score": 84, "good_minutes": 185, "bad_minutes": 42},
]

notifications_data = [
    {
        "id": 1,
        "title": "Slouch Detected",
        "message": "Your upper back is bending too much. Sit upright.",
        "priority": "high",
        "read": False,
        "timestamp": "2026-03-14T10:20:00",
        "category": "posture",
    },
    {
        "id": 2,
        "title": "Break Reminder",
        "message": "You have been sitting for 50 minutes. Take a 2-minute break.",
        "priority": "medium",
        "read": False,
        "timestamp": "2026-03-14T10:00:00",
        "category": "break",
    },
    {
        "id": 3,
        "title": "Achievement Unlocked",
        "message": "You completed a 3-day posture improvement streak.",
        "priority": "low",
        "read": True,
        "timestamp": "2026-03-13T18:30:00",
        "category": "gamification",
    },
]

exercise_data = [
    {
        "id": 1,
        "name": "Neck Flexion & Extension",
        "duration_seconds": 30,
        "reps": 8,
        "difficulty": "Easy",
        "target_area": "Neck",
        "tip": "Move slowly and avoid sudden jerks.",
    },
    {
        "id": 2,
        "name": "Shoulder Shrug & Roll",
        "duration_seconds": 30,
        "reps": 10,
        "difficulty": "Easy",
        "target_area": "Shoulders",
        "tip": "Keep breathing normally while rolling shoulders.",
    },
    {
        "id": 3,
        "name": "Spinal Twist",
        "duration_seconds": 45,
        "reps": 8,
        "difficulty": "Medium",
        "target_area": "Back",
        "tip": "Twist gently without forcing your spine.",
    },
]

desk_setup_data = [
    {
        "label": "Monitor Distance",
        "current": "40 cm",
        "recommended": "50-70 cm",
        "status": "needs_adjustment",
        "suggestion": "Move your monitor slightly farther away.",
    },
    {
        "label": "Monitor Height",
        "current": "Below eye level",
        "recommended": "Top of screen at eye level",
        "status": "needs_adjustment",
        "suggestion": "Raise the screen using a stand or books.",
    },
    {
        "label": "Chair Height",
        "current": "Good",
        "recommended": "Knees at 90°",
        "status": "good",
        "suggestion": "No change needed.",
    },
]

corporate_dashboard_data = {
    "organization_average_score": 81,
    "participation_rate": 89,
    "health_score": 84,
    "compliance_rate": 78,
    "wellness_index": 8.3,
    "departments": [
        {"name": "Engineering", "score": 85},
        {"name": "Marketing", "score": 78},
        {"name": "Operations", "score": 80},
        {"name": "HR", "score": 83},
    ],
}

settings_store = {
    "user_id": "demo-user",
    "smart_reminders": True,
    "break_interval_minutes": 45,
    "alert_sensitivity": "medium",
    "dark_mode": False,
}

gamification_store = {
    "user_id": "demo-user",
    "current_streak": 3,
    "longest_streak": 9,
    "badges": ["Early Bird", "No Slouch"],
}
