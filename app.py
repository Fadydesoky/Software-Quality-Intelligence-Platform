import streamlit as st
from model import predict_quality

st.title("AI Software Quality Predictor")

commits = st.number_input("Commits", 50, 1000)
bugs = st.number_input("Bugs", 0, 200)
complexity = st.slider("Complexity", 1, 10)
developers = st.number_input("Developers", 1, 20)
coverage = st.slider("Test Coverage (%)", 0, 100)

if st.button("Predict"):
    risk, explanation = predict_quality(commits, bugs, complexity, developers, coverage)
    
    st.subheader(f"Risk Level: {risk}")
    st.write("Reasons:")
    
    for e in explanation:
        st.write("-", e)
