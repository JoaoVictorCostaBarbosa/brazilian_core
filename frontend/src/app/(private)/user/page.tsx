import UserCard from "./components/userCard"
import Link from "next/link"

export default function userSection(){
    return(
        <div className=" text-amber-200">
            <div className="h-[7vh] bg-amber-200 grid grid-cols-2 items-center">
                <h1 className='ml-7 text-6xl plaster-regular text-teal-950 text-center'>Brazilian core</h1>
                <div className="flex justify-end px-4">
                    <Link href={"/home"} className=" max-w-fit text-amber-200 bg-teal-950 py-2 px-4 rounded-lg">Voltar</Link>
                </div>
            </div>
            <div className="bg-[url('/images/heroCardImage.png')] bg-cover bg-center flex justify-center items-center h-[93vh]"><UserCard/></div>
        </div>
    )
}