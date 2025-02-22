import { ref } from "vue";

export function useValidaciones() {
 // const permitirSoloNumeros = (valor, longitud = 12) => {
    // Elimina caracteres no numéricos
   // let numero = valor.replace(/\D/g, ""); 

    // Limita la longitud
    //return numero.slice(0, longitud);
 // };

 // return { permitirSoloNumeros };

 const permitirSoloNumeros = (valor, longitud = 12) => {
    return valor.replace(/\D/g, "").slice(0, longitud);
  };

  return { permitirSoloNumeros };
  

 
}
