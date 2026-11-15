from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
#from pydantic import BaseModel, Field

from datetime import datetime, timedelta
#from typing import List
from flask import Flask, jsonify, request
from flask_cors import CORS

from routers.registration import bp as registration_bp
import database as db
from burnscoring import calculate_exhaustion
from sleep_scoring import calculate_sleep
from depressionscoring import calculate_depression
from reaction_scoring import calculate_reaction

app = Flask(__name__)
CORS(app) 
app.register_blueprint(registration_bp) 

def error(message, code):
    return jsonify({"detail": message}), code

def too_soon(user_id, test_type):
    last = db.last_result_date(user_id, test_type)
    if not last:
        return False
    if test_type == "sleep":
        return last.date() == datetime.utcnow().date()
    return datetime.utcnow() - last < timedelta(days=7)

def valid_answers(data, expected_count, max_value):
    answers = data.get("answers")
    if not isinstance(answers, list):
        return None
    try:
        parsed = [
            {"question_id": int(a["question_id"]), "value": int(a["value"])}
            for a in answers
        ]
    except (KeyError, TypeError, ValueError):
        return None
    ids = sorted(a["question_id"] for a in parsed)
    if ids != list(range(1, expected_count + 1)):
        return None
    if any(not 0 <= a["value"] <= max_value for a in parsed):
        return None
    return parsed

def get_user_id(data):
    try:
        return int(data["user_id"])
    except (KeyError, TypeError, ValueError):
        return None

@app.post("/tests/burnout/submit")
def submit_burnout():
    data = request.get_json(silent=True) or {}
    user_id = get_user_id(data)
    answers = valid_answers(data, 14, 6)
    if user_id is None or answers is None:
        return error("Неверные данные", 400)
    if too_soon(user_id, "burnout"):
        return error("Тест можно проходить раз в неделю", 409)
    result = calculate_exhaustion(answers)
    db.save_result(user_id, "burnout", result)
    return jsonify(result)

@app.get("/tests/burnout/history/<int:user_id>")
def burnout_history(user_id):
    return jsonify(db.get_history(user_id, "burnout"))

@app.post("/tests/mood/submit")
def submit_mood():
    data = request.get_json(silent=True) or {}
    user_id = get_user_id(data)
    answers = valid_answers(data, 21, 3)
    if user_id is None or answers is None:
        return error("Неверные данные", 400)
    if too_soon(user_id, "mood"):
        return error("Тест можно проходить раз в неделю", 409)
    result = calculate_depression(answers)
    db.save_result(user_id, "mood", result)
    return jsonify(result)


@app.get("/tests/mood/history/<int:user_id>")
def mood_history(user_id):
    return jsonify(db.get_history(user_id, "mood"))

SLEEP_RANGES = {
    "hours": (0, 16),
    "quality": (1, 5),
    "rested": (1, 5),
    "minutes_to_fall_asleep": (0, 300),
    "night_awakenings": (0, 10),
}
SLEEP_FLAGS = ["bright_light", "noise", "temperature", "devices_before_bed", "food_or_caffeine"]

@app.post("/tests/sleep/submit")
def submit_sleep():
    data = request.get_json(silent=True) or {}
    user_id = get_user_id(data)
    if user_id is None:
        return error("Неверные данные", 400)

    d = {}
    for field, (low, high) in SLEEP_RANGES.items():
        try:
            value = float(data[field]) if field == "hours" else int(data[field])
        except (KeyError, TypeError, ValueError):
            return error(f"Неверное поле: {field}", 400)
        if not low <= value <= high:
            return error(f"Неверное поле: {field}", 400)
        d[field] = value
    for flag in SLEEP_FLAGS:
        d[flag] = bool(data.get(flag, False))

    if too_soon(user_id, "sleep"):
        return error("Сегодня вы уже заполняли дневник сна", 409)

    result = calculate_sleep(d)
    db.save_result(user_id, "sleep", {**d, **result})
    return jsonify(result)


@app.get("/tests/sleep/history/<int:user_id>")
def sleep_history(user_id):
    return jsonify(db.get_history(user_id, "sleep"))


@app.get("/tests/sleep/summary/<int:user_id>")
def sleep_summary(user_id):
    last7 = db.get_history(user_id, "sleep")[-7:]
    if not last7:
        return jsonify({"days": 0, "avg_hours": None, "avg_score": None})
    return jsonify({
        "days": len(last7),
        "avg_hours": round(sum(r["hours"] for r in last7) / len(last7), 1),
        "avg_score": round(sum(r["score"] for r in last7) / len(last7)),
    })

@app.get("/reminders/<int:user_id>")
def reminders(user_id):
    return jsonify({
        "sleep_due": not too_soon(user_id, "sleep"),
        "burnout_due": not too_soon(user_id, "burnout"),
        "mood_due": not too_soon(user_id, "mood"),
    })

@app.post("/tests/reaction/submit")
def submit_reaction():
    data = request.get_json(silent=True) or {}
    user_id = get_user_id(data)
    attempts = data.get("attempts")
    if user_id is None or not isinstance(attempts, list) or len(attempts) != 5:
        return error("Invalid data", 400)
    try:
        attempts = [int(x) for x in attempts]
    except (TypeError, ValueError):
        return error("Invalid data", 400)
    if any(not 100 <= x <= 3000 for x in attempts):
        return error("Invalid reaction times", 400)

    previous = [r["avg_ms"] for r in db.get_history(user_id, "reaction")]
    result = calculate_reaction(attempts, previous)
    db.save_result(user_id, "reaction", result)
    return jsonify(result)

@app.get("/tests/reaction/history/<int:user_id>")
def reaction_history(user_id):
    return jsonify(db.get_history(user_id, "reaction"))


if __name__ == "__main__":
    app.run(debug=True)









"""
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
        raise HTTPException(409, "The burnout test can only be taken once a week.")
    if len(data.answers) != 22 or any(not 0 <= a.value <= 6 for a in data.answers):
        raise HTTPException(400, "Incorrect answers")
    result = calculate_exhaustion([a.dict() for a in data.answers])
    db.save_result(data.user_id, "burnout", result)
    return result

@app.get("/tests/burnout/history/{user_id}")
def history(user_id: int):
    return db.get_history(user_id, "burnout")

@app.post("/tests/mood/submit")
def submit_mood(data: Submission):
    if too_soon(data.user_id, "mood"):
        raise HTTPException(409, "The mood test can only be taken once a week.")
    ids = sorted(a.question_id for a in data.answers)
    if ids != list(range(1, 22)) or any(not 0 <= a.value <= 3 for a in data.answers):
        raise HTTPException(400, "Incorrect answers")
    result = calculate_depression([a.dict() for a in data.answers])
    db.save_result(data.user_id, "mood", result)
    return result


@app.get("/tests/mood/history/{user_id}")
def mood_history(user_id: int):
    return db.get_history(user_id, "mood")

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
        raise HTTPException(409, "The sleep test can only be taken once a day.")
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