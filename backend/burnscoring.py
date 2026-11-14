from burnoutQ import QUESTION_SECTIONS

def level_a(score):
    if score <= 17: return "low"
    if score <= 29: return "moderate"
    return "high"

def level_b(score):
    if score <= 5: return "low"
    if score <= 11: return "moderate"
    return "high"

def level_c(score): 
    if score <= 33: return "high"
    if score <= 39: return "moderate"
    return "low"

def calculate_exhaustion(answers):
    score = sum(a["value"] for a in answers)
    if score <= 17:
        level = "low"
        tips = ["The level of exhaustion is low. Continue with your current sleep and rest routine."]
    elif score <= 29:
        level = "moderate"
        tips = ["There are signs of accumulated fatigue. Take a break, get some rest, and reduce the workload where possible."]
    else:
        level = "high"
        tips = ["The level of exhaustion is high. Talk to someone on the team or a specialist, and don't delay rest."]
    return {"score": score, "max_score": 42, "level": level, "tips": tips}
"""
def calculate(answers):
    totals = {"A": 0, "B": 0, "C": 0}
    for a in answers:
        totals[QUESTION_SECTIONS[a["question_id"]]] += a["value"]
    return {
        "A": {"score": totals["A"], "level": level_a(totals["A"])},
        "B": {"score": totals["B"], "level": level_b(totals["B"])},
        "C": {"score": totals["C"], "level": level_c(totals["C"])},
    } """