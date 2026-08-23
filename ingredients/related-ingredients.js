document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("related-ingredients");

  if (!container) return;

  const ingredientId = document.body.dataset.ingredient;

  if (!ingredientId) {
    container.innerHTML = `
      <div class="directory-placeholder">
        <strong>Ingredient not specified</strong>
      </div>
    `;
    return;
  }

  loadRelatedIngredients(ingredientId, container);
});

async function loadRelatedIngredients(currentId, container) {

  try {

    const response = await fetch("../data/ingredients.json");

    if (!response.ok) {
      throw new Error("Unable to load ingredient database.");
    }

    const data = await response.json();

    const ingredients = data.ingredients || [];

    const currentIngredient = ingredients.find(
      ingredient => ingredient.id === currentId
    );

    if (!currentIngredient) {

      container.innerHTML = `
        <div class="directory-placeholder">
          <strong>Ingredient not found</strong>
        </div>
      `;

      return;
    }

    const related = ingredients.filter(ingredient =>
      currentIngredient.related.includes(ingredient.id)
    );

    if (related.length === 0) {

      container.innerHTML = `
        <div class="directory-placeholder">
          <strong>No related ingredients available.</strong>
        </div>
      `;

      return;
    }

    container.innerHTML = related.map(createCard).join("");

  }

  catch (error) {

    console.error(error);

    container.innerHTML = `
      <div class="directory-placeholder">
        <strong>Unable to load related ingredients.</strong>
      </div>
    `;

  }

}

function createCard(ingredient) {

  return `

    <article class="ingredient-card">

      <div class="ingredient-card-header">

        <span class="ingredient-category">
          ${escapeHTML(ingredient.category)}
        </span>

      </div>

      <h3>
        ${escapeHTML(ingredient.name)}
      </h3>

      <p>

        <strong>INCI</strong><br>

        ${escapeHTML(ingredient.inci)}

      </p>

      <p>

        <strong>CAS</strong><br>

        ${escapeHTML(ingredient.cas)}

      </p>

      <a
        class="button secondary"
        href="../${ingredient.page}"
      >

        View Ingredient

      </a>

    </article>

  `;
}

function escapeHTML(text) {

  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}
