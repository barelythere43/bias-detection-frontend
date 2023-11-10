import React, { useEffect, useState } from "react";
import "./App.css";
import GraphPage from "./GraphPage";
import ArticleSelection from "./ArticleSelection";
import { BrowserRouter as Router } from "react-router-dom";
import logo from "./INF-AI-Labs-Logo.png";

function App() {
  const [page, setPage] = useState(1);
  const [selectedArticles, setSelectedArticles] = useState([]);

  useEffect(() => {
    if (page === 1) {
      setSelectedArticles([]);
    }
  }, [page]);

  return (
    <Router>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossOrigin="anonymous"
      />{" "}
      {/* Wrap your App with Router */}
      <nav className="navbar bg-light justify-content-center">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              src={logo}
              alt="Logo"
              width="300"
              height="125"
              className="d-inline-block align-text-top"
            />
          </a>
          <span className="navbar-brand mb-0 h1">
            Article Subjectivity Detector
          </span>
        </div>
      </nav>
      <div className="App">
        <div className="container">
          {page === 1 && (
            <>
              <div className="card">
                <ArticleSelection
                  selectedArticles={selectedArticles}
                  setSelectedArticles={setSelectedArticles}
                />
                <button
                  className="modern-button"
                  disabled={selectedArticles.length === 0}
                  onClick={() => setPage(2)}
                >
                  Plot
                </button>
              </div>
            </>
          )}
          {page === 2 && (
            <GraphPage selectedArticles={selectedArticles} setPage={setPage} />
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
