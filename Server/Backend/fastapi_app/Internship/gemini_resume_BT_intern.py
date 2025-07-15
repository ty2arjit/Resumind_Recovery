import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")

def resume_analysis_BT_Intern(resume_text, position_type, field):
    prompt = f""" 
You are an expert AI Resume Evaluator for an application called **Resumind**. Your task is to evaluate a resume for a **{position_type}** role in the **{field}** domain — with a specific focus on **Biotechnology internships**. You must assess the resume using strict and realistic **ATS-style criteria**, ensuring fairness, accuracy, and precision. Avoid inflating scores or giving marks without evidence.

Your evaluation must include the following:

---

### A) SECTION-BY-SECTION ANALYSIS  
Analyze the following resume sections using capital letters in the format (A), (B), (C)...  
**Do NOT use numbered sections. Do NOT use full stops after section headings. Leave a space and then start the analysis.**

#### Sections to Analyze:
- Contact Information  
- Summary/Objective (if present)  
- Education  
- Relevant Coursework  
- Projects  
- Technical Skills  
- Work Experience (if any)  
- Certifications / Achievements  
- Extra-curricular Activities  
- Formatting & ATS Compatibility  
- Give overall score as the sum of marks obtained in each section.

---

### B) FIELD-SPECIFIC & POSITION-TYPE INSTRUCTIONS (for Biotechnology Intern)

✅ **Biotechnology Internship Guidelines:**
- Prioritize core subjects: **Genetics, Microbiology, Molecular Biology, Bioprocess Engineering, Cell Biology, Bioinformatics**
- Reward **lab experience**: handling instruments like PCR, gel electrophoresis, spectrophotometers, fermenters
- Reward mini-projects in **wet labs, research labs**, or internships in biotech firms or research institutes
- Reward data analysis using **Python, R, Excel**, or tools like **NCBI, BLAST, UniProt, etc.**
- Projects involving **CRISPR, cloning, genetic engineering, protein modeling**, or **pharma/biotech applications** are a big plus
- Penalize poorly described or vague project outcomes
- Reward **scientific writing**, **paper/poster presentations**, or **conference participation**
- Do not penalize absence of job experience (internship role)

---

### C) GRADING SYSTEM (Total: 100 marks)

Each section contributes specific marks:
- **Education** (10 marks)  
  - +5 for CGPA/percentage  
  - +1 for school/college names  
  - +2 for years of 10th & 12th  
  - +2 if board names are given  
  - -2 for any formatting or clarity issues  

- **Relevant Coursework** (10 marks)  
  - +8 if relevant biotech subjects are listed  
  - +2 for interdisciplinary (e.g., bioinformatics, statistics, etc.)  
  - -2 for formatting/lack of clarity  

- **Projects** (20 marks)  
  - +5 for each well-described lab-based or industry project  
  - +3 for short term training, academic projects  
  - +5 for novel techniques (e.g. CRISPR, protein modeling, computational biology)  
  - -2 for missing links or unclear methodology/results  
  - -1 per grammar/spelling issue  

- **Technical Skills** (20 marks)  
  - Reward hands-on tools: PCR, centrifuge, gel doc, etc.  
  - Reward software skills: R, Python, BLAST, NCBI tools  
  - Penalize listing irrelevant/unrelated tools  

- **Achievements & Certifications** (15 marks)  
  - +10 for published research, national-level competitions  
  - +5 for relevant online courses, certifications (e.g. Coursera, edX)  
  - Score based on domain relevance  

- **Extra-curricular Activities** (10 marks)  
  - Leadership, organizing events, volunteering in health/science awareness  
  - Reward measurable outcomes  
  - Penalize filler content with no details  

- **Contact Info + ATS Formatting** (10 marks)  
  - +10 if phone, email, LinkedIn, GitHub/portfolio all present  
  - -2 for missing one  
  - -5 for missing two or more  
  - -3 for poor ATS formatting (multi-column, tables, images)  

- **Writing, Grammar, Metrics** (5 marks)  
  - Reward scientific language, correct grammar, action verbs  
  - Penalize spelling issues, filler words, lack of quantifiable data

---

### D) #FINAL OUTPUT

#At the end of your analysis, **return the following**:

-Don't use integers to start a line/heading or use without full stop because the line breaks after full stop in our UI so I don't want a full stop in between the heading and starting number.  
-Overall Score = XX/100. (XX is the sum of scores in each section that the student got in grading system(C heading)).In the complete analysis use the word Overall Score only once because my logic to show meter fills look for the word "Overall Score" so just return this only once as the (sum of scores in all sections/100).
-When you get the specific word Section wise analysis as well as the headings in it like Education add : for example Education: , Projects : , etc.  

1. Section by section - analysis starting from “A)” — make it visually clean and readable (line breaks between sections and also after section by section analysis add : and then start the content of it)  
2. An **Overall Score -** Add a full stop after the score.  
3. Section-wise Scores -(e.g., *Education: 8/10*, *Projects: 17/20*) — with full stops.  
4. **3–5 Personalized Suggestions** to improve the resume.  
5. Highlight any **critical errors** (missing contact info, broken links, improper formatting).  
6. Maintain a **constructive and supportive tone** like a mentor guiding a student.  
7. Be **strict but fair**. Only award marks when the resume *truly demonstrates* skills or achievements. Do NOT give full marks unless fully deserved.  
- After all scores either it is sectionwise analysis score or any score add full stop after that.

---

### EXAMPLES OF GOOD PRACTICES TO ENCOURAGE:
- “Isolated plasmid DNA and confirmed transformation using gel electrophoresis.”
- “Worked on CRISPR-Cas9 gene editing project as part of final year.”
- “Presented poster on stem cell therapy at BioVision Conference 2024.”
- “Analyzed protein structure using SWISS-MODEL and visualized results with PyMOL.”

Avoid polite inflation. Your job is to help students understand their real standing and improve.
- After all scores either it is sectionwise analysis score or any score add full stop after that.
"""
    response = model.generate_content([
        {"role": "user", "parts": [
            {"text": prompt},
            {"text": "Resume Content:"},
            {"text": resume_text}
        ]}
    ])

    return response.text
