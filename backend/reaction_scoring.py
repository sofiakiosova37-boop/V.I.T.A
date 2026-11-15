from statistics import mean, median

def level_by_average(avg):
    if avg <= 250:
        return "good"
    if avg <= 300:
        return "attention"
    return "slow"

def calculate_reaction(attempts, previous_avgs):
    avg = round(mean(attempts))
    best = min(attempts)
    worst = max(attempts)
    spread = worst - best
    level = level_by_average(avg)

    trend = None
    baseline = None
    if len(previous_avgs) >= 3:
        baseline = round(median(previous_avgs[-7:]))
        if avg > baseline * 1.15:
            trend = "slower"
        elif avg < baseline * 0.9:
            trend = "faster"
        else:
            trend = "stable"

    tips = []
    if trend == "slower":
        tips.append("Reaction is slower than your usual. Possible reasons: fatigue or lack of sleep. Check your sleep patterns over the last few days.")
    if level == "slow":
        tips.append("Reaction is slowed down. Take a break, drink water, and repeat the test after resting.")
    if spread > 150:
        tips.append("Results differ significantly from attempt to attempt. This often happens when concentration is reduced.")
    if trend == "faster":
        tips.append("Reaction is faster than your usual. This is a good sign.")
    if not tips:
        tips.append("Reaction is normal. Continue your sleep and rest routine.")

    return {
        "attempts": attempts,
        "avg_ms": avg,
        "best_ms": best,
        "worst_ms": worst,
        "spread_ms": spread,
        "level": level,
        "baseline_ms": baseline,
        "trend": trend,
        "tips": tips,
    }