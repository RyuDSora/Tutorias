import { Typography } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';

const LINKS = [
  {
    title: "Productos",
    items: ["Categorías", "Novedades", "Temporada"],
  },
  {
    title: "Empresa",
    items: ["Acerca de nosotros"],
  },
  {
    title: "Recursos",
    items: ["Eventos", "Centro de ayuda"],
  },
];

const currentYear = new Date().getFullYear();

export function FooterWithSocialLinks() {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center">
            <img src="/partyandgift.png" alt="Party and Gift logo" className="h-28 w-34 mr-2" />
          </div>
          <div className="grid grid-cols-3 gap-8">
            {LINKS.map(({ title, items }) => (
              <ul key={title}>
                <Typography variant="lead" className="text-lg font-semibold mb-4">
                  {title}
                </Typography>
                {items.map((link) => (
                  <li key={link}>
                    <Typography
                      onClick={() => {
                        switch (link) {
                          case 'Acerca de nosotros':
                            navigate('/about-us');
                            break;
                          case 'Categorías':
                            navigate('/product-categories');
                            break;
                          case 'Novedades':
                            navigate('/news');
                            break;
                          case 'Temporada':
                            navigate('/season');
                            break;
                          case 'Eventos':
                            navigate('/events');
                            break;
                          case 'Centro de ayuda':
                            navigate('/help-center');
                            break;
                          default:
                            navigate('/');
                        }
                      }}
                      className="text-base font-medium transition-colors duration-300 hover:text-blue-400 hover:underline cursor-pointer"
                    >
                      {link}
                    </Typography>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <Typography variant="small" className="text-base text-gray-400">
              &copy; {currentYear} <a href="https://material-tailwind.com/" className="hover:text-blue-400">Party and Gift</a>. Todos
              los derechos reservados.
            </Typography>
          </div>
          <div className="flex items-center gap-8">
            <Typography as="a" href="https://www.facebook.com/profile.php?id=100089571009398" className="opacity-70 transition-opacity hover:opacity-100">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174848.png" alt="Facebook" className="h-8 w-8" />
            </Typography>
            <Typography as="a" href="https://www.instagram.com/partyandgifthn" className="opacity-70 transition-opacity hover:opacity-100">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" className="h-8 w-8" />
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterWithSocialLinks;