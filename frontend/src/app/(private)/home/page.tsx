"use client"
import HeroCard from "./components/heroCard";
import { useEffect } from "react";
import { useState } from "react";
import getProducts from "../../../../api/getAllProducts";
import SubHeader from "./components/subHeader";
import RenderParfum from "./components/renderParfum";
import Header from "./components/header";

interface Parfum {
    id: string,
    name: string,
    price: number
    description: string,
    stock_quantity: number,
    url_img: string
}

export default function HeroSection() {
    const [parfum, setParfum] = useState<Parfum[]>([]);
    const [cartItems, setCartItems] = useState<Parfum[]>([])
    

    async function getParfum() {
        try {
        const products = await getProducts();

        setParfum(products);
        } catch (error) {
        console.error("Error fetching parfums:", error);
        }
    }

    useEffect(() => {
        getParfum();
    }, []);


    return(
        <div>
            <Header setParfum={setParfum}/>
            <HeroCard/>
            <SubHeader/>
            <RenderParfum parfum={parfum}/>
        </div>
    )
}