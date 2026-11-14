import { BloodAnalysisResponse, BloodMetricsInput } from "../types/health";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function analyzeBloodBiomarkers(
  payload: BloodMetricsInput,
): Promise<BloodAnalysisResponse> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${API_BASE_URL}/api/v1/analyze/blood`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const json = await response.json();
    return {
      ...json.data,
      source: "backend-api",
    };
  } catch {
    // Offline-first fallback: ідентична логіка на клієнті, якщо зв'язку з сервером немає
    const risks: string[] = [];
    let status: "green" | "yellow" | "red" = "green";

    if (payload.white_blood_cells < 4.0) {
      risks.push(
        "Низький рівень лейкоцитів (імуносупресія, ризик активації латентних вірусів)",
      );
      status = "yellow";
    } else if (payload.white_blood_cells > 11.0) {
      risks.push(
        "Підвищений рівень лейкоцитів (можлива запальна реакція або інфекція)",
      );
      status = "yellow";
    }

    if (payload.hemoglobin < 12.0) {
      risks.push(
        "Низький гемоглобін (ознаки анемії, зниження толерантності до навантажень)",
      );
      status = "yellow";
    }

    if (payload.hydration_level < 50.0) {
      risks.push(
        "Критична дегідратація! Високий ризик падіння тиску та непритомності при посадці.",
      );
      status = "red";
    }

    if (risks.length === 0) {
      risks.push("Усі показники в межах норми. Продовжуйте місію за графіком.");
    }

    return {
      status,
      evaluated_metrics: {
        hemoglobin: payload.hemoglobin,
        white_blood_cells: payload.white_blood_cells,
        hydration_level: payload.hydration_level,
      },
      identified_risks: risks,
      source: "offline-fallback",
    };
  }
}
