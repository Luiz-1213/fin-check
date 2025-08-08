import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { GoogleIcon } from '../../components/icons/GoogleIcon';
import { Input } from '../../components/Input';
import useLoginController from './useLoginController';

export function Login() {
  const { handleSubmit, register, errors, isLoading, signInWithGoogle } =
    useLoginController();
  return (
    <>
      <header className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-2xl font-bold text-gray-700 tracking-[-1px]">
          Entre em sua conta
        </h1>
        <p className="space-x-1">
          <span className="text-gray-700 tracking-[-0.5px]">
            Novo por aqui?
          </span>
          <Link
            to="/register"
            className=" font-medium text-teal-900 tracking-[-0.5px]"
          >
            Crie uma conta
          </Link>
        </p>
      </header>

      <form className="mt-[52px] flex flex-col gap-3 " onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          type="password"
          placeholder="Senha"
          error={errors.password?.message}
          {...register('password')}
        />

        <Button type="submit" className="mt-2" isLoading={isLoading}>
          Entrar
        </Button>
      </form>
      <div className="flex flex-col gap-2 mt-2">
        <p className="inline-block text-center text-gray-700 tracking-[-0.5px]">
          ou
        </p>
        <Button
          type="button"
          className="flex items-center gap-3 px-5 py-2.5 border border-gray-30 bg-white shadow-md hover:bg-gray-50 transition"
        >
          <GoogleIcon />
          <span
            className="text-sm font-medium text-gray-700"
            onClick={signInWithGoogle}
          >
            Entrar com o Google
          </span>
        </Button>
      </div>
    </>
  );
}
