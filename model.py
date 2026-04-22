import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

np.random.seed(42)
n = 600

data = pd.DataFrame({
    "commits": np.random.randint(50, 500, n),
    "bugs": np.random.randint(5, 150, n),
    "complexity": np.random.randint(1, 10, n),
    "developers": np.random.randint(1, 12, n),
    "coverage": np.random.randint(30, 100, n)
})

data["bugs"] = (data["complexity"] * np.random.randint(4, 12, n)) + np.random.randint(0, 15, n)
data["coverage"] = 100 - (data["complexity"] * np.random.randint(3, 7, n)) + np.random.randint(-5, 5, n)
data["coverage"] = data["coverage"].clip(10, 100)

data["bug_density"] = data["bugs"] / data["commits"]
data["productivity"] = data["commits"] / data["developers"]

def compute_score(bd, cx, cv):
    bd_score = (1 - min(bd, 1)) * 40       
    cx_score = (10 - cx) * 3               
    cv_score = cv * 0.33                

    score = bd_score + cx_score + cv_score
    return int(max(0, min(100, score)))
data["score"] = data.apply(lambda r: compute_score(r["bug_density"], r["complexity"], r["coverage"]), axis=1)

# quantile thresholds (auto calibration)
q_high = float(data["score"].quantile(0.33))
q_low = float(data["score"].quantile(0.66))

def score_to_risk(s):
    if s < q_high:
        return "High"
    elif s < q_low:
        return "Medium"
    return "Low"

data["risk"] = data["score"].apply(score_to_risk)

X = data[["commits","bugs","complexity","developers","coverage","bug_density","productivity"]]
y = data["risk"]

le = LabelEncoder()
y_enc = le.fit_transform(y)

model = RandomForestClassifier(n_estimators=140, random_state=42)
model.fit(X, y_enc)

def predict_quality(commits, bugs, complexity, developers, coverage):
    bug_density = bugs / max(commits, 1)
    productivity = commits / max(developers, 1)

    row = pd.DataFrame([{
        "commits": commits,
        "bugs": bugs,
        "complexity": complexity,
        "developers": developers,
        "coverage": coverage,
        "bug_density": bug_density,
        "productivity": productivity
    }])

    score = compute_score(bug_density, complexity, coverage)
    final_risk = score_to_risk(score)

    reasons = []
    if coverage < 50:
        reasons.append("Low test coverage")
    if bug_density > 0.3:
        reasons.append("High bug density")
    if complexity > 7:
        reasons.append("High code complexity")
    if productivity < 20:
        reasons.append("Low developer productivity")

    return {
        "risk": final_risk,
        "score": score,
        "reasons": reasons,
        "metrics": {
            "bugs": bugs,
            "coverage": coverage,
            "complexity": complexity
        }
    }
