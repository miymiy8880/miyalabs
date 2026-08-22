const ingredientContainer =
  document.getElementById("ingredient-suppliers");

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
  document.getElementById("ingredient-category-card");

const overviewTitleElement =
  document.getElementById("overview-title");

const overviewTextElement =
  document.getElementById("overview-text");

const aliasesContainer =
  document.getElementById("ingredient-aliases");

const metaDescription =
  document.getElementById("meta-description");


function getIngredientId() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return params.get("id");

}


async function loadIngredient() {

  const ingredientId =
    getIngredientId();


  if (!ingredientId) {

    showError(
      "No ingredient ID was provided."
    );

    return;

  }


  try {

    const ingredientResponse =
      await fetch("./data/ingredients.json");


    if (!ingredientResponse.ok) {

      throw new Error(
        "Could not load ingredients.json"
      );

    }


    const ingredientData =
      await ingredientResponse.json();


    const ingredient =
      ingredientData.ingredients.find(
        item => item.id === ingredientId
      );


    if (!ingredient) {

      throw new Error(
        `Ingredient "${ingredientId}" was not found in the database.`
      );

    }


    let suppliers = [];


    try {

      const supplierResponse =
        await fetch("./data/suppliers.json");


      if (supplierResponse.ok) {

        const supplierData =
          await supplierResponse.json();

        suppliers =
          supplierData.suppliers || [];

      }

    } catch (supplierError) {

      console.log(
        "Supplier database unavailable."
      );

    }


    renderIngredient(
      ingredient,
      suppliers
    );


  } catch (error) {

    console.error(error);

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
    `${ingredient.name} cosmetic ingredient profile, `
    + `including chemical identity and supplier information.`;


  metaDescription.setAttribute(
    "content",
    `${ingredient.name} cosmetic ingredient profile. `
    + `INCI: ${ingredient.inci}. `
    + `CAS: ${ingredient.cas}.`
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
    `${ingredient.name} is included in the Miya Labs `
    + `cosmetic ingredient database. Technical properties, `
    + `formulation considerations, and commercial grades `
    + `should be evaluated using appropriate technical `
    + `documentation.`;


  renderAliases(
    ingredient.aliases || []
  );


  renderSuppliers(
    ingredient,
    suppliers
  );

}


function renderAliases(
  aliases
) {

  if (aliases.length === 0) {

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

  const supplierIds =
    ingredient.supplierIds || [];


  const connectedSuppliers =
    suppliers.filter(
      supplier =>
        supplierIds.includes(
          supplier.id
        )
    );


  if (
    connectedSuppliers.length === 0
  ) {

    ingredientContainer.innerHTML = `

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


  ingredientContainer.innerHTML =
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


  ingredientContainer.innerHTML = `

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
