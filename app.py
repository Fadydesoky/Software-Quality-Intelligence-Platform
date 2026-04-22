import streamlit as st
import pandas as pd
from model import predict_quality

st.set_page_config(page_title="Software Quality Predictor", layout="wide")

# -------------------------------
# Sidebar controls
# -------------------------------
st.sidebar.title("Controls")

theme = st.sidebar.radio("Theme", ["Dark", "Light"], index=0)

if theme == "Dark":
    bg = "#0e1117"
    fg = "#ffffff"
else:
    bg = "#ffffff"
    fg = "#000000"

st.markdown(f"""
<style>
.stApp {{
    background-color: {bg};
    color: {fg};
}}
</style>
""", unsafe_allow_html=True)

st.title("Software Quality Predictor")

# -------------------------------
# Inputs (main area)
# -------------------------------
c1, c2 = st.columns(2)

with c1:
    commits = st.number_input("Commits", 50, 1000, 200)
    bugs = st.number_input("Bugs", 0, 200, 50)
    developers = st.number_input("Developers", 1, 20, 5)

with c2:
    complexity = st.slider("Complexity", 1, 10, 5)
    coverage = st.slider("Test Coverage (%)", 0, 100, 70)

run = st.button("Predict", use_container_width=True)

# session state for history
if "history" not in st.session_state:
    st.session_state.history = []

# -------------------------------
# Prediction
# -------------------------------
if run:
    result = predict_quality(commits, bugs, complexity, developers, coverage)

    st.subheader("Result")

    if result["risk"] == "High":
        st.error(f"Risk: {result['risk']}")
    elif result["risk"] == "Medium":
        st.warning(f"Risk: {result['risk']}")
    else:
        st.success(f"Risk: {result['risk']}")

    col_a, col_b = st.columns(2)
    with col_a:
        st.metric("Quality Score", f"{result['score']}/100")
    with col_b:
        st.progress(result["score"] / 100)

    st.markdown("Reasons")
    if result["reasons"]:
        for r in result["reasons"]:
            st.write(f"- {r}")
    else:
        st.write("System looks stable")

    # chart
    df = pd.DataFrame({
        "Metric": ["Bugs", "Coverage", "Complexity"],
        "Value": [
            result["metrics"]["bugs"],
            result["metrics"]["coverage"],
            result["metrics"]["complexity"]
        ]
    })
    st.bar_chart(df.set_index("Metric"))

    # save history
    st.session_state.history.append({
        "commits": commits,
        "bugs": bugs,
        "complexity": complexity,
        "developers": developers,
        "coverage": coverage,
        "risk": result["risk"],
        "score": result["score"]
    })

# -------------------------------
# History panel
# -------------------------------
st.divider()
st.subheader("Prediction History")

if st.session_state.history:
    hist_df = pd.DataFrame(st.session_state.history)
    st.dataframe(hist_df, use_container_width=True)

    # comparison
    st.subheader("Compare Scenarios")

    idx = list(range(len(hist_df)))
    c1, c2 = st.columns(2)

    with c1:
        s1 = st.selectbox("Scenario A", idx, index=0)
    with c2:
        s2 = st.selectbox("Scenario B", idx, index=min(1, len(idx)-1))

    if s1 != s2:
        comp = hist_df.loc[[s1, s2], ["bugs", "coverage", "complexity", "score"]]
        st.bar_chart(comp.T)
else:
    st.write("No runs yet")
