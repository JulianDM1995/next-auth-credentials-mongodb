"use client";
import { FormEvent, useEffect, useState } from "react";
import {
  ClientSafeProvider,
  LiteralUnion,
  getProviders,
  signIn,
  useSession,
} from "next-auth/react";
import { useRouter } from "next/navigation";
import { BuiltInProviderType } from "next-auth/providers";

type SessionProviders = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
> | null;

function LoginPage() {
  const [error, setError] = useState("");
  const [providers, setProviders] = useState<SessionProviders>();

  useEffect(() => {
    const setTheProviders = async () => {
      const setupProviders = await getProviders();
      setProviders(setupProviders);
    };
    setTheProviders();
  }, []);

  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (!res) return setError("Sign in failed");
    if (res.error) setError(res.error as string);
    else router.push("/dashboard/profile");
  };

  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex flex-col items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-950 px-8 py-10 w-3/12"
      >
        {error && <div className="bg-red-500 text-white p-2 mb-2">{error}</div>}
        <h1 className="text-4xl font-bold mb-7">Login</h1>

        <label className="text-slate-300">Email:</label>
        <input
          type="email"
          placeholder="Email"
          className="bg-zinc-800 px-4 py-2 block mb-2 w-full"
          name="email"
        />

        <label className="text-slate-300">Password:</label>
        <input
          type="password"
          placeholder="Password"
          className="bg-zinc-800 px-4 py-2 block mb-2 w-full"
          name="password"
        />

        <button className="bg-blue-500 text-white px-4 py-2 block w-full mt-4">
          Login
        </button>
      </form>
      <div className="flex">
        {providers?.google && (
          <button
            onClick={() =>
              signIn(providers.google.id, {
                callbackUrl: `${window.location.origin}/dashboard/profile`,
              })
            }
            className="bg-blue-500 text-white px-4 py-2 block mt-4"
          >
            Google
          </button>
        )}

        {providers?.github && (
          <button
            onClick={() =>
              signIn(providers.github.id, {
                callbackUrl: `${window.location.origin}/dashboard/profile`,
              })
            }
            className="bg-blue-500 text-white px-4 py-2 block mt-4"
          >
            Github
          </button>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
