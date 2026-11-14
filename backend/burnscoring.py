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

def calculate(answers):
    totals = {"A": 0, "B": 0, "C": 0}
    for a in answers:
        totals[QUESTION_SECTIONS[a["question_id"]]] += a["value"]
    return {
        "A": {"score": totals["A"], "level": level_a(totals["A"])},
        "B": {"score": totals["B"], "level": level_b(totals["B"])},
        "C": {"score": totals["C"], "level": level_c(totals["C"])},
    }