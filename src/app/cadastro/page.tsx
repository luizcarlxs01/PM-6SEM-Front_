"use client";

import { useState } from "react";
import api from "../../services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CadastroPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senhaHash: "",
    telefone: "", // só dígitos
  });

  const telefoneFormatado = (() => {
    const tel = form.telefone;
    if (tel.length === 0) return "";
    if (tel.length <= 2) return `(${tel}`;
    if (tel.length <= 7) return `(${tel.slice(0, 2)}) ${tel.slice(2)}`;
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 7)}-${tel.slice(7, 11)}`;
  })();

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, "");
    valor = valor.slice(0, 11);
    setForm({ ...form, telefone: valor });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        nome: form.nome,
        email: form.email,
        senhaHash: form.senhaHash,
        telefone: form.telefone, // só números para a API
      };

      console.log("Enviando para API:", payload);
      const response = await api.post("/Usuarios/CriarUsuario", payload);

      alert(response.data.mensagem || "Usuário cadastrado com sucesso!");
      router.push("/login");
    } catch (err: any) {
      console.error("Erro ao cadastrar usuário:", err);

      if (err.response?.data?.errors) {
        console.log("Erros de validação:", err.response.data.errors);
        alert("Erro de validação no cadastro. Verifique os campos.");
      } else {
        alert("Erro ao cadastrar usuário.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white p-10">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Criar Conta</h1>

        <input
          type="text"
          name="nome"
          placeholder="Nome completo"
          value={form.nome}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={form.email}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          required
        />

        <input
          type="password"
          name="senhaHash"
          placeholder="Senha"
          value={form.senhaHash}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          required
        />

        <input
          type="text"
          name="telefone"
          placeholder="(11) 98888-7777"
          value={form.telefone === "" ? "" : telefoneFormatado}
          onChange={handleTelefoneChange}
          className="w-full p-3 rounded bg-gray-700 text-white"
          inputMode="numeric"
          maxLength={15}
        />

        <button
          type="submit"
          className="bg-green-600 w-full py-3 rounded hover:bg-green-700 transition"
        >
          Registrar
        </button>

        <p className="text-center text-sm">
          Já tem conta?{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Entrar
          </a>
        </p>

        <p className="text-[11px] text-gray-400 text-center">
          Ao criar sua conta, você declara ter lido e concordado com os{" "}
          <Link
            href="/termos"
            className="text-green-400 underline hover:text-green-300"
          >
            Termos de Uso e Tratamento de Dados (LGPD)
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
