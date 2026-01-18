"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { review } from "../parfum/components/reviewCard";
import { getUserReview } from "../../../../api/review";
import RenderUserReviews from "./components/renderUserReviews";

export default function userReview(){
    const [reviews, setReviews] = useState<review[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function getUserReviews() {
        try {
            setLoading(true);
            setError(null);
            const response = await getUserReview();
            if(response.status === 200 ){
                setReviews(response.data);
            }
            console.log(reviews)
        } catch {
            setError("Erro ao buscar review");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserReviews()
    }, [])

    return(
        <div>
            <div className="h-[7vh] bg-amber-200 grid grid-cols-2 items-center">
            <h1 className="ml-7 text-6xl font-extrabold text-teal-950">
            Brazilian core
            </h1>

            <div className="flex justify-end px-4">
            <Link
                href="/home"
                className="text-amber-200 bg-teal-950 py-2 px-4 rounded-lg"
            >
                Voltar
            </Link>
            </div>
        </div>

           
            {loading && <p>Carregando...</p>}
            {reviews.length > 0 ? (<RenderUserReviews reviews={reviews} getReview={getUserReviews}/>) : (<h2 className="text-center text-3xl font-bold mt-10 text-teal-950">Sem reviews no momento</h2>)}
            {error && (
                <span className="text-sm text-red-600 font-medium">
                {error}
                </span>
            )}
           
        </div>
    )
}