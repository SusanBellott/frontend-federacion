import Swal from "sweetalert2";

export function successAlert(message = "Operación exitosa") {
  return Swal.fire({
    icon: "success",
    title: "¡Éxito....!",
    text: message,
    confirmButtonColor: "#6C5CE7",
  });
}

export function errorAlert(message = "Ocurrió un error") {
  return Swal.fire({
    icon: "error",
    title: "¡Error!",
    text: message,
    confirmButtonColor: "#D63031",
  });
}

export function confirmAlert(message = "¿Estás seguro?", callback) {
  Swal.fire({
    title: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, continuar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#F39C12",
  }).then((result) => {
    if (result.isConfirmed && callback) {
      callback();
    }
  });
}
