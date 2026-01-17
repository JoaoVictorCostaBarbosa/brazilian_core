"use client";
import HeroCard from "./components/heroCard";
import { useEffect, useState } from "react";
import getProducts from "../../../../api/getAllProducts";
import SubHeader from "./components/subHeader";
import RenderParfum from "./components/renderParfum";
import Header from "./components/header";
import { Parfum } from "./components/cart/cart";


export default function HeroSection() {
  const [parfum, setParfum] = useState<Parfum[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const LIMIT = 7;
  
  async function getParfum(page: number) {

    try {
      const start = (page - 1) * LIMIT;
      const end = start + LIMIT - 1;

      const products = await getProducts(start, end);
      setParfum(products);
    } catch (error) {
      console.error("Error fetching parfums:", error);
    }
  }

  

  useEffect(() => {
    getParfum(currentPage);
  }, [currentPage]);

  return (
    <div>
      <Header setParfum={setParfum} />
      <HeroCard />
      <SubHeader />

      <RenderParfum
        parfum={parfum}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
