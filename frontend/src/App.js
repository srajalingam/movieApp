import { useCallback, useEffect, useRef, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Alert from "./components/Alert";

function App() {
  const [jwtToken, setJwtToken] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertClassName, setAlertClassName] = useState("d-none");

  const intervalRef = useRef(null);

  const navigate = useNavigate();

  // -----------------------------------------
  // Start refresh timer
  // -----------------------------------------
  const startRefreshTimer = useCallback(() => {
    if (intervalRef.current) {
      // Already running
      return;
    }

    console.log("Starting refresh timer...");

    intervalRef.current = setInterval(() => {
      console.log("Refreshing access token...");
      makeRefreshToken();
    }, 60 * 1000);
  }, []);

  // -----------------------------------------
  // Stop refresh timer
  // -----------------------------------------
  const stopRefreshTimer = useCallback(() => {
    if (intervalRef.current) {
      console.log("Stopping refresh timer...");

      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // -----------------------------------------
  // Refresh access token
  // -----------------------------------------
  const makeRefreshToken = useCallback(() => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };

    fetch("/refresh", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.access_token) {
          console.log("Received new access token");

          setJwtToken(data.access_token);

          // Start timer only once
          startRefreshTimer();
        } else {
          console.log("No access token returned");
          stopRefreshTimer();
        }
      })
      .catch((error) => {
        console.log("Refresh failed:", error);

        stopRefreshTimer();
      });
  }, [startRefreshTimer, stopRefreshTimer]);

  // -----------------------------------------
  // Logout
  // -----------------------------------------
  const logOut = () => {
    const requestOptions = {
      method: "GET",
      credentials: "include",
    };

    fetch("/logout", requestOptions)
      .catch((error) => {
        console.log("Logout error:", error);
      })
      .finally(() => {
        stopRefreshTimer();
        setJwtToken("");
        navigate("/login");
      });
  };

  // -----------------------------------------
  // Check login when app loads
  // -----------------------------------------
  useEffect(() => {
    makeRefreshToken();

    // Cleanup when App unmounts
    return () => {
      stopRefreshTimer();
    };
  }, [makeRefreshToken, stopRefreshTimer]);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1 className="mt-3">Go watch a movie</h1>
        </div>

        <div className="col text-end">
          {jwtToken === "" ? (
            <Link to="/login">
              <span className="badge bg-success">Login</span>
            </Link>
          ) : (
            <a href="#!" onClick={logOut}>
              <span className="badge bg-danger">Logout</span>
            </a>
          )}
        </div>

        <hr className="mb-3" />
      </div>

      <div className="row">
        <div className="col-md-2">
          <nav>
            <div className="list-group">
              <Link to="/" className="list-group-item list-group-item-action">
                Home
              </Link>

              <Link
                to="/movies"
                className="list-group-item list-group-item-action"
              >
                Movies
              </Link>

              <Link
                to="/genres"
                className="list-group-item list-group-item-action"
              >
                Genres
              </Link>

              {jwtToken !== "" && (
                <>
                  <Link
                    to="/admin/movie/0"
                    className="list-group-item list-group-item-action"
                  >
                    Add Movie
                  </Link>

                  <Link
                    to="/manage-catalogue"
                    className="list-group-item list-group-item-action"
                  >
                    Manage Catalogue
                  </Link>

                  <Link
                    to="/graphql"
                    className="list-group-item list-group-item-action"
                  >
                    GraphQL
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>

        <div className="col-md-10">
          <Alert
            message={alertMessage}
            className={alertClassName}
          />

          <Outlet
            context={{
              jwtToken,
              setJwtToken,
              setAlertClassName,
              setAlertMessage,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default App;