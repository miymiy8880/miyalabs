const nameElement =
  document.getElementById("ingredient-name");

const descriptionElement =
  document.getElementById("ingredient-description");

const inciElement =
  document.getElementById("ingredient-inci");

const casElement =
  document.getElementById("ingredient-cas");

const categoryElement =
  document.getElementById("ingredient-category");

const categoryCardElement =
  document.getElementById(
    "ingredient-category-card"
  );

const overviewTitleElement =
  document.getElementById("overview-title");

const overviewTextElement =
  document.getElementById("overview-text");

const aliasesContainer =
  document.getElementById("ingredient-aliases");

const supplierContainer =
  document.getElementById("ingredient-suppliers");

const metaDescription =
  document.getElementById("meta-description");



function getIngredientId() {

  const parameters =
    new URLSearchParams(
      window.location.search
    );

  return parameters.get("id");

}



async function loadIngredient() {

  const ingredientId =
    getIngredientId();


  if (!ingredientId) {

    showError(
      "No ingredient was specified."
    );

    return;

  }


  try {

    const [
      ingredientResponse,
      supplierResponse
    ] = await Promise.all([

      fetch("data/ingredients.json"),

      fetch("data/suppliers.json")

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

        item =>
          item.id === ingredientId

      );


    if (!ingredient) {

      throw new Error(
        "Ingredient not found."
      );

    }


    renderIngredient(
      ingredient,
      supplierData.suppliers
    );


  } catch (error) {

    showError(
      error.message
    );

  }

}



function renderIngredient(
  ingredient,
  suppliers
) {


  document.title =
    `${ingredient.name} | Miya Labs`;


  nameElement.textContent =
    ingredient.name;


  descriptionElement.textContent =

    `${ingredient.name} (${ingredient.inci}) — `
    + `cosmetic ingredient information, `
    + `chemical identity, and supplier intelligence.`;


  metaDescription.setAttribute(
    "content",
    `${ingredient.name} cosmetic ingredient profile, `
    + `INCI ${ingredient.inci}, CAS ${ingredient.cas}, `
    + `and supplier information.`
  );


  inciElement.textContent =
    ingredient.inci;


  casElement.textContent =
    ingredient.cas;


  categoryElement.textContent =
    ingredient.category.toUpperCase();


  categoryCardElement.textContent =
    ingredient.category;


  overviewTitleElement.textContent =
    `About ${ingredient.name}`;


  overviewTextElement.textContent =

    `${ingredient.name} is a cosmetic ingredient `
    + `listed in the Miya Labs ingredient database. `
    + `Its properties, applications, formulation `
    + `considerations, and commercial grades should `
    + `be evaluated using appropriate technical `
    + `documentation and authoritative sources.`;



  renderAliases(
    ingredient.aliases
  );


  renderSuppliers(
    ingredient,
    suppliers
  );

}



function renderAliases(
  aliases
) {

  if (
    !aliases ||
    aliases.length === 0
  ) {

    aliasesContainer.innerHTML = `
      <article class="card">
        <p>No aliases listed.</p>
      </article>
    `;

    return;

  }


  aliasesContainer.innerHTML =

    aliases.map(alias => `

      <article class="card">

        <span>
          ALIAS
        </span>

        <h3>
          ${alias}
        </h3>

      </article>

    `).join("");

}



function renderSuppliers(
  ingredient,
  suppliers
) {


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

    connectedSuppliers.map(
      supplier => `

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

            ${supplier.products.map(
              product => `

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

              `
            ).join("")}

          </div>


        </article>

      `
    ).join("");

}



function showError(
  message
) {

  nameElement.textContent =
    "Ingredient unavailable";


  descriptionElement.textContent =
    message;


  supplierContainer.innerHTML = `

    <div class="directory-placeholder">

      <strong>
        Unable to load ingredient
      </strong>

      <span>
        ${message}
      </span>

    </div>

  `;

}



loadIngredient();
