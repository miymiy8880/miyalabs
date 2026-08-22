const ingredientContainer =
  document.getElementById("ingredient-results");

const searchInput =
  document.getElementById("ingredient-search");

const categoryFilter =
  document.getElementById("ingredient-category");


let ingredients = [];


async function loadIngredients() {

  try {

    const response =
      await fetch("data/ingredients.json");


    if (!response.ok) {
      throw new Error(
        "Could not load ingredient database."
      );
    }


    const data =
      await response.json();


    ingredients =
      data.ingredients;


    renderIngredients();


  } catch (error) {

    ingredientContainer.innerHTML = `

      <div class="directory-placeholder">

        <strong>
          Ingredient database unavailable
        </strong>

        <span>
          Please try again later.
        </span>

      </div>

    `;

  }

}



function renderIngredients() {

  const searchTerm =
    searchInput.value
      .toLowerCase()
      .trim();


  const category =
    categoryFilter.value;


  const filtered =
    ingredients.filter(ingredient => {


      const searchableText = [

        ingredient.name,

        ingredient.inci,

        ingredient.cas,

        ingredient.category,

        ...ingredient.aliases

      ]
        .join(" ")
        .toLowerCase();


      const matchesSearch =
        searchableText.includes(searchTerm);


      const matchesCategory =
        category === "all" ||
        ingredient.category === category;


      return (
        matchesSearch &&
        matchesCategory
      );

    });


  if (filtered.length === 0) {

    ingredientContainer.innerHTML = `

      <div class="directory-placeholder">

        <strong>
          No ingredients found
        </strong>

        <span>
          Try another ingredient,
          INCI name, or CAS number.
        </span>

      </div>

    `;

    return;

  }



  ingredientContainer.innerHTML =

    filtered.map(ingredient => `

      <article class="supplier-result">

        <div class="supplier-meta">

          <span>
            ${ingredient.category.toUpperCase()}
          </span>

          <span>
            CAS ${ingredient.cas}
          </span>

        </div>


        <h3>
          ${ingredient.name}
        </h3>


        <p>

          <strong>INCI:</strong>
          ${ingredient.inci}

        </p>


        <p>

          <strong>Also known as:</strong>
          ${ingredient.aliases.join(", ")}

        </p>


        <a
          class="text-link"
          href="${ingredient.page}"
        >
          View ingredient profile →
        </a>

      </article>

    `).join("");

}



searchInput.addEventListener(
  "input",
  renderIngredients
);


categoryFilter.addEventListener(
  "change",
  renderIngredients
);


loadIngredients();
