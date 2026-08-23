document.addEventListener("DOMContentLoaded", () => {

  loadIngredient();

});


async function loadIngredient() {

  const params = new URLSearchParams(window.location.search);

  const ingredientId = params.get("id");


  if (!ingredientId) {

    showError(
      "No ingredient was specified.",
      "Return to the ingredient library and select an ingredient."
    );

    return;

  }


  try {

    const [ingredientsResponse, profilesResponse] =
      await Promise.all([

        fetch("data/ingredients.json"),

        fetch("data/ingredient-profiles.json")

      ]);


    if (!ingredientsResponse.ok) {

      throw new Error(
        "Unable to load ingredients.json"
      );

    }


    if (!profilesResponse.ok) {

      throw new Error(
        "Unable to load ingredient-profiles.json"
      );

    }


    const ingredientsData =
      await ingredientsResponse.json();


    const profilesData =
      await profilesResponse.json();


    const ingredients =
      ingredientsData.ingredients || [];


    const ingredient =
      ingredients.find(
        item => item.id === ingredientId
      );


    if (!ingredient) {

      showError(
        "Ingredient not found.",
        "The requested ingredient does not exist in the MIYA LABS database."
      );

      return;

    }


    const profile =
      profilesData[ingredientId];


    renderIngredient(
      ingredient,
      profile
    );


  } catch (error) {

    console.error(error);


    showError(
      "Unable to load ingredient.",
      "There was a problem loading the ingredient database."
    );

  }

}



function renderIngredient(
  ingredient,
  profile
) {


  const title =
    profile?.title ||
    ingredient.name;


  const description =
    profile?.lead ||
    `${ingredient.name} ingredient information from MIYA LABS.`;


  document.title =
    `${title} | MIYA LABS`;


  document
    .getElementById("meta-description")
    .setAttribute(
      "content",
      description
    );


  document
    .getElementById("ingredient-name")
    .textContent =
      title;


  document
    .getElementById("ingredient-lead")
    .textContent =
      description;


  document
    .getElementById("ingredient-category")
    .textContent =
      ingredient.category;


  document
    .getElementById("ingredient-symbol")
    .textContent =
      profile?.symbol || "";


  document
    .getElementById("ingredient-inci")
    .textContent =
      ingredient.inci || "—";


  document
    .getElementById("ingredient-cas")
    .textContent =
      ingredient.cas || "—";


  document
    .getElementById("ingredient-category-data")
    .textContent =
      ingredient.category || "—";


  document
    .getElementById("ingredient-aliases")
    .textContent =
      ingredient.aliases?.join(", ") || "—";


  renderOverview(
    ingredient,
    profile
  );


  renderConsiderations(
    profile
  );


  renderReference(
    profile
  );


  document.body.dataset.ingredient =
    ingredient.id;

}



function renderOverview(
  ingredient,
  profile
) {


  const titleElement =
    document.getElementById(
      "overview-title"
    );


  const overviewElement =
    document.getElementById(
      "ingredient-overview"
    );


  titleElement.textContent =
    profile?.overviewTitle ||
    `About ${ingredient.name}`;


  const paragraphs =
    profile?.overview || [];


  if (!paragraphs.length) {

    overviewElement.innerHTML = `

      <p>
        Technical information for this ingredient
        is currently being developed.
      </p>

    `;

    return;

  }


  overviewElement.innerHTML =
    paragraphs
      .map(
        paragraph =>
          `<p>${escapeHTML(paragraph)}</p>`
      )
      .join("");

}



function renderConsiderations(
  profile
) {


  const container =
    document.getElementById(
      "formulation-considerations"
    );


  const considerations =
    profile?.considerations || [];


  if (!considerations.length) {

    container.innerHTML = `

      <div class="directory-placeholder">

        <strong>
          Formulation information is being developed.
        </strong>

      </div>

    `;

    return;

  }


  container.innerHTML =
    considerations
      .map(item => `

        <article class="consideration">

          <h3>
            ${escapeHTML(item.title)}
          </h3>

          <p>
            ${escapeHTML(item.text)}
          </p>

        </article>

      `)
      .join("");

}



function renderReference(
  profile
) {


  const container =
    document.getElementById(
      "ingredient-reference"
    );


  const reference =
    profile?.reference;


  if (!reference) {

    container.innerHTML = `

      <p>
        No technical reference has been added yet.
      </p>

    `;

    return;

  }


  const wrapper =
    document.createElement("div");


  wrapper.className =
    "reference-item";


  const link =
    document.createElement("a");


  link.href =
    reference.url;


  link.target =
    "_blank";


  link.rel =
    "noopener noreferrer";


  link.textContent =
    reference.name;


  const description =
    document.createElement("p");


  description.textContent =
    reference.description || "";


  wrapper.appendChild(link);

  wrapper.appendChild(description);

  container.appendChild(wrapper);

}



function showError(
  title,
  message
) {


  document
    .getElementById("ingredient-page")
    .innerHTML = `

      <section class="section error-page">

        <p class="eyebrow">
          MIYA LABS
        </p>

        <h1>
          ${escapeHTML(title)}
        </h1>

        <p>
          ${escapeHTML(message)}
        </p>

        <a
          class="button primary"
          href="ingredients.html"
        >
          Return to Ingredients
        </a>

      </section>

    `;

}



function escapeHTML(value) {

  return String(value)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}
