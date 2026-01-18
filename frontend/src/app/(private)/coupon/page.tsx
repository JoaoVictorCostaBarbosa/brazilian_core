import Link from "next/link"
import RenderCoupons from "./components/couponsRendedPage"

export default function couponPage(){

    return(
        <div>
            <div className="h-[7vh] bg-amber-200 grid grid-cols-2 items-center">
                <h1 className='ml-7 text-6xl font-bold text-teal-950 text-center'>Brazilian core</h1>
                <div className="flex justify-end px-4">
                    <Link href={"/home"} className=" max-w-fit text-amber-200 bg-teal-950 py-2 px-4 rounded-lg">Voltar</Link>
                </div>
            </div>
            <RenderCoupons/>

        </div>
    )
}