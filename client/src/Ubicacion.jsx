
const Ubicacion = () => {
  return (
    <div className="bg-white">
      <div className="relative bg-gray-900">
        {/* Decorative image and overlay */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <img src="https://raw.githubusercontent.com/angeldev96/partyandgift/development/client/public/inside_store_partyngift.jpg" alt="" className="h-full w-full object-cover object-center" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gray-900 opacity-50"></div>

        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:py-64 lg:px-0">
          <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">
            Visitanos: City Mall - Sotano 2, Tegucigalpa, Francisco Morazan,&nbsp;&nbsp; <br />
            <br />
            Lunes a Sabado 9:00am - 6:30pm<br />
            Domingo 10:00am - 5:00pm
          </h1>

          <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">
            &nbsp;Contacto +504 96924183&nbsp;&nbsp;
          </h1>
          <p className="mt-4 text-xl text-white">*Incluimos servicio a domicilio.</p>
          <p className="mt-4 text-xl text-white">&nbsp;</p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d894.1775209962527!2d-87.22097727148706!3d14.06307433199867!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1ses-419!2shn!4v1711884462264!5m2!1ses-419!2shn"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Ubicacion;
