SELF_HARM_QUESTION_ID = 8
TOTAL_QUESTIONS = 21
MAX_VALUE = 3

def get_level(score):
    if score <= 13:
        return "minimal"
    if score <= 19:
        return "mild"
    if score <= 28:
        return "moderate"
    return "severe"

LEVEL_TIPS = {
    "minimal": [
        "Symptoms are minimal. Continue with your current routine regarding sleep, activity, and social interaction. Remember, that it is not replacment for professional help if you feel that you need it.",
    ],
    "mild": [
        "There are mild signs of low mood. Add daily physical activity and regular sleep.",
        "Talk to someone on the team or close to you about how you are feeling. Remember, that it is not replacment for professional help if you feel that you need it.",
    ],
    "moderate": [
        "Symptoms are noticeable. Don't face this alone: talk to a doctor, psychologist, or ground support team.",
        "Reduce the workload where possible and maintain a sleep schedule. Remember, that it is not replacment for professional help if you feel that you need it.",
    ],
    "severe": [
        "Symptoms are severe. Please seek immediate help from a doctor or mental health professional.",
        "Inform someone you trust about your situation and don't delay. Remember, that it is not replacment for professional help if you feel that you need it.",
    ],
}

SUPPORT_MESSAGE = (
    "You have indicated that you are thinking about harming yourself. Thank you for being honest. "
    "You don't have to deal with this alone. Please talk to someone you trust, "
    "You should contact a mental health professional or a support line immediately. "
)

def calculate_depression(answers):
    values = {a["question_id"]: a["value"] for a in answers}
    score = sum(values.values())
    level = get_level(score)
    self_harm_alert = values.get(SELF_HARM_QUESTION_ID, 0) >= 1

    result = {
        "score": score,
        "max_score": TOTAL_QUESTIONS * MAX_VALUE,
        "level": level,
        "tips": LEVEL_TIPS[level],
        "self_harm_alert": self_harm_alert,
    }
    if self_harm_alert:
        result["support_message"] = SUPPORT_MESSAGE
    return result