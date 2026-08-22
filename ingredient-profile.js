const supplierContainer =
  document.getElementById("ingredient-suppliers");


const ingredientName =
  document.getElementById("ingredient-name");


const ingredientDescription =
  document.getElementById("ingredient-description");


const ingredientInci =
  document.getElementById("ingredient-inci");


const ingredientCas =
  document.getElementById("ingredient-cas");


const ingredientCategory =
  document.getElementById("ingredient-category");



const currentPage =
  window.location.pathname
    .split("/")
    .filter(Boolean)
    .pop()
    .replace(".html", "");



async function loadIngredient() {

  try {

    const [
      ingredientResponse,
      supplierResponse
    ] = await Promise.all([

      fetch("../data/ingredients.json"),

      fetch("../data/suppliers.json")

    ]);


    if (
      !ingredientResponse.ok ||
      !supplierResponse.ok
    ) {

      throw new Error(
        "Database could not be loaded."
      );

    }


    const ingredientData =
      await ingredientResponse.json();


    const supplierData =
      await supplierResponse.json();



    const ingredient =
      ingredientData.ingredients.find(
        item => item.id === currentPage
      );


    if (!ingredient) {

      throw new Error(
        "Ingredient not found."
      );

    }



    displayIngredient(
      ingredient,
      supplierData.suppliers
    );


  } catch (error) {

    supplierContainer.innerHTML = `

      <div class="directory-placeholder">

        <strong>
          Ingredient information unavailable
        </strong>

        <span>
          ${error.message}
        </span>

      </div>

    `;

  }

}



function displayIngredient(
  ingredient,
  suppliers
) {


  ingredientName.textContent =
    ingredient.name;


  ingredientDescription.textContent =

    `${ingredient.name} ingredient profile including `
    + `chemical identity, formulation information, `
    + `and associated suppliers.`;


  ingredientInci.textContent =
    ingredient.inci;


  ingredientCas.textContent =
    ingredient.cas;


  ingredientCategory.textContent =
    ingredient.category;



  const connectedSuppliers =
    suppliers.filter(

      supplier =>
        ingredient.supplierIds.includes(
          supplier.id
        )

    );



  if (
    connectedSuppliers.length === 0
  ) {

    supplierContainer.innerHTML = `

      <div class="directory-placeholder">

        <strong>
          No suppliers listed yet
        </strong>

        <span>
          Miya Labs has not added supplier
          records for this ingredient yet.
        </span>

      </div>

    `;

    return;

  }



  supplierContainer.innerHTML =

    connectedSuppliers
      .map(supplier => `

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

            ${supplier.products
              .map(product => `

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

              `)
              .join("")}

          </div>


        </article>

      `)
      .join("");

}



loadIngredient();
