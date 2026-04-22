import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# -------------------------------
# Generating realistic dataset
# -------------------------------
np.random.seed(42)
n = 500

data = pd.DataFrame({
    "commits": np.random.randint(50, 500, n),
    "bugs": np.random.randint(5, 150, n),
    "complexity": np.random.randint(1, 10, n),
    "developers": np.random.randint(1, 10, n),
    "coverage": np.random.randint(30, 100, n)
})

data["bugs"] = (data["complexity"] * np.random.randint(5, 15, n)) + np.random.randint(0, 20, n)
data["coverage"] = 100 - (data["complexity"] * np.random.randint(3, 8, n)) + np.random.randint(-5, 5, n)
data["coverage"] = data["coverage"].clip(10, 100)

# -------------------------------
# Feature Engineering
# -------------------------------
data["bug_density"] = data["bugs"] / data["commits"]
data["productivity"] = data["commits"] / data["developers"]

data["risk_score"] = (
    data["bug_density"] * 0.5 +
    data["complexity"] * 0.3 -
    data["coverage"] * 0.2
)

def classify_risk(score):
    if score < -5:
        return "Low"
    elif score < 0:
        return "Medium"
    else:
        return "High"

data["risk"] = data["risk_score"].apply(classify_risk)

# -------------------------------
# Model Training
# -------------------------------
X = data.drop(["risk", "risk_score"], axis=1)
y = data["risk"]

le = LabelEncoder()
y_encoded = le.fit_transform(y)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y_encoded)

# -------------------------------
# Prediction Function
# -------------------------------
def predict_quality(commits, bugs, complexity, developers, coverage):
    bug_density = bugs / max(commits, 1)
    productivity = commits / max(developers, 1)

    input_df = pd.DataFrame([{
        "commits": commits,
        "bugs": bugs,
        "complexity": complexity,
        "developers": developers,
        "coverage": coverage,
        "bug_density": bug_density,
        "productivity": productivity
    }])

    prediction = model.predict(input_df)
    model_risk = le.inverse_transform(prediction)[0]

    # Hybrid Logic
    if coverage < 50 and bug_density > 0.3:
        final_risk = "High"
    elif coverage < 60:
        final_risk = "Medium"
    else:
        final_risk = model_risk

    # Quality Score (0–100)
    score = int(
        max(0, min(100, 100 - (
            bug_density * 100 +
            complexity * 5 -
            coverage * 0.7
        )))
    )

    # Explanation
    explanation = []

    if coverage < 50:
        explanation.append("Low test coverage increases risk")
    if bug_density > 0.3:
        explanation.append("High bug density detected")
    if complexity > 7:
        explanation.append("High code complexity")
    if productivity < 20:
        explanation.append("Low developer productivity")

    return final_risk, explanation, score
