'use client'

import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import { useForm } from 'react-hook-form';

interface formsResponse {
    name?: string;
    email?: string;
    password?: string;
}

export default function UserCard() {
  const { currUser, getUser, updateName, updateEmail, updatePassword } = useUser();
  const [edit, setEdit] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<formsResponse>();

  useEffect(() => {
    getUser();
  }, []);

  const onSubmit = async (data: formsResponse) => {
    if (!data.name && !data.email && !data.password) {
        setEdit(false);
        return
    };
    
    let userBuffer = {
        name: currUser?.name,
        email: currUser?.email
    }

    if (data.name) await updateName(data.name);
    if (data.email) await updateEmail(data.email);

    let updatePass = false
    if (data.password) {
        await updatePassword(data.password);
        updatePass = true
    }

    setEdit(false);
    getUser();

    if(currUser?.name != userBuffer.name || currUser?.email != userBuffer.email || updatePass){
        setSuccess(true);
        setTimeout(() => {
        setSuccess(false);
        }, 2000);}
  };

  return (
    <div className="w-full max-w-md rounded-3xl shadow-lg p-8 flex flex-col bg-amber-200">

    <div className="grid grid-cols-8 w-full mb-3">
        <div className="w-16 h-16 col-span-2 row-end-2 rounded-full bg-teal-950 flex justify-center items-center text-2xl font-bold">
            {currUser?.name[0]}
        </div>
        <div className="col-span-6 flex flex-col justify-center">
            <div>
                <h2 className="text-teal-950 w-full text-lg font-bold">
                    Olá {currUser?.name}
                </h2>
            </div>
            <div>
                <h2 className="text-teal-950 ">
                    Wellcome ao melhor da perfumaria!
                </h2>
            </div>
        </div>
    </div>

    <div className="w-full h-px bg-teal-950"></div>


    <div className={`py-3 ${!edit? 'block' : 'hidden'}`}>
        <div className="my-2">
            <h2 className="text-teal-950 text-lg">Nome</h2>
            <p className="text-black font-bold">{currUser?.name}</p>
        </div>

        <div className="my-2">
            <h2 className="text-teal-950 text-lg">Email</h2>
            <p className="text-black font-bold">{currUser?.email}</p>
        </div>
    </div>

    <div className={`py-3 ${edit? 'block' : 'hidden'}`}>
        <form className="w-full">
            <label htmlFor="name" className="text-teal-950 text-lg mt-2">Digite seu novo nome</label>
            <input type="text" placeholder="name" className="mb-2 outline-none border-0 border-b-2 border-b-teal-950 w-full text-black px-2 hover:border-b-teal-600 focus:border-b-teal-600" {...register("name", {required: false})} />
            <label htmlFor="email" className="text-teal-950 text-lg mt-2">Digite seu novo email</label>
            <input type="text" placeholder="email" className="mb-2 outline-none border-0 border-b-2 border-b-teal-950 w-full text-black px-2 hover:border-b-teal-600 focus:border-b-teal-600" {...register("email", {required: false, pattern: /^\S+@\S+$/i})} />
            {errors.email && (
                <p className="text-red-600 text-sm mt-1">
                    Digite um email válido
                </p>
            )}
            <label htmlFor="password" className="text-teal-950 text-lg mt-2">Digite sua nova senha</label>
            <input type="text" placeholder="password" className="mb-2 outline-none border-0 border-b-2 border-b-teal-950 w-full text-black px-2 hover:border-b-teal-600 focus:border-b-teal-600" {...register("password", {required: false})} />
        </form>
    </div>

    <div className="flex justify-center">
        <button className="bg-teal-950 py-2 font-bold px-4 rounded-lg shadow hover:scale-95" onClick={ edit  ? handleSubmit(onSubmit)  : () => {setEdit(true)}}>
          {edit ? "Salvar novos dados" : "Editar dados pessoais"}
        </button>
    </div>

    {success && (
      <div className="mt-3 text-teal-950 text-sm font-semibold px-4 py-2 rounded-lg text-center">
        Dados atualizados com sucesso ✅
      </div>
    )}
    </div>
  );
}
