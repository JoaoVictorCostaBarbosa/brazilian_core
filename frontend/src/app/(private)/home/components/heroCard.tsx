export default function HeroCard() {
  return (
   <div className="flex flex-col justify-center">
      <div className="bg-[url('/images/heroCardImage.png')] bg-cover bg-center w-full h-[56vh] items-center flex flex-col justify-center">
        <h1 className='ml-7 text-9xl font-extrabold inline-block px-2 py-1 bg-linear-to-r from-emerald-400 to-emerald-700 text-transparent bg-clip-text border-b-4 border-emerald-900'>Brazilian core</h1>
        <p className='ml-7 text-xl text-emerald-400'>A casa de perfumaria do Brasil</p>
      </div>     
    </div>
  )
}
