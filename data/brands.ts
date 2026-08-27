/**
 * Marcas que el taller atiende y con las que trabaja, para la sección "Marcas"
 * del home (`components/home/Brands.tsx`). Los logos viven en
 * `public/assets/logos/brands/`.
 */
export type Brand = {
  name: string;
  logo: string;
  alt: string;
};

export const brands: readonly Brand[] = [
  { name: 'Altamira', logo: '/assets/logos/brands/altamira.png', alt: 'Logo de Altamira' },
  { name: 'Alvill', logo: '/assets/logos/brands/alvill.png', alt: 'Logo de Alvill' },
  { name: 'Armstrong', logo: '/assets/logos/brands/armstrong.png', alt: 'Logo de Armstrong' },
  { name: 'Crane', logo: '/assets/logos/brands/crane.png', alt: 'Logo de Crane' },
  { name: 'Deming', logo: '/assets/logos/brands/deming.png', alt: 'Logo de Deming' },
  {
    name: 'DoubleLife Corporation',
    logo: '/assets/logos/brands/doublelife.png',
    alt: 'Logo de DoubleLife Corporation',
  },
  { name: 'Durco', logo: '/assets/logos/brands/durco.png', alt: 'Logo de Durco' },
  { name: 'Eaton', logo: '/assets/logos/brands/eaton.png', alt: 'Logo de Eaton' },
  { name: 'Gates', logo: '/assets/logos/brands/gates.png', alt: 'Logo de Gates' },
  { name: 'Goodyear', logo: '/assets/logos/brands/goodyear.png', alt: 'Logo de Goodyear' },
  {
    name: 'Gorman-Rupp Pumps',
    logo: '/assets/logos/brands/gorman-rupp.png',
    alt: 'Logo de Gorman-Rupp Pumps',
  },
  {
    name: 'Goulds Pumps',
    logo: '/assets/logos/brands/goulds-pumps.png',
    alt: 'Logo de Goulds Pumps',
  },
  { name: 'Grundfos', logo: '/assets/logos/brands/grundfos.png', alt: 'Logo de Grundfos' },
  {
    name: 'Gusher Pumps',
    logo: '/assets/logos/brands/gusher-pumps.png',
    alt: 'Logo de Gusher Pumps',
  },
  { name: 'KSB', logo: '/assets/logos/brands/ksb.png', alt: 'Logo de KSB' },
  {
    name: 'LMI',
    logo: '/assets/logos/brands/lmi.png',
    alt: 'Logo de LMI, an Ingersoll Rand Business',
  },
  { name: 'Parker', logo: '/assets/logos/brands/parker.png', alt: 'Logo de Parker' },
  {
    name: 'Pentair Fairbanks Nijhuis',
    logo: '/assets/logos/brands/pentair-fairbanks-nijh.png',
    alt: 'Logo de Pentair Fairbanks Nijhuis',
  },
  { name: 'PICSA', logo: '/assets/logos/brands/picsa.png', alt: 'Logo de PICSA Bombas y Sistemas' },
  { name: 'Prinze', logo: '/assets/logos/brands/prinze.png', alt: 'Logo de Prinze' },
  {
    name: 'Rexroth Bosch Group',
    logo: '/assets/logos/brands/rexroth-bosch.png',
    alt: 'Logo de Rexroth Bosch Group',
  },
  {
    name: 'Roper Pumps',
    logo: '/assets/logos/brands/roper-pumps.png',
    alt: 'Logo de Roper Pumps',
  },
  { name: 'Sentinel', logo: '/assets/logos/brands/sentinel.png', alt: 'Logo de Sentinel' },
  {
    name: 'Sterling Submersible Pumps',
    logo: '/assets/logos/brands/sterling.png',
    alt: 'Logo de Sterling Submersible Pumps',
  },
  { name: 'Sulzer', logo: '/assets/logos/brands/sulzer.png', alt: 'Logo de Sulzer' },
  { name: 'US Motors', logo: '/assets/logos/brands/us-motors.png', alt: 'Logo de US Motors' },
  {
    name: 'VH-Pump',
    logo: '/assets/logos/brands/vh-pump.png',
    alt: 'Logo de VH-Pump, bombas portátiles',
  },
  { name: 'Vickers', logo: '/assets/logos/brands/vickers.png', alt: 'Logo de Vickers' },
  { name: 'WDM Pumps', logo: '/assets/logos/brands/wdm-pumps.png', alt: 'Logo de WDM Pumps' },
  { name: 'WEG', logo: '/assets/logos/brands/weg.png', alt: 'Logo de WEG' },
];
