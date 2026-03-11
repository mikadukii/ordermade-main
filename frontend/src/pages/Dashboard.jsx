import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar"; // ✅ Import Sidebar

const Dashboard = () => {
    return (
        <>
            <Navbar />
            <Sidebar />
        </>
    );
};

export default Dashboard;