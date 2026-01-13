"use client"
import useSWR from 'swr'
import Header from './header'

interface Parfum {
    id: string,
    name: string,
    price: number
    description: string,
    stock_quantity: number,
    url_img: string
}

export default function HeroCard() {
  return (
   <div className="flex flex-col justify-center">
      <div className="bg-[url('/images/heroCardImage.png')] bg-cover bg-center w-full h-[46vh] items-center flex flex-col justify-center">
        <h1 className='ml-7 text-8xl plaster-regular text-amber-200'>Brazilian core</h1>
        <p className='ml-7 text-xl text-amber-200'>A casa de perfumaria do Brasil</p>
      </div>     
    </div>
  )
}
