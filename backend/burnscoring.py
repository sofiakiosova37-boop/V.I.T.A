# from burnoutQ import QUESTION_SECTIONS
SECTION_MAX = 42 

def level_a(score):
    if score <= 17: 
        return "low"
    if score <= 29: 
        return "moderate"
    return "high"

def level_b(score):
    if score <= 5: 
        return "low"
    if score <= 11: 
        return "moderate"
    return "high"

"""
def level_c(score): 
    if score <= 33: return "high"
    if score <= 39: return "moderate"
    return "low" """

TIPS_A = {
    "low": "exhaustion is low. Continue with your current sleep and rest routine.",
    "moderate": "There are signs of accumulated fatigue. Take a break, get some rest, and reduce the workload where possible.",
    "high": "The level of exhaustion is high. Talk to someone on the team or a specialist, and don't delay rest.",
}

TIPS_B = {
    "low": "exhaustion is low. Continue with your current sleep and rest routine.",
    "moderate": "There are signs of accumulated fatigue. Take a break, get some rest, and reduce the workload where possible.",
    "high": "The level of exhaustion is high. Talk to someone on the team or a specialist, and don't delay rest.",
}

ORDER = {"low": 0, "moderate": 1, "high": 2}

def calculate_exhaustion(answers):
    a = sum(x["value"] for x in answers if 1 <= x["question_id"] <= 7)
    b = sum(x["value"] for x in answers if 8 <= x["question_id"] <= 14)
    la, lb = level_a(a), level_b(b)
    overall = la if ORDER[la] >= ORDER[lb] else lb
    return {
        "sections": {
            "A": {"score": a, "max_score": SECTION_MAX, "level": la},
            "B": {"score": b, "max_score": SECTION_MAX, "level": lb},
        },
        "level": overall,
        "tips": [TIPS_A[la], TIPS_B[lb]],
    }

"""
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

def calculate(answers):
    totals = {"A": 0, "B": 0, "C": 0}
    for a in answers:
        totals[QUESTION_SECTIONS[a["question_id"]]] += a["value"]
    return {
        "A": {"score": totals["A"], "level": level_a(totals["A"])},
        "B": {"score": totals["B"], "level": level_b(totals["B"])},
        "C": {"score": totals["C"], "level": level_c(totals["C"])},
    } """