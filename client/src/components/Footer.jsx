import { useNavigate } from 'react-router-dom';

const currentYear = new Date().getFullYear();

export function FooterWithSocialLinks() {
  const navigate = useNavigate();
  return (
    <div className="container-fluid bg_principal Blanco">
      <div className='row'>
        <div className='col-md-4'>
          <div className='d-flex justify-content-center'>
            <a href="/"><img src="/logos/logo_3_white-negative-on-primary.jpg" alt="InCarranza" style={{width:200,margin:0}}/></a>
          </div>
        </div>
        <hr className="clearfix w-75 mx-auto d-md-none pb-0"/>
        <div className='col-md-4 '>
          
        </div>
        <div className='col-md-4'>
          <div className='my-4 mx-auto'>
            <div className='d-flex justify-content-center'>
              <ul className='ms-2 mt-2'>
                <span className="text-uppercase h6">Recursos</span>
                <li className='ms-3'><span><a href="#">FAQs</a></span></li>
                <li className='ms-3'><span><a href="/about-us">Acerca de</a></span></li>
                <li className='ms-3'><span><a href="/help-center">Centro de Ayuda</a></span></li>
              </ul>  
            </div>
          </div>
          <hr className="clearfix w-75 mx-auto d-md-none pb-3"/>
          <div className="d-flex justify-content-center mx-auto pb-3" style={{width:'90%'}}>
              <div className="mx-3 px-0">
                  <a href="https://www.facebook.com/">
                      <img src="https://cdn-icons-png.flaticon.com/512/174/174848.png" alt="fb logo" style={{width:'25px'}}/>
                  </a>
              </div>
              <div className="mx-3 px-0">
                  <a href="https://www.instagram.com/">
                      <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="inst logo" style={{width:'25px'}}/>
                  </a>
              </div>
          </div>
          <hr className="clearfix w-75 mx-auto d-md-none pb-3"/>
        </div>
      </div>
      <div className="d-flex justify-content-center my-1 f_principal pb-3 text-center" style={{fontSize:'x-small'}}>
          <p>&copy; {currentYear} Copyright:
          <a href="#"> IS902-1900-2-2024</a> Tutorias. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}

export default FooterWithSocialLinks;