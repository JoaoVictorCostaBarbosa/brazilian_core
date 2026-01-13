import Image from 'next/image'

export default function SubHeader(){
    return(
        <div className="w-full h-[50vh] bg-amber-200 grid grid-cols-2 items-center justify-center shadow-lg shadow-amber-200">
           <div>
            <Image
                src="/images/parfum.svg"
                width={500}
                height={500}
                alt='lala'
            />
           </div>
           <div>rvub4çrvuro</div>
        </div>
    )
}