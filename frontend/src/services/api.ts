import {
  ExerciseItem,
  TestSummary,
  UserProfile,
  WeeklyCheckupEntry,
} from "../types/health";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// 1. Отримати історію щотижневих чекапів
export async function fetchCheckupHistory(): Promise<WeeklyCheckupEntry[]> {
  const res = await fetch(`${API_BASE_URL}/checkups`);
  if (!res.ok) throw new Error("Failed to load checkups");
  return res.json();
}

// 2. Зберегти новий щотижневий чекап
export async function createCheckup(
  entry: Omit<WeeklyCheckupEntry, "id">,
): Promise<WeeklyCheckupEntry> {
  const res = await fetch(`${API_BASE_URL}/checkups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error("Failed to save checkup");
  return res.json();
}

// 3. Відправити результат будь-якого тесту (депресія, вигорання, сон, реакція)
export async function saveTestResult(
  partialSummary: Partial<TestSummary>,
): Promise<TestSummary> {
  const res = await fetch(`${API_BASE_URL}/tests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(partialSummary),
  });
  if (!res.ok) throw new Error("Failed to save test result");
  return res.json();
}

// 4. Оновити статус виконання вправи
export async function toggleExerciseApi(id: string): Promise<ExerciseItem> {
  const res = await fetch(`${API_BASE_URL}/exercises/${id}/toggle`, {
    method: "PATCH",
  });
  if (!res.ok) throw new Error("Failed to update exercise");
  return res.json();
}

// 5. Зберегти налаштування профілю
export async function updateProfileApi(
  profile: UserProfile,
): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
}

//new
const BACKEND_URL = "http://127.0.0.1:5000";

async function parse(res: Response) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function post(path: string, body: unknown) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { ok: res.ok, status: res.status, data: await parse(res) };
}

export async function get(path: string) {
  const res = await fetch(`${BACKEND_URL}${path}`);
  return { ok: res.ok, status: res.status, data: await parse(res) };
}

export const registerUser = (email: string, password: string) =>
  post("/register", { email, password });

export const loginUser = (email: string, password: string) =>
  post("/login", { email, password });
