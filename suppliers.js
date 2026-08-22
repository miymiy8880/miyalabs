const supplierContainer = document.getElementById("supplier-results");
const searchInput = document.getElementById("supplier-search");
const typeFilter = document.getElementById("supplier-type");

let suppliers = [];

async function loadSuppliers() {
  try {
    const response = await fetch("data/suppliers.json");

    if (!response.ok) {
      throw new Error("Could not load supplier database.");
    }

    suppliers = await response.json();

    renderSuppliers();

  } catch (error) {
    supplierContainer.innerHTML = `
      <div class="directory-placeholder">
        <strong>Supplier database unavailable</strong>
        <span>
          The supplier data could not be loaded.
          Please try again later.
        </span>
      </div>
    `;
  }
}


function renderSuppliers() {

  const searchTerm =
    searchInput.value.toLowerCase().trim();

  const selectedType =
    typeFilter.value;


  const filtered =
    suppliers.suppliers.filter(supplier => {

      const matchesSearch =
        supplier.name.toLowerCase().includes(searchTerm) ||
        supplier.ingredients.some(
          ingredient =>
            ingredient.toLowerCase().includes(searchTerm)
        );


      const matchesType =
        selectedType === "all" ||
        supplier.type === selectedType;


      return matchesSearch && matchesType;

    });


  if (filtered.length === 0) {

    supplierContainer.innerHTML = `
      <div class="directory-placeholder">
        <strong>No suppliers found</strong>
        <span>
          Try another ingredient, company name,
          or supplier type.
        </span>
      </div>
    `;

    return;
  }


  supplierContainer.innerHTML =
    filtered.map(supplier => `

      <article class="supplier-result">

        <div class="supplier-meta">

          <span>
            ${supplier.type.toUpperCase()}
          </span>

          <span>
            ${supplier.country}
          </span>

        </div>


        <h3>
          ${supplier.name}
        </h3>


        <p>
          Ingredients:
          ${supplier.ingredients.join(", ")}
        </p>


        <div class="supplier-products">

          ${supplier.products.map(product => `

            <div class="supplier-product">

              <strong>
                ${product.name}
              </strong>

              <span>
                ${product.grade}
              </span>

              <a
                href="${product.officialUrl}"
                target="_blank"
                rel="noopener noreferrer"
              >
                View supplier →
              </a>

            </div>

          `).join("")}

        </div>

      </article>

    `).join("");
}


searchInput.addEventListener(
  "input",
  renderSuppliers
);

typeFilter.addEventListener(
  "change",
  renderSuppliers
);


loadSuppliers();
