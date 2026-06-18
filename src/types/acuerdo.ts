export interface Parte {
  nombre: string;
  email: string;
}

export interface Firma {
  nombre: string;
  fecha: string;
  hora: string;
}

export interface Acuerdo {
  id: number;
  clausulas: string[];
  partes: {
    proponente: Parte;
    aceptante: Parte;
  };
  firmas: {
    proponente: Firma;
    aceptante: Firma;
  };
  hash: string;
  timestamp: string;
}
