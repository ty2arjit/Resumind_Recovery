import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import styles from "./ResultDisplay.module.css";
import { motion } from "framer-motion";

const wrapLine = (text, wordLimit = 15) => {
  const words = text.split(" ");
  const lines = [];
  for (let i = 0; i < words.length; i += wordLimit) {
    lines.push(words.slice(i, i + wordLimit).join(" "));
  }
  return lines;
};

const ResultDisplay = ({ resultText }) => {
  if (!resultText) return null;

  // Clean and preprocess the raw result
  const cleanedText = resultText
    .replace(/\*+/g, "") // Remove stars
    .replace(/•/g, "") // Remove bullets
    .replace(/ +/g, " ") // Normalize spacing
    .replace(/\n+/g, " ") // Remove random newlines
    .replace(/(?<=\w[.?!]) (?=[A-Z])/g, "\n") // Add line breaks after proper sentence endings
    .replace(/ +\n/g, "\n") // Remove space before newline
    .replace(/\n +/g, "\n") // Remove space after newline
    .trim();

  // Step 1: Split raw lines
  const rawLines = cleanedText.split("\n").map(line => line.trim()).filter(line => line);

  // Step 2: Merge broken numbered points (like "7." followed by its sentence)
  const lines = [];
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const nextLine = rawLines[i + 1] || "";

    // Merge if line is only a number with a dot like "6." or "7."
    if (/^\d+\.$/.test(line) && nextLine) {
      lines.push(`${line} ${nextLine}`);
      i++; // Skip next line since it's merged
    } else {
      lines.push(line);
    }
  }

  // Extract overall score
  const getScore = () => {
    const scoreLine = lines.find((line) => line.includes("Overall Score"));
    return parseInt(scoreLine?.match(/\d+/)?.[0]) || 0;
  };

  const OverallScore = getScore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className={styles.container}
    >
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.studentName}>Analysis Report: </h2>
        <div className={styles.scoreMeter}>
          <div className={styles.meterBar}>
            <div
              className={styles.meterFill}
              style={{
                width: `${OverallScore}%`,
                backgroundColor:
                  OverallScore >= 80
                    ? "#16a34a"
                    : OverallScore >= 60
                    ? "#eab308"
                    : "#dc2626",
              }}
            />
          </div>
          <span className={styles.scoreText}>
            Overall Score: {OverallScore}/100
          </span>
        </div>
      </div>

      {/* Section-wise Analysis */}
      <div className={styles.analysisBody}>
        {lines.map((line, index) => {
          const isSectionHeader = /^[0-9]+\.\s|^[A-G]\)/.test(line);
          const isFinalSuggestions = /Final Suggestions/i.test(line);
          const isFieldInsights = /Field-Specific Insights/i.test(line);

          if (isSectionHeader) {
            return (
              <h3 key={index} className={styles.sectionHeader}>
                {line.trim()}
              </h3>
            );
          } else if (isFinalSuggestions || isFieldInsights) {
            return (
              <h2 key={index} className={styles.specialHeading}>
                {line.trim()}
              </h2>
            );
          } else {
            const wrappedLines = wrapLine(line);
            return wrappedLines.map((subline, i) => (
              <h4 key={`${index}-${i}`} className={styles.pointText}>
                {i === 0 ? (
                  <>
                    <FaCheckCircle className={styles.icon} /> {subline}
                  </>
                ) : (
                  subline
                )}
              </h4>
            ));
          }
        })}
      </div>
    </motion.div>
  );
};

export default ResultDisplay;
