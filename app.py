import streamlit as st
import pandas as pd
from model import predict_quality

st.set_page_config(page_title="Software Quality Predictor", layout="wide")

theme = st.sidebar.radio("Theme", ["Dark", "Light"], index=0)

if theme == "Dark":
    bg = "#0e1117"
    fg = "#ffffff"
    card = "rgba(255,255,255,0.05)"
else:
    bg = "#f5f7fa"
    fg = "#111111"
    card = "#ffffff"

st.markdown(f"""
<style>
.stApp {{
    background-color: {bg};
    color: {fg};
}}
.block-container {{
    max-width: 1100px;
    padding-top: 2rem;
}}
.card {{
    padding: 18px;
    border-radius: 14px;
    background: {card};
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    margin-bottom: 16px;
}}
button[kind="primary"] {{
    border-radius: 10px;
    height: 44px;
    font-weight: 600;
}}
</style>
""", unsafe_allow_html=True)

st.title("Software Quality Predictor")

col1, col2 = st.columns(2)

with col1:
    commits = st.number_input("Commits", 50, 1000, 200)
    bugs = st.number_input("Bugs", 0, 200, 50)
    developers = st.number_input("Developers", 1, 20, 5)

with col2:
    complexity = st.slider("Complexity", 1, 10, 5)
    coverage = st.slider("Test Coverage (%)", 0, 100, 70)

run = st.button("Predict", use_container_width=True)

if "history" not in st.session_state:
    st.session_state.history = []

if run:
    result = predict_quality(commits, bugs, complexity, developers, coverage)

    if result["risk"] == "High":
        st.markdown(f'<div class="card" style="border-left:5px solid #ff4b4b;"><h3>Risk: {result["risk"]}</h3></div>', unsafe_allow_html=True)
    elif result["risk"] == "Medium":
        st.markdown(f'<div class="card" style="border-left:5px solid #ffa500;"><h3>Risk: {result["risk"]}</h3></div>', unsafe_allow_html=True)
    else:
        st.markdown(f'<div class="card" style="border-left:5px solid #00c853;"><h3>Risk: {result["risk"]}</h3></div>', unsafe_allow_html=True)

    col_a, col_b = st.columns(2)

    with col_a:
        st.markdown(f'<div class="card"><h4>Quality Score</h4><h2>{result["score"]}/100</h2></div>', unsafe_allow_html=True)

    with col_b:
        st.progress(result["score"] / 100)

    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.subheader("Reasons")
    if result["reasons"]:
        for r in result["reasons"]:
            st.write(f"- {r}")
    else:
        st.write("System looks stable")
    st.markdown('</div>', unsafe_allow_html=True)

    df = pd.DataFrame({
        "Metric": ["Bugs", "Coverage", "Complexity"],
        "Value": [
            result["metrics"]["bugs"],
            result["metrics"]["coverage"],
            result["metrics"]["complexity"]
        ]
    })

    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.subheader("Metrics")
    st.bar_chart(df.set_index("Metric"))
    st.markdown('</div>', unsafe_allow_html=True)

    st.session_state.history.append({
        "commits": commits,
        "bugs": bugs,
        "complexity": complexity,
        "developers": developers,
        "coverage": coverage,
        "risk": result["risk"],
        "score": result["score"]
    })

st.subheader("History")

if st.session_state.history:
    hist_df = pd.DataFrame(st.session_state.history)
    st.dataframe(hist_df, use_container_width=True)

    idx = list(range(len(hist_df)))
    col1, col2 = st.columns(2)

    with col1:
        s1 = st.selectbox("Scenario A", idx, index=0)

    with col2:
        s2 = st.selectbox("Scenario B", idx, index=min(1, len(idx)-1))

    if s1 != s2:
        comp = hist_df.loc[[s1, s2], ["bugs", "coverage", "complexity", "score"]]
        st.bar_chart(comp.T)
else:
    st.write("No runs yet")
