import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import userAPI from "./services/users.api.js";
import CustomSnackBar from "./components/CustomSnackbar.jsx";
import AppNavBar from "./components/AppBar.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import User from "./models/User.js";
import EditContentPage from "./pages/EditContentPage.jsx";
import pagesAPI from "./services/pages.api.js";
import ContentVisualizationPage from "./pages/ContentVisualizationPage.jsx";
import BackOfficePage from "./pages/BackOfficePage.jsx";

function App() {
  const [message, setMessage] = useState("");
  const [isLoggedIn, setLoggedIn] = useState(null);
  const [user, setUser] = useState(new User());
  const [pages, setPages] = useState([]);
  const [pageChanged, setPageChanged] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await userAPI.getUserInfo(); // we have the user info here
        if (!user) return;
        setLoggedIn(true);
        setUser(user);
        setMessage({ text: `Welcome, ${user.username}!`, type: "success" });
      } catch (error) {
        setLoggedIn(false);
      }
    };

    const getAppTitle = async () => {
      try {
        const title = await userAPI.getAppTitle();
        setTitle(title);
      } catch (error) {
        setMessage({ text: "Error getting app title", type: "error" });
      }
    };
    getAppTitle();
    checkAuth();
  }, []);

  useEffect(() => {
    const getPages = async () => {
      try {
        const pages = await pagesAPI.getAllPages();
        setPages(pages);
      } catch (error) {
        setMessage({ text: "Error getting pages", type: "error" });
      }
    };
    getPages();
  }, [isLoggedIn, pageChanged]);

  const handleLogin = async (credentials) => {
    try {
      const user = await userAPI.logIn(credentials);
      setUser(user);
      setLoggedIn(true);
      setMessage({ text: `Welcome, ${user.username}!`, type: "success" });
      return true;
    } catch (err) {
      setMessage({ text: err, type: "error" });
      return false;
    }
  };

  const registerUser = async (credentials) => {
    try {
      const user = await userAPI.registerUser(credentials);
      setLoggedIn(true);
      setMessage({ text: `Welcome, ${user.username}!`, type: "success" });
    } catch (err) {
      console.log(err);
      setMessage({ text: "erro", type: "error" });
    }
  };

  const handleLogout = async () => {
    await userAPI.logOut();
    setLoggedIn(false);
    setUser(new User());
    setMessage({ text: "Logged out", type: "success" });
  };

  const addNewOrEditPage = async (page, urlPath) => {
    try {
      let pageJson;
      if (urlPath === "/page/new") {
        pageJson = await pagesAPI.addNewPage(page);
      } else if (urlPath.includes("/edit")) {
        pageJson = await pagesAPI.editPageById(page);
      }
      if (pageJson) {
        setMessage({
          text: "Page saved successfully",
          type: "success",
        });
        setPageChanged(!pageChanged);
        return true;
      } else {
        setMessage({
          text: "Something went wrong, please try again later",
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
      setMessage({
        text: "Something went wrong, please try again later",
        type: "error",
      });
    }
  };

  const deletePage = async (pageId) => {
    try {
      const hasDeleted = await pagesAPI.deletePageById(pageId);
      if (hasDeleted == true) {
        setMessage({
          text: "Page deleted successfully",
          type: "success",
        });
        setPageChanged(!pageChanged);
      }
    } catch (error) {
      setMessage({
        text: "Something went wrong, please try again later",
        type: "error",
      });
    }
  };

  const updateAppTitle = (title) => {
    try {
      const success = userAPI.updateAppTitle(title);
      if (success) {
        setMessage({
          text: "Title changed successfully",
          type: "success",
        });
        setTitle(title);
      }
    } catch (error) {
      setMessage({
        text: "Error trying to change title",
        type: "error",
      });
    }
  };

  return (
    <BrowserRouter>
      <AppNavBar
        title={title}
        user={user}
        logOut={handleLogout}
        updateAppTitle={updateAppTitle}
      ></AppNavBar>
      <CustomSnackBar message={message}></CustomSnackBar>
      <Routes>
        <Route
          index
          path="/"
          element={<MainPage user={user} pages={pages.publishedPages} />}
        />
        <Route
          path="/back-office"
          element={
            <BackOfficePage
              user={user}
              pages={pages.userPages}
              deletePage={deletePage}
            />
          }
        />
        <Route path="/login" element={<LoginPage login={handleLogin} />} />
        <Route path="/signup" element={<SignUpPage signup={registerUser} />} />
        <Route
          path="/page/new"
          element={
            <EditContentPage
              user={user}
              setMessage={setMessage}
              addNewOrEditPage={addNewOrEditPage}
            />
          }
        />
        <Route
          path="/page/:id/edit"
          element={
            <EditContentPage
              user={user}
              setMessage={setMessage}
              addNewOrEditPage={addNewOrEditPage}
            />
          }
        />
        <Route path="/page/:id" element={<ContentVisualizationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
