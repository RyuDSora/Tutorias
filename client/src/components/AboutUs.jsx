import React, { useState, useEffect } from "react";

function AboutUs() {
    const paragraphs = [
        {
            text: "¡Bienvenido a nuestra plataforma!",
            imageUrl: "/logos/logo_0_primary-color-positive.jpg",
        },
        {
            text: "text1.",
            imageUrl: "/logos/logo_1_secondary-color-positive.jpg",
        },
        {
            text: "text2.",
            imageUrl: "/logos/logo_2_black-white-positive.jpg",
        },
        {
            text: "text3.",
            imageUrl: "/logos/logo_3_white-negative-on-primary.jpg",
        },
        {
            text: "¡Déjanos ser parte de tus momentos.",
            imageUrl: "/logos/logo_4_white-negative.jpg",
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % paragraphs.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-screen w-full overflow-hidden flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-serif text-center py-4">Acerca de</h1>
            <div className="relative h-full w-full">
                {paragraphs.map((paragraph, index) => (
                    <div key={index} 
                         className={`absolute
                                     flex items-center justify-center 
                                     transition-opacity duration-500 
                                     ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                         style={{ backgroundImage: `url(${paragraph.imageUrl})`,backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat', height:'100vh',width: '100vw' }}>
                        <div className="bg-black bg-opacity-50 text-white p-8">
                            <h2 className="text-2xl md:text-4xl text-center font-serif">{paragraph.text}</h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AboutUs;