import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';
import { GoogleIcon } from '../../components/icons/GoogleIcon';
import { Input } from '../../components/Input';
import { useRegisterController } from './useRegisterController';

export function Register() {
  const { errors, register, handleSubmit, isLoading, signInWithGoogle } =
    useRegisterController();
  return (
    <>
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-gray-700 tracking-[-1px]">
          Crie sua conta
        </h1>
        <p className="space-x-1">
          <span className="text-gray-700 tracking-[-0.5px]">
            Já possui uma conta?
          </span>
          <Link
            to="/login"
            className="font-medium text-teal-900 tracking-[-0.5px]"
          >
            Fazer login
          </Link>
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-[30px] flex flex-col gap-3">
        <Input
          placeholder="Nome"
          {...register('firstName')}
          error={errors.firstName?.message}
        />
        <Input
          placeholder="Sobrenome"
          {...register('lastName')}
          error={errors.lastName?.message}
        />
        <Input
          type="email"
          placeholder="Email"
          {...register('email')}
          error={errors.email?.message}
        />
        <Input
          type="password"
          placeholder="Senha"
          {...register('password')}
          error={errors.password?.message}
        />

        <Button type="submit" className="mt-2" isLoading={isLoading}>
          Criar conta
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
            Criar com o Google
          </span>
        </Button>
      </div>
    </>
  );
}
