import Swal from "sweetalert2";

//success message
export const successMessage = (message:any) => {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: `${message}`,
      showConfirmButton: false,
      timer: 1500,
    });
}