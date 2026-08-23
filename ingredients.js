const ingredientResults =
  document.getElementById("ingredient-results");

const ingredientSearch =
  document.getElementById("ingredient-search");

const ingredientCategory =
  document.getElementById("ingredient-category");

let ingredients = [];


/*
  Load ingredient database
*/

async function loadIngredients() {

  try {

    const response =
      await fetch("data/ingredients.json");

    if (!response.ok) {

      throw new Error(
        "Ingredient database could not be loaded."
      );

    }

    const data =
      await response.json();

    ingredients =
      Array.isArray(data.ingredients)
        ? data.ingredients
        : [];

    populateCategories();

    renderIngredients();

  }

  catch (error) {

    console.error(error);

    ingredientResults.innerHTML = `

      <div class="directory-placeholder">

        <strong>
          Ingredient database unavailable
        </strong>

        <span>
          Please try refreshing the page.
        </span>

      </div>

    `;

  }

}


/*
  Create category options
*/

function populateCategories() {

  const categories =
    [...new Set(
      ingredients.map(
        ingredient => ingredient.category
      )
    )].sort();


  categories.forEach(category => {

    const option =
      document.createElement("option");

    option.value =
      category;

    option.textContent =
      category;

    ingredientCategory.appendChild(
      option
    );

  });

}


/*
  Search + filtering
*/

function getFilteredIngredients() {

  const searchTerm =
    ingredientSearch.value
      .toLowerCase()
      .trim();


  const selectedCategory =
    ingredientCategory.value;


  return ingredients.filter(
    ingredient => {

      const searchableText = [

        ingredient.name,

        ingredient.inci,

        ingredient.cas,

        ingredient.category,

        ...(ingredient.aliases || [])

      ]
        .join(" ")
        .toLowerCase();


      const matchesSearch =
        searchableText.includes(
          searchTerm
        );


      const matchesCategory =
        selectedCategory === "all" ||
        ingredient.category ===
          selectedCategory;


      return (
        matchesSearch &&
        matchesCategory
      );

    }
  );

}


/*
  Render ingredient cards
*/

function renderIngredients() {

  const filtered =
    getFilteredIngredients();


  if (filtered.length === 0) {

    ingredientResults.innerHTML = `

      <div class="directory-placeholder">

        <strong>
          No ingredients found
        </strong>

        <span>
          Try another name, INCI name,
          CAS number, or category.
        </span>

      </div>

    `;

    return;

  }


  ingredientResults.innerHTML =
    filtered.map(
      ingredient => `

        <article
          class="ingredient-card"
        >

          <div
            class="ingredient-card-top"
          >

            <span
              class="ingredient-category"
            >
              ${escapeHTML(
                ingredient.category
              )}
            </span>

            <span
              class="ingredient-cas"
            >
              CAS ${escapeHTML(
                ingredient.cas
              )}
            </span>

          </div>


          <h2>
            ${escapeHTML(
              ingredient.name
            )}
          </h2>


          <p
            class="ingredient-inci"
          >

            INCI:
            <strong>
              ${escapeHTML(
                ingredient.inci
              )}
            </strong>

          </p>


          <p
            class="ingredient-aliases"
          >

            Also known as:
            ${escapeHTML(
              (ingredient.aliases || [])
                .join(", ")
            )}

          </p>


          <a
            class="text-link"
            href="${escapeHTML(
              ingredient.page
            )}"
          >
            View ingredient profile →
          </a>

        </article>

      `
    ).join("");

}


/*
  Basic HTML escaping
*/

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

ingredientSearch.addEventListener(
  "input",
  renderIngredients
);


ingredientCategory.addEventListener(
  "change",
  renderIngredients
);


/*
  Start
*/

loadIngredients();
