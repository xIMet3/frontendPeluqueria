import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home } from "../Home/Home";
import { Register } from "../Register/Register";
import Login from "../Login/Login";
import { PanelUsuario } from "../PanelUsuario/PanelUsuario";


export const Body = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/panelUsuario" element={<PanelUsuario />} />
            </Routes>
        </>
    )
}