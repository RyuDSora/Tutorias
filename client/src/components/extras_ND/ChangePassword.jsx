import  { useState } from 'react';

function ChangePassword() {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const validateInput = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{8}$/; 

    if (emailRegex.test(inputValue) || phoneRegex.test(inputValue)) {
      setErrorMessage('');
    } else {
      setErrorMessage('Correo o número inválido');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Buscar tu número o correo electrónico</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST">
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address o número</label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="off"
                required
                className="p-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-400 sm:text-sm sm:leading-6"
                value={inputValue}
                onChange={handleChange}
                onBlur={validateInput}
              />
              {errorMessage && <div className="text-red-500 mt-2 text-sm">{errorMessage}</div>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Buscar cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
