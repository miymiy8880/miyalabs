const supplierContainer =
  document.getElementById(
    "niacinamide-suppliers"
  );


async function loadNiacinamideSuppliers() {

  try {

    const response =
      await fetch(
        "../data/suppliers.json"
      );


    if (!response.ok) {

      throw new Error(
        "Supplier database could not be loaded."
      );

    }


    const data =
      await response.json();


    const suppliers =
      Array.isArray(data.suppliers)
        ? data.suppliers
        : [];


    const niacinamideSuppliers =
      suppliers.filter(
        supplier =>
          Array.isArray(
            supplier.ingredients
          ) &&
          supplier.ingredients.some(
            ingredient =>
              ingredient.toLowerCase()
                === "niacinamide"
          )
      );


    renderSuppliers(
      niacinamideSuppliers
    );


  } catch (error) {

    console.error(error);


    supplierContainer.innerHTML = `

      <div class="directory-placeholder">

        <strong>
          Supplier information unavailable
        </strong>

        <span>
          Please try refreshing the page.
        </span>

      </div>

    `;

  }

}



function renderSuppliers(
  suppliers
) {

  if (suppliers.length === 0) {

    supplierContainer.innerHTML = `

      <div class="directory-placeholder">

        <strong>
          No suppliers listed yet
        </strong>

        <span>
          Miya Labs has not added verified
          supplier records for this ingredient.
        </span>

      </div>

    `;

    return;

  }


  supplierContainer.innerHTML =
    suppliers.map(
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


          <h3>

            ${escapeHTML(
              supplier.name
            )}

          </h3>


          <p>

            <strong>
              Products
            </strong>

          </p>


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



function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}



loadNiacinamideSuppliers();
