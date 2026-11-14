from fastapi import FastAPI
from routers import registration

app = FastAPI()
app.include_router(registration.router)








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