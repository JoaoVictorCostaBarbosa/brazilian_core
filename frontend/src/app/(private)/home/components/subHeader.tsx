import Image from 'next/image'

export default function SubHeader(){
    return(
        <div className="w-full h-[40vh] bg-amber-200 grid grid-cols-2 items-center justify-center shadow-lg shadow-amber-200">
           <div className='flex justify-center'>
            <Image
                src="/images/parfum.png"
                width={400}
                height={500}
                alt='parfum'
            />
           </div>
           <div className='flex flex-col'>
            <p className='text-4xl font-medium text-teal-950'>
                Novo <span className=' font-bold inline-block px-2 py-1 bg-linear-to-r  from-emerald-400 to-emerald-700 text-transparent bg-clip-text'>EKos de Natura®</span>, sinta o frescor da Amazônia!
            </p>
            <p>Apenas R$299,90</p>
           </div>
        </div>
    )
}