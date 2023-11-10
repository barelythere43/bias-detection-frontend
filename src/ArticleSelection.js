// ArticleSelection.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ArticleSelection.css";
import "font-awesome/css/font-awesome.min.css";

function ArticleSelection({ setSelectedArticles }) {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();
  const [url, setUrl] = useState("");

  useEffect(() => {
    console.log(articles);
  }, [articles]);

  const fetchArticles = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/articles"); // Absolute URL
      const data = await response.json();
      console.log(data);
      setArticles(data.articles);
    } catch (error) {
      console.error("Failed fetching articles:", error);
    }
  };
  const handleCheckboxChange = (title) => {
    setSelectedArticles((prev) => {
      if (prev.includes(title)) {
        return prev.filter((articleId) => articleId !== title);
      } else {
        return [...prev, title];
      }
    });
  };

  const handleFetchArticle = (event) => {
    event.preventDefault();
    console.log(url);
    // if (!articleUrl.trim()) {
    //   return;
    // }
    fetch(
      `http://localhost:3001/api/articles/by-url?url=${encodeURIComponent(
        url,
      )}`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setArticles((prevArticles) => [...prevArticles, data.article]);
        console.log(articles);
      })
      .catch((err) => {});
  };

  const handleInputChange = (event) => {
    setUrl(event.target.value);
    console.log(url);
  };

  function getIconForCategory(category) {
    switch (category) {
      case "Technology":
        return "fa-laptop";
      case "Politics":
        return "fa-university";
      case "Sports":
        return "fa-soccer-ball-o";
      default:
        return "fa-newspaper-o";
    }
  }

  const handlePlot = () => {
    navigate("/graph");
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-header">Select Articles</div>
      </div>
      <div className="card-body">
        <form onSubmit={handleFetchArticle}>
          <div className="form-group">
            <label htmlFor="url">Enter URL:</label>
            <input
              type="url"
              id="url"
              name="url"
              value={url}
              onChange={handleInputChange}
              placeholder="https://example.com"
              pattern="https?://.*"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
      <div className="articles-container">
        {articles.map((article) => (
          <div className={`article-item ${article.category}`} key={article.id}>
            <input
              type="checkbox"
              id={`checkbox-${article.title}`}
              title={article.title}
              value={article.title}
              onChange={() => handleCheckboxChange(article.title)}
              className="hidden-checkbox"
            />
            <label
              htmlFor={`checkbox-${article.title}`}
              className="styled-checkbox"
            ></label>
            <label
              className="article-label"
              htmlFor={`checkbox-${article.title}`}
            >
              <div className="article-title">{article.title}</div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArticleSelection;
