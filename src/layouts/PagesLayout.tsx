import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const PagesLayout: React.FC = () => {
    return (
        <div>
            <Header />
            <main className="">
                <Outlet />
            </main>

            <Footer/>
        </div>
    )
}

export default PagesLayout