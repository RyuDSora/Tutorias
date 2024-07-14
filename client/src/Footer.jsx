import { Typography } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';

const LINKS = [
  {
    title: "Tutores",
    items: ["1", "2", "3"],
  },
  {
    title: "Cursos",
    items: ["Matemáticas","Física","Ingles"],
  },
  {
    title: "Recursos",
    items: ["FAQs", "acerca de","Centro de ayuda"],
  },
];

const currentYear = new Date().getFullYear();

export function FooterWithSocialLinks() {
  const navigate = useNavigate();
  return (
    <footer className="bg_principal text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex items-center">
            <img src="/logos/logo_3_white-negative-on-primary.jpg" alt="Tutorias logo" className="h-28 mr-2" />
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
                          case 'acerca de':
                            navigate('/about-us');
                            break;
                          case 'Categorías':
                            //navigate('/product-categories');
                            break;
                          case 'Novedades':
                            //navigate('/news');
                            break;
                          case 'Temporada':
                            //navigate('/season');
                            break;
                          case 'Eventos':
                            //navigate('/events');
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
              &copy; {currentYear} <a href="/about-us" className="hover:text-blue-400">Tutorias</a>. Todos
              los derechos reservados.
            </Typography>
          </div>
          <div className="flex items-center gap-8">
            <Typography as="a" href="https://www.facebook.com/" className="opacity-70 transition-opacity hover:opacity-100">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174848.png" alt="Facebook" className="h-8 w-8" />
            </Typography>
            <Typography as="a" href="https://www.instagram.com/" className="opacity-70 transition-opacity hover:opacity-100">
              <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" className="h-8 w-8" />
            </Typography>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterWithSocialLinks;