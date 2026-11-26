/**
 * Datos de contacto de EMBOTEC. Se usan en el hero, "Nosotros", contacto,
 * footer y datos estructurados.
 *
 * TODO (EMBOTEC): las cifras (años, motores, plantas) siguen siendo
 * provisionales; confirmarlas antes de publicar. Correos, teléfonos y domicilio
 * ya son los reales que pasó el cliente.
 */
export const company = {
  yearsInBusiness: '12+',
  motorsServiced: '1,200+',
  plantsServed: '35+',
  emergencyResponse: '24 h',
  /** Correo general del taller (ventas y cotizaciones) */
  email: 'ventas@embo-tec.com',
  /** Teléfono principal: el mismo de Ing. Luis Campos */
  phone: '+52 81 2094 3194',
  /** Formato E.164 para el enlace tel: */
  phoneHref: 'tel:+528120943194',
  address: {
    street: 'C. Epifanio Carreón 631',
    neighborhood: 'Col. La Alianza',
    city: 'Monterrey',
    state: 'Nuevo León',
    postalCode: '64103',
    country: 'México',
    /** Domicilio completo en una línea (footer, ficha de contacto, schema) */
    full: 'C. Epifanio Carreón 631, Col. La Alianza, 64103 Monterrey, Nuevo León, México',
    /** Búsqueda en Google Maps: no fija un negocio, solo el domicilio */
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=C.%20Epifanio%20Carre%C3%B3n%20631%2C%20La%20Alianza%2C%2064103%20Monterrey%2C%20Nuevo%20Le%C3%B3n',
  },
  /**
   * Horario de oficina, el mismo que muestra la página de contacto
   * (`Contact.hoursValue`). Las urgencias se atienden por teléfono fuera de él.
   */
  openingHours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '18:00',
  },
  /** Municipios del área metropolitana donde se atiende en sitio */
  serviceCities: [
    'Monterrey',
    'Apodaca',
    'Guadalupe',
    'San Nicolás de los Garza',
    'Escobedo',
    'Santa Catarina',
    'San Pedro Garza García',
    'García',
  ],
} as const;

export type Contact = {
  name: string;
  email: string;
  /** Teléfono con lada, como se muestra en pantalla */
  phone: string;
  /** Formato E.164 para el enlace tel: */
  phoneHref: string;
};

/**
 * Contactos directos del taller.
 *
 * TODO (EMBOTEC): confirmar el teléfono de Antonio García. El cliente lo pasó
 * como 2205654636 y aquí se muestra como lada 220 + 565 4636, pero 220 no
 * corresponde a ninguna lada nacional conocida (¿faltó un dígito o es un
 * número de otro país?).
 */
export const contacts: readonly Contact[] = [
  {
    name: 'Ing. Luis Campos',
    email: 'luiscampos@embo-tec.com',
    phone: '+52 81 2094 3194',
    phoneHref: 'tel:+528120943194',
  },
  {
    name: 'Ing. Antonio García',
    email: 'antoniogarcia@embo-tec.com',
    phone: '+52 220 565 4636',
    phoneHref: 'tel:+522205654636',
  },
];
