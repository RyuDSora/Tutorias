import { useNavigate } from "react-router-dom";
import { CogIcon, ViewColumnsIcon, UserMinusIcon } from '@heroicons/react/24/outline'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

function AccountComponent() {
  let navigate = useNavigate();

  const handleChangePassword = () => {
    navigate("/reset-password"); // path you want to redirect to
  };

  const handleViewPurchaseHistory = () => {
    navigate('/order-history');
  };

  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${import.meta.env.VITE_API_URL}/user/delete`, {
        headers: {
          Authorization: token,
        },
      });
      console.log(response.data);
      toast.success('Cuenta eliminada exitosamente');
      // Después de eliminar, puedes redirigir al login o a donde consideres apropiado
      navigate('/login');
    } catch (error) {
      console.error('Error al eliminar la cuenta:', error);
      toast.error('Error al eliminar la cuenta');
    }
  };
  

  return (
    <>
    <ToastContainer />

    <div className="flex h-screen bg-gray-100">
      <div className="p-6 w-64 bg-white border-r dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300">
        <div className="mt-6">
          <button onClick={handleChangePassword} className="flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded mt-2 w-full">
            <CogIcon className="h-5 w-5" />
            <span className="mx-4 font-medium">Cambiar contraseña</span>
          </button>
          <button onClick={handleViewPurchaseHistory} className="flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded mt-2 w-full">
            <ViewColumnsIcon className="h-5 w-5" />
            <span className="mx-4 font-medium">Ver historial de compras</span>
          </button>
          <button onClick={handleDeleteUser} className="flex items-center text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded mt-2 w-full">
            <UserMinusIcon className="h-5 w-5" />
            <span className="mx-4 font-medium">Eliminar su cuenta</span>
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

export default AccountComponent;
