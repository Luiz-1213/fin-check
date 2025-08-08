import { GoogleIcon } from '../../components/icons/GoogleIcon';
import { Logo } from '../../components/Logo';
import { Spinner } from '../../components/Spinner';
import useGoogleController from './useGoogleController';

export function GoogleCallback() {
  useGoogleController();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-5">
      <div className="flex items-center gap-3  text-gray-600">
        <Logo className="h-10 text-teal-700" />
        <p className="text-2xl">+</p>
        <GoogleIcon />
      </div>

      <h1 className="text-lg tracking-tight font-light  text-gray-700">
        Carregando seus dados com o google...
      </h1>

      <Spinner />
    </div>
  );
}
