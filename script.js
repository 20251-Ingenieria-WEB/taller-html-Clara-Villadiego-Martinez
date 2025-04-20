const breedInput = document.getElementById("breed-input");
const searchButton = document.getElementById("search-button");
const gallery = document.getElementById("gallery");
const errorMessage = document.getElementById("error-message");
const toggleListButton = document.getElementById("toggle-list-button");
const breedListContainer = document.getElementById("breed-list-container");
const breedList = document.getElementById("breed-list");

let breedMap = {}; // Guarda todas las razas y subrazas

// Cargar el listado de razas desde la API al cargar la página
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("https://dog.ceo/api/breeds/list/all");
    const data = await response.json();
    if (data.status === "success") {
      breedMap = data.message;

      // Construye la lista visual
      for (let breed in breedMap) {
        if (breedMap[breed].length === 0) {
          const li = document.createElement("li");
          li.textContent = breed;
          breedList.appendChild(li);
        } else {
          breedMap[breed].forEach(sub => {
            const li = document.createElement("li");
            li.textContent = `${breed} - ${sub}`;
            breedList.appendChild(li);
          });
        }
      }
    }
  } catch (error) {
    errorMessage.textContent = "Error al cargar el listado de razas.";
  }
});

// Mostrar/ocultar el listado de razas
toggleListButton.addEventListener("click", () => {
  breedListContainer.style.display = breedListContainer.style.display === "none" ? "block" : "none";
});

// Ejecutar la búsqueda cuando se hace clic en el botón
searchButton.addEventListener("click", async () => {
  const input = breedInput.value.trim().toLowerCase();
  errorMessage.textContent = "";
  gallery.innerHTML = "";

  if (!input) {
    errorMessage.textContent = "Por favor, ingresa una raza.";
    return;
  }

  try {
    // Determina la ruta adecuada según si hay subraza
    let endpoint = `https://dog.ceo/api/breed/${input}/images/random/10`;

    const parts = input.split(" ");
    if (parts.length === 2) {
      endpoint = `https://dog.ceo/api/breed/${parts[0]}/${parts[1]}/images/random/10`;
    }

    const response = await fetch(endpoint);
    const data = await response.json();

    if (data.status !== "success") {
      throw new Error("Raza no encontrada.");
    }

    // Mostrar resultados
    data.message.forEach((imgUrl) => {
      const urlParts = imgUrl.split("/");
      const breedInfo = urlParts[urlParts.indexOf("breeds") + 1];
      let mainBreed = breedInfo;
      let subBreed = "N/A";

      if (breedInfo.includes("-")) {
        const parts = breedInfo.split("-");
        mainBreed = parts[0];
        subBreed = parts[1];
      }

      const item = document.createElement("div");
      item.className = "gallery-item";
      item.innerHTML = `
        <img src="${imgUrl}" alt="Perro">
        <p><strong>Raza:</strong> ${mainBreed}</p>
        <p><strong>Subraza:</strong> ${subBreed}</p>
      `;
      gallery.appendChild(item);
    });
  } catch (error) {
    errorMessage.textContent = "No se pudo encontrar esa raza. Intenta con otra.";
  }
});
