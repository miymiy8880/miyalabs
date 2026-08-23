const supplierResults =
  document.getElementById(
    "supplier-results"
  );


const supplierSearch =
  document.getElementById(
    "supplier-search"
  );


const supplierType =
  document.getElementById(
    "supplier-type"
  );


let suppliers = [];



/*
  Load supplier database
*/

async function loadSuppliers() {

  try {

    const response =
      await fetch(
        "data/suppliers.json"
      );


    if (!response.ok) {

      throw new Error(
        "Supplier database could not be loaded."
      );

    }


    const data =
      await response.json();


    suppliers =
      Array.isArray(data.suppliers)
        ? data.suppliers
        : [];


    populateSupplierTypes();

    renderSuppliers();


  } catch (error) {

    console.error(error);


    supplierResults.innerHTML = `

      <div class="directory-placeholder">

        <strong>
          Supplier database unavailable
        </strong>

        <span>
          Please try refreshing the page.
        </span>

      </div>

    `;

  }

}



/*
  Supplier type filter
*/

function populateSupplierTypes() {

  const types =
    [
      ...new Set(
        suppliers.map(
          supplier => supplier.type
        )
      )
    ].sort();


  types.forEach(type => {

    const option =
      document.createElement(
        "option"
      );


    option.value =
      type;


    option.textContent =
      capitalize(type);


    supplierType.appendChild(
      option
    );

  });

}



/*
  Filter suppliers
*/

function getFilteredSuppliers() {

  const searchTerm =
    supplierSearch.value
      .toLowerCase()
      .trim();


  const selectedType =
    supplierType.value;


  return suppliers.filter(
    supplier => {

      const searchableText = [

        supplier.name,

        supplier.country,

        supplier.type,

        ...(supplier.ingredients || []),

        ...(supplier.products || [])
          .map(
            product => product.name
          )

      ]
        .join(" ")
        .toLowerCase();


      const matchesSearch =
        searchableText.includes(
          searchTerm
        );


      const matchesType =
        selectedType === "all" ||
        supplier.type === selectedType;


      return (
        matchesSearch &&
        matchesType
      );

    }
  );

}



/*
  Render supplier cards
*/

function renderSuppliers() {

  const filtered =
    getFilteredSuppliers();


  if (filtered.length === 0) {

    supplierResults.innerHTML = `

      <div class="directory-placeholder">

        <strong>
          No suppliers found
        </strong>

        <span>
          Try another supplier or ingredient.
        </span>

      </div>

    `;

    return;

  }


  supplierResults.innerHTML =
    filtered.map(
      supplier => `

        <article
          class="supplier-card"
        >


          <div
            class="supplier-card-top"
          >

            <span
              class="supplier-type"
            >
              ${escapeHTML(
                supplier.type
              )}
            </span>


            <span
              class="supplier-country"
            >
              ${escapeHTML(
                supplier.country
              )}
            </span>

          </div>



          <h2>

            ${escapeHTML(
              supplier.name
            )}

          </h2>



          <p>

            <strong>
              Ingredients
            </strong>

          </p>



          <div
            class="supplier-tags"
          >

            ${
              (supplier.ingredients || [])
                .map(
                  ingredient => `
                    <span>
                      ${escapeHTML(
                        ingredient
                      )}
                    </span>
                  `
                )
                .join("")
            }

          </div>



          <div
            class="supplier-products"
          >

            ${
              (supplier.products || [])
                .map(
                  product => `

                    <div
                      class="supplier-product"
                    >

                      <strong>
                        ${escapeHTML(
                          product.name
                        )}
                      </strong>


                      <span>
                        ${escapeHTML(
                          product.grade
                        )}
                      </span>


                      <a
                        href="${escapeHTML(
                          product.officialUrl
                        )}"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Official supplier →
                      </a>

                    </div>

                  `
                )
                .join("")
            }

          </div>


        </article>

      `
    ).join("");

}



/*
  Helpers
*/

function capitalize(value) {

  return value.charAt(0).toUpperCase()
    + value.slice(1);

}


function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}



/*
  Events
*/

supplierSearch.addEventListener(
  "input",
  renderSuppliers
);


supplierType.addEventListener(
  "change",
  renderSuppliers
);



/*
  Start
*/

loadSuppliers();
