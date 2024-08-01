import dotenv from 'dotenv';
dotenv.config();
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Usa process.env para obtener la clave


//inicio
export const home = async (req, res) => {
    res.status(200).json('Bienvenido, Stripe se esta ejecutando correctamente')
}

//Get de prueba para la verificar la funcionalidad de stripe
export const stripeTest =  async (req, res) => {
    try {
      const response = await stripe.products.list(); // Listar productos como prueba
      res.status(200).json({
        success: true,
        data: response, // Mostrar la respuesta de la API de Stripe
      });
    } catch (error) {
      console.error('Error al verificar la clave de Stripe:', error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
};

//Crear la sesion de stripe
export const addStripe = async (req, res) => {
    try {
      const { priceId } = req.body;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: 'https://tu-torias.vercel.app/success',
        cancel_url: 'https://tu-torias.vercel.app/cancel',
      });
      res.json({ id: session.id });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(400).send({ error: { message: error.message } });
    }
};
  