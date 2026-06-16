import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  pt: {
    translation: {
      "language": "Idioma",
      "guests": "Hóspedes",
      "rooms": "Quartos",
      "reservations": "Reservas",
      "payments": "Pagamentos",
      "policies": "Políticas",
      "promotions": "Promoções",
      "reports": "Relatórios",
      "logout": "Sair",
      "welcome": "Bem-vindo ao Painel Kaizen Inn",
      "activeReservations": "Reservas Ativas",
      "newReservation": "Nova Reserva",
      "checkIn": "Check-in",
      "checkOut": "Check-out",
      "adults": "Adultos",
      "children": "Crianças",
      "promocode": "Cód. Promocional",
      "createReservation": "Criar Reserva",
      "save": "Salvar",
      "cancel": "Cancelar"
    }
  },
  en: {
    translation: {
      "language": "Language",
      "guests": "Guests",
      "rooms": "Rooms",
      "reservations": "Reservas", // keep as Reservations
      "payments": "Payments",
      "policies": "Policies",
      "promotions": "Promotions",
      "reports": "Reports",
      "logout": "Logout",
      "welcome": "Welcome to Kaizen Inn Panel",
      "activeReservations": "Active Reservations",
      "newReservation": "New Reservation",
      "checkIn": "Check-in",
      "checkOut": "Check-out",
      "adults": "Adults",
      "children": "Children",
      "promocode": "Promo Code",
      "createReservation": "Create Reservation",
      "save": "Save",
      "cancel": "Cancel"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "pt", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
