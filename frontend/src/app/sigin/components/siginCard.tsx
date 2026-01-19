"use client"
import { useState } from "react";
import { set, useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { User } from "@/app/login/components/loginCard";

interface SiginData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export default function SiginCard(){
    const { register, handleSubmit } = useForm();
    const [data, setData] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<AuthResponse | null>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();

    async function Sigin(userData: SiginData) {
      setLoading(true);
      try {
        setErrorMsg("");
        const response = await axios.post(
          `http://localhost:8000/api/auth/register`,
          {
            name: userData.name,
            email: userData.email,
            password: userData.password,
          }
        );

        let userInfo: AuthResponse = response.data;
        setUser(userInfo);

        if(Cookies.get("auth_token")){
          Cookies.remove("auth_token");
        }

        Cookies.set("auth_token", userInfo.token, {
          secure: false,
          expires: 1,
          sameSite: "lax",
        });

        router.push('/home');

      } catch (error) {
        setUser(null); 
        setErrorMsg("Sigin não autorizado. Verifique suas credenciais.");
      } finally {
        setLoading(false);
      }
    }

    if(loading){
      return <p className="text-amber-200 bg-white/10 backdrop-blur-xs border-2 outline-none shadow shadow-gray-600 border-white/20 rounded-lg p-10">Carregando...</p>;
    }

    return(
        <div className="w-[30vw] py-20 bg-white/10 backdrop-blur-xs border-2 outline-none shadow shadow-gray-600 border-white/20 rounded-lg flex flex-col justify-center items-center">
            <h1 className='text-5xl font-bold text-amber-200'>Cadastro</h1>
            <p className='text-lg text-amber-200 mb-10'>Brazilian Core - A casa de perfumaria do Brasil</p>

          <form onSubmit={handleSubmit((data) => {
              let siginData: SiginData = { name: data.name, email: data.email, password: data.password };
              Sigin(siginData)
            })} className="flex flex-col">
            <label htmlFor="name" className="text-lg text-amber-200">Nome</label>
            <input {...register("name")} placeholder="Nome" required className="outline-none border-0 border-b-3 border-amber-200 py-2 pl-2 focus:border-emerald-800 hover:border-emerald-800 transition-colors duration-300 ease-in-out text-amber-200 mb-7"/>
            <label htmlFor="email" className="text-lg text-amber-200">Email</label>
            <input {...register("email")} placeholder="Email" required className="outline-none border-0 border-b-3 border-amber-200 py-2 pl-2 focus:border-emerald-800 hover:border-emerald-800 transition-colors duration-300 ease-in-out text-amber-200 mb-7"/>
            <label htmlFor="password" className="text-lg text-amber-200">Senha</label>
            <input {...register("password")} placeholder="Senha" required className="outline-none border-0 border-b-3 border-amber-200 py-2 pl-2 focus:border-emerald-800 hover:border-emerald-800 transition-colors duration-300 ease-in-out text-amber-200 mb-7"/>
            <input type="submit" className="bg-amber-200 rounded-md hover:bg-emerald-800 hover:text-amber-100 py-2 transition-colors duration-300 ease-in-out"/>
          </form>
          {errorMsg &&<p className="text-lg text-red-600 mt-4">{errorMsg}</p>}
          <p className="text-amber-200 mt-3">Já possui cadastro? <a href="/login" className="text-blue-800 cursor-pointer underline">Faça login</a></p>
        </div>
    )
}