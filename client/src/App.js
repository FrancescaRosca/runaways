// import React, { useState } from "react";
import "./App.css";
import Chat from "./components/Chat";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./components/Landing";
import Dashboard from "./components/Dashboard";
import About from "./components/About";
import SignUp from "./components/SignUp";
import Profile from "./components/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
