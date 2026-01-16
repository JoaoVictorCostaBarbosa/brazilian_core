"use client"
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface LoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export default function LoginCard() {
  const { register, handleSubmit } = useForm<LoginData>();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function Login(userData: LoginData) {
    setLoading(true);
    try {
      setErrorMsg("");

      const response = await axios.post<AuthResponse>(
        "http://localhost:8000/api/auth/login",
        userData
      );

      const userInfo = response.data;
      setUser(userInfo);

      Cookies.set("auth_token", userInfo.token, {
        secure: false,
        expires: 1,
        sameSite: "lax",
      });

      router.push("/home");
    } catch {
      setUser(null);
      setErrorMsg("Login não autorizado. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  }

    if(loading){
      return <p className="text-amber-200 bg-white/10 backdrop-blur-xs border-2 outline-none shadow shadow-gray-600 border-white/20 rounded-lg p-10">Carregando...</p>;
    }

    return(
        <div className="w-[30vw] py-20 bg-white/10 backdrop-blur-xs border-2 outline-none shadow shadow-gray-600 border-white/20 rounded-lg flex flex-col justify-center items-center">
            <h1 className='text-5xl plaster-regular text-amber-200'>Login</h1>
            <p className='text-lg text-amber-200 mb-10'>Brazilian Core - A casa de perfumaria do Brasil</p>

          <form onSubmit={handleSubmit((data) => {
              let loginData: LoginData = { email: data.email, password: data.password };
              Login(loginData)
            })} className="flex flex-col">
            <label htmlFor="email" className="text-lg text-amber-200">Email</label>
            <input {...register("email")} placeholder="Email" required className="outline-none border-0 border-b-3 border-amber-200 py-2 pl-2 focus:border-emerald-800 hover:border-emerald-800 transition-colors duration-300 ease-in-out text-amber-200 mb-7"/>
            <label htmlFor="password" className="text-lg text-amber-200">Senha</label>
            <input {...register("password")} placeholder="Senha" required className="outline-none border-0 border-b-3 border-amber-200 py-2 pl-2 focus:border-emerald-800 hover:border-emerald-800 transition-colors duration-300 ease-in-out text-amber-200 mb-7"/>
            <input type="submit" className="bg-amber-200 rounded-md hover:bg-emerald-800 hover:text-amber-100 py-2 transition-colors duration-300 ease-in-out"/>
          </form>
          {errorMsg &&<p className="text-lg text-red-600 mt-4">{errorMsg}</p>}
          <p className="text-amber-200 mt-3">Não possui cadastro? <a href="/sigin" className="text-blue-800 cursor-pointer underline">Cadastre-se</a></p>
        </div>
    )
}
