const url = "http://localhost:1337/todos/";
let createInfo = document.querySelector("#infoTodo");
const containerAPP = document.querySelector(".responseApp");
const createPost = document.querySelector("#createPost");
const deletePost = containerAPP.querySelector("#deletePost");
const updatePost = containerAPP.querySelector("#updatePost");
const containerUpdateApp = document.querySelector("#putContainer");
const valueUpdate = document.querySelector("#updateTodo");
const btnUpdate = document.querySelector("#updateApp-todo");
let result = "";
let estado = "crear";

createPost.addEventListener("click", () => {
  Swal.fire({
    position: "Center",
    icon: "success",
    title: "ToDo registrado con exito",
    showConfirmButton: false,
    timer: 1500,
  });
  setTimeout(() => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        homework: createInfo.value,
      }),
    })
      .then((res) => res.json())
      .then(() => location.reload());
    createInfo.value = "";
  }, 1000);
});

const mostrarDatos = (articulo) => {
  articulo.forEach((pub) => {
    result += `
            <div class="infoStrapi">
                <h3 class="idStrapi">${pub.id}</h3>
                <h2 class="homeWork">${pub.homework}</h2>
                <div class="bottomApp">
                    <button class="btn-response updatePost btn btn-primary">Update</button>
                    <button class="btn-response deletePost btn btn-danger">Delete</button>
                </div>
            </div>
          `;
  });

  containerAPP.innerHTML = result;
};

fetch(url)
  .then((response) => response.json())
  .then((post) => mostrarDatos(post))
  .catch((error) => console.log(error));

const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

// borrar elemento Todo
on(document, "click", ".deletePost", (e) => {
  const elemento = e.target.parentNode.parentNode;
  const idElement = elemento.firstElementChild.innerHTML;

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  swalWithBootstrapButtons
    .fire({
      title: "Estas seguro?",
      text: "No podras recuperar el campo una vez borrado!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, borralo!",
      cancelButtonText: "No, cancelalo!",
      reverseButtons: true,
    })
    .then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          "Eliminado!",
          "Tu campo se eliminó correctamente.",
          "success"
        );
        setTimeout(() => {
          fetch(url + idElement, {
            method: "DELETE",
          })
            .then((res) => res.json())
            .then(() => location.reload());
        }, 1500);
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          "Salvado",
          "Tu campo se a salvado :)",
          "error"
        );
      }
    });
});

// editar elemento Todo
on(document, "click", ".updatePost", (e) => {
  const elemento = e.target.parentNode.parentNode;
  const inputUpdate = elemento.children[1].innerHTML;
  containerUpdateApp.classList.toggle("updateApp");
  valueUpdate.value = inputUpdate;
  estado = "editar";
});

btnUpdate.addEventListener("click", (e) => {
  e.preventDefault();
  if (estado == "editar") {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "ToDo actualizado con exito",
      showConfirmButton: false,
      timer: 1500,
    });
    on(document, "click", "#updateApp-todo", (e) => {
      const id = e.target.parentNode.parentNode.parentNode;
      const idElement = id.children[3].children[0].firstElementChild.innerHTML;
      console.log(idElement);
      const elemento = e.target.parentNode;
      const inputUpdate = elemento.children[0].value;
      setTimeout(()=>{
          fetch(url + idElement, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              homework: inputUpdate,
            }),
          })
            .then((res) => res.json())
            .then(() => location.reload());
      }, 1000)
    });
  }
});
