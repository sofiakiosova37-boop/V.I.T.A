from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from datetime import datetime, timedelta
from typing import List

from routers import registration
import database as db
from burnscoring import calculate
from sleep_scoring import calculate_sleep

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(registration.router)

def too_soon(user_id, test_type):
    last = db.last_result_date(user_id, test_type)
    if not last:
        return False
    if test_type == "sleep":  
        return last.date() == datetime.utcnow().date()
    return datetime.utcnow() - last < timedelta(days=7) 

class Answer(BaseModel):
    question_id: int
    value: int

class Submission(BaseModel):
    user_id: int
    answers: List[Answer]

@app.post("/tests/burnout/submit")
def submit(data: Submission):
    if too_soon(data.user_id, "burnout"):
        raise HTTPException(409, "Тест можно проходить раз в неделю")
    if len(data.answers) != 22 or any(not 0 <= a.value <= 6 for a in data.answers):
        raise HTTPException(400, "Неверные ответы")
    result = calculate([a.dict() for a in data.answers])
    db.save_result(data.user_id, "burnout", {"sections": result})
    return {"sections": result}

@app.get("/tests/burnout/history/{user_id}")
def history(user_id: int):
    return db.get_history(user_id, "burnout")

class SleepSubmission(BaseModel):
    user_id: int
    hours: float = Field(ge=0, le=16)
    quality: int = Field(ge=1, le=5)
    rested: int = Field(ge=1, le=5)
    minutes_to_fall_asleep: int = Field(ge=0, le=300)
    night_awakenings: int = Field(ge=0, le=10)
    bright_light: bool = False
    noise: bool = False
    temperature: bool = False
    devices_before_bed: bool = False
    food_or_caffeine: bool = False


@app.post("/tests/sleep/submit")
def submit_sleep(data: SleepSubmission):
    if too_soon(data.user_id, "sleep"):
        raise HTTPException(409, "Сегодня вы уже заполняли дневник сна")
    d = data.dict()
    result = calculate_sleep(d)
    details = {**d, **result}
    details.pop("user_id")
    db.save_result(data.user_id, "sleep", details)
    return result


@app.get("/tests/sleep/history/{user_id}")
def sleep_history(user_id: int):
    return db.get_history(user_id, "sleep")


@app.get("/tests/sleep/summary/{user_id}")
def sleep_summary(user_id: int):
    last7 = db.get_history(user_id, "sleep")[-7:]
    if not last7:
        return {"days": 0, "avg_hours": None, "avg_score": None}
    return {
        "days": len(last7),
        "avg_hours": round(sum(r["hours"] for r in last7) / len(last7), 1),
        "avg_score": round(sum(r["score"] for r in last7) / len(last7)),
    }




"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

app = FastAPI(
    title="Space Health Monitoring Backend",
    description="Бекенд для аналізу біомаркерів та показників здоров'я екіпажу",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Для хакатону дозволяємо всі джерела
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BloodMetricsInput(BaseModel):
    astronaut_id: str
    hemoglobin: float = Field(..., description="Рівень гемоглобіну, г/дл")
    white_blood_cells: float = Field(..., description="Лейкоцити, тис/мкл (імунний маркер)")
    hydration_level: float = Field(..., description="Рівень гідратації, %")
    notes: Optional[str] = None

def analyze_blood_data(data: BloodMetricsInput):
    risks = []
    status = "green"

    if data.white_blood_cells < 4.0:
        risks.append("Низький рівень лейкоцитів (імуносупресія, ризик активації латентних вірусів)")
        status = "yellow"
    elif data.white_blood_cells > 11.0:
        risks.append("Підвищений рівень лейкоцитів (можлива запальна реакція або інфекція)")
        status = "yellow"

    if data.hemoglobin < 12.0:
        risks.append("Низький гемоглобін (ознаки космо-анемії, зниження толерантності до навантажень)")
        status = "yellow"

    if data.hydration_level < 50.0:
        risks.append("Критична дегідратація! Високий ризик падіння тиску та непритомності при посадці.")
        status = "red"

    if not risks:
        risks.append("Усі біомаркери крові в межах норми. Продовжуйте місію за графіком.")

    return {
        "status": status,
        "evaluated_metrics": {
            "hemoglobin": data.hemoglobin,
            "white_blood_cells": data.white_blood_cells,
            "hydration_level": data.hydration_level
        },
        "identified_risks": risks
    }

@app.post("/api/v1/analyze/blood")
async def analyze_blood_endpoint(payload: BloodMetricsInput):
    try:
        analysis_result = analyze_blood_data(payload)
        return {"success": True, "data": analysis_result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Помилка обробки даних: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Space Health API працює! Використовуйте /docs для перегляду документації."}
    """