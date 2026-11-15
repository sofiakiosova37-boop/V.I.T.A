
TIP_RULES = [
    (lambda d: d["hours"] < 7, "You are sleeping less than 7 hours, which has a negative impact on your health. Try dimming the lights half an hour before bedtime and putting away all electronic devices."),
    (lambda d: d["hours"] > 10, "You might be sleeping too long. Consult with your doctor and try to maintain a consistent sleep schedule."),
    (lambda d: d["minutes_to_fall_asleep"] > 30, "You take a long time to fall asleep. Try to create a relaxing bedtime routine. Dim the lights, avoid using gadgets, and try taking melatonin half an hour before going to bed."),
    (lambda d: d["night_awakenings"] >= 2, "You wake up frequently during the night. Check the temperature, noise, and lighting in your bedroom."),
    (lambda d: d["devices_before_bed"], "Remove electronic devices from your bedroom at least 30 minutes before sleep."),
    (lambda d: d["food_or_caffeine"], "Avoid eating heavy meals or consuming caffeine within 3-4 hours of bedtime."),
    (lambda d: d["bright_light"], "Dim the lights or use a sleep mask."),
    (lambda d: d["noise"], "Try earplugs or white noise."),
    (lambda d: d["temperature"], "Adjust the temperature in your bedroom for comfort."),
    (lambda d: d["rested"] <= 2 and d["hours"] >= 7, "You are getting enough sleep, but not feeling rested. If this persists for several days, consider taking a break from your routine or consult with your doctor."),
]

def build_tips(d):
    tips = [text for condition, text in TIP_RULES if condition(d)]
    return tips[:4] or ["Great sleep! Keep up the good work."]

def duration_points(hours):
    for low, high, pts in [(7, 9, 40), (6, 10, 30), (5, 99, 20), (4, 99, 10)]:
        if low <= hours <= high:
            return pts
    return 0

def calculate_sleep(d):
    latency = 10 if d["minutes_to_fall_asleep"] <= 15 else 7 if d["minutes_to_fall_asleep"] <= 30 else 3 if d["minutes_to_fall_asleep"] <= 60 else 0
    awake = {0: 5, 1: 3, 2: 1}.get(d["night_awakenings"], 0)
    score = (
        duration_points(d["hours"])
        + round((d["quality"] - 1) / 4 * 25)
        + round((d["rested"] - 1) / 4 * 20)
        + latency
        + awake
    )
    zone = "good" if score >= 70 else "attention" if score >= 40 else "poor"
    return {"score": score, "zone": zone, "tips": build_tips(d)}