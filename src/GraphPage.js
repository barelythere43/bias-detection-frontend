// GraphPage.js
import React, { useEffect, useState } from "react";
import zoomPlugin from "chartjs-plugin-zoom";
import Annotation from "chartjs-plugin-annotation";
import { Scatter } from "react-chartjs-2";
import PlaceIcon from "@mui/icons-material/Place";
import InfinitiveBackground from "./infinitive_background_image.png";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin,
  Annotation,
);

function GraphPage({ selectedArticles, setPage }) {
  const [articlePoints, setArticlePoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const articleColors = ["#FF6384", "#36eb60", "#FFCE56", "#f3aafd", "#9966FF"];

  useEffect(() => {
    if (selectedArticles.length) {
      fetchSelectedArticles();
    } else {
      setArticlePoints([]);
    }
  }, [selectedArticles]);

  const fetchArticleData = async (articleUrlList) => {
    try {
      const response = await fetch('http://localhost:3001/api/databricks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ urls: articleUrlList }) // Send the list of URLs in the request body
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (error) {
      console.error(`Failed to fetch article data`, error);
      return null;
    }
  };

  function handleBackToArticleSelection() {
    setPage(1);
  }


  const fetchSelectedArticles = async () => {
    setIsLoading(true);
    try {
      const response = await fetchArticleData(selectedArticles)

      const points = Object.entries(response.predictions).map(([title, article]) => ({
        x: article.sentiment_score,
        y: article.subjectivity_score,
        label: `Title: ${title}\nPolarity: ${article.sentiment_score}\nSubjectivity: ${article.subjectivity_score}\nSource: ${article.source}`,
      }));

      setArticlePoints(points);
    } catch (error) {
      console.error("Error fetching selected articles", error);
    }
    setIsLoading(false);
  };

  const graphData = {
    datasets: [
      {
        label: "Articles",
        data: articlePoints,
        backgroundColor: articlePoints.map(
          (_, i) => articleColors[i % articleColors.length],
        ),
        pointRadius: 8,
        hoverBackgroundColor: "rgba(255, 255, 255, 0.8)",
        hoverBorderColor: "rgba(255, 255, 255, 1)",
        hoverBorderWidth: 2,
        hoverRadius: 12,
      },
    ],
  };

  const graphOptions = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Polarity (Negative vs Positive Sentiment)",
          font: {
            size: 24,
            family: "Poppins",
            weight: 600,
          },
          color: "#ffffff",
        },
        min: -1,
        max: 1,
        ticks: {
          font: {
            weight: "bold",
          },
          color: "#ffffff",
          stepSize: 0.25,
        },
        grid: {
          color: "transparent",
        },
      },
      y: {
        title: {
          display: true,
          text: "Subjectivity (Opinion vs Fact)",
          font: {
            size: 24,
            family: "Poppins",
            weight: 600,
          },
          color: "#ffffff",
        },
        min: -1,
        max: 1,
        ticks: {
          font: {
            weight: "bold",
          },
          stepSize: 0.2,
          color: "#e5e5e5",
        },
        grid: {
          color: "transparent",
        },
      },
    },
    plugins: {
      title: {
        display: false,
        text: "Article Subjectivity and Polarity",
      },
      legend: {
        display: false,
      },
      tooltip: {
        bodyFont: {
          size: 12,
          family: "Poppins",
          weight: 800,
        },
        callbacks: {
          label: function (context) {
            var label = context.raw.label;
            if (label) {
              // If the label is a single string, split it by the newline character
              // and return the array of strings to create multiline labels.
              return label.split("\n");
            }
            return label || "";
          },
        },
      },
      annotation: {
        annotations: {
          verticalLine: {
            type: "line",
            yMin: 1,
            yMax: -1,
            borderColor: "#ffffff",
            borderWidth: 3,
            borderDash: [10, 5],
            xMin: 0,
            xMax: 0,
          },
          shadedArea: {
            type: "box",
            yMin: -0.333,
            yMax: 0.333,
            xMin: -1,
            xMax: 1,
            backgroundColor: "rgba(99,154,255,0.53)",
            borderDash: [10, 5],
            borderColor: "#020024",
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
      <div>
        {!isLoading ? ( <h2>Article Subjectivity and Polarity</h2>
            ) : null }
        <div className="graph-container">
          {isLoading ? (
              <h2>Loading Inferences...</h2>
          ) : (
              <>
                <Scatter data={graphData} options={graphOptions} />
              </>
          )}
        </div>
        <button className="modern-button" onClick={handleBackToArticleSelection}>
          Back to Article Selection
        </button>
      </div>
  );
}

export default GraphPage;
