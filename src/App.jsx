import React from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login"
import SideBar from "./components/SideBar"
import TextEditor from "./components/TextEditor"
import ReviewTab from "./components/ReviewTab"
import PublishTab from "./components/PublishTab"
import DeleteBlogs from "./components/DeleteBlogs"
import UpdateBlogs from "./components/UpdateBlogs"
import ViewBlogs from "./components/ViewBlogs"
import Dashboard from "./pages/Dashboard";
import Home from "./components/Home";
import PrivateRoute from "./routes/PrivateRoutes";



function App() {
  const id = 2;
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="" element={<Dashboard/>}>
        <Route path="/home" element={<Home />} />
          <Route path="/create" element={
            <PrivateRoute>
            <TextEditor />
          </PrivateRoute> } />
          <Route path="/review" element={
            <PrivateRoute>
            <ReviewTab />
          </PrivateRoute> } />
          <Route path="/publish" element={
            <PrivateRoute>
              <PublishTab />
            </PrivateRoute>
          } />
          <Route path="/delete" element={
            <PrivateRoute>
              <DeleteBlogs />
            </PrivateRoute>
          } />
          <Route path="/manage" element={
            <PrivateRoute>
              <UpdateBlogs />
            </PrivateRoute>} />
          <Route path="/view/:id" element={
            <PrivateRoute>
              <ViewBlogs />
            </PrivateRoute>
          } />
          {/* <Route path="/view/:id" element={
            <PrivateRoute>
              <ViewBlogs />
            </PrivateRoute>
          } /> Route for viewing blog by ID */}
        </Route>
        </Routes>
    </Router>
  );
}

export default App
