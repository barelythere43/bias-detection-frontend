// ArticleSelection.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ArticleSelection.css";
import "font-awesome/css/font-awesome.min.css";

function ArticleSelection({ selectedArticles, setSelectedArticles }) {
  const [articles, setArticles] = useState([]);
  const [articleUrlList, setArticleUrlList] = useState( new Set());
  const navigate = useNavigate();
  const [url, setUrl] = useState("");

  useEffect(() => {
  }, [articles]);

  const fetchArticles = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/articles"); // Absolute URL
      const data = await response.json();
      setArticles(data.articles);
    } catch (error) {
      console.error("Failed fetching articles:", error);
    }
  };
  const handleCheckboxChange = (url) => {

    setSelectedArticles((articles) => {
      if (articles.find(article => article === url)) {
        return articles.filter((articleId) => articleId !== url);
      } else {
        return [...articles, url];
      }
    });
  };

  const handleFetchArticle = (event) => {
    event.preventDefault();
    setArticleUrlList((prevArticleUrls) => new Set(prevArticleUrls.add(url)));
    };

  const handleInputChange = (event) => {
    setUrl(event.target.value);
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
          <div className="card-header">Enter URL or Select Articles from Below</div>
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
          {Array.from(articleUrlList).map((articleUrl) => (
              <div className={`article-item ${articleUrl}`} key={articleUrl}>
                <input
                    type="checkbox"
                    id={`checkbox-${articleUrl}`}
                    title={articleUrl}
                    value={articleUrl}
                    onChange={() => handleCheckboxChange(articleUrl)}
                    className="hidden-checkbox"
                />
                <label
                    htmlFor={`checkbox-${articleUrl}`}
                    className="styled-checkbox"
                ></label>
                <label
                    className="article-label"
                    htmlFor={`checkbox-${articleUrl}`}
                >
                  <div className="article-title">{articleUrl}</div>
                </label>
              </div>
          ))}
        </div>
      </div>
  );
}

export default ArticleSelection;
