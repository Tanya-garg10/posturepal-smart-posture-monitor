from fastapi import APIRouter
from app.schemas import ExerciseItem, DeskSetupItem
from app.mock_data import exercise_data, desk_setup_data

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])


@router.get("/exercises", response_model=list[ExerciseItem])
def get_exercises():
    return exercise_data


@router.get("/desk-setup", response_model=list[DeskSetupItem])
def get_desk_setup():
    return desk_setup_data
