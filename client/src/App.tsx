import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";
import LenisScroll from "./components/LenisScroll";
import Generate from "./pages/Generate";
import MyGeneration from "./pages/MyGeneration";
import YtPreview from "./pages/YtPreview";
import Login from "./components/Login";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Comunity from "./pages/Comunity";
import AdsGenerate from "./pages/AdsGenerate";
import AdsCommunity from "./pages/AdsCommunity";
import AdsMyGeneration from "./pages/AdsMyGeneration";
import Plans from "./pages/Plans";
import Loading from "./pages/Loading";
import Result from "./pages/Result";

export default function App() {
    const {pathname} = useLocation()
     
    useEffect(()=>{
     window.scrollTo(0,0)
    },[pathname])
    return (
        <>
        <Toaster/>
            <LenisScroll />
            <Navbar />
            <Routes>
                {/* thumbnail Generate */}
                <Route path="/" element={<HomePage />} />
                <Route path="/generate" element={<Generate />} />
                <Route path="/generate/:id" element={<Generate />} />
                <Route path="/my-genration" element={<MyGeneration />} />
                <Route path="/community" element={<Comunity />} />
                <Route path="/preview" element={<YtPreview />} />
                <Route path="/login" element={<Login />} />
                {/* ads Routes */}
                <Route path="/generate-Ads" element={<AdsGenerate />} />
                <Route path="/ads-my-generation" element={<AdsMyGeneration />} />
                <Route path="/ads-community" element={<AdsCommunity />} />
                <Route path="/result/:id" element={<Result />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/loading" element={<Loading />} />
            </Routes>
            <Footer />
        </>
    );
}