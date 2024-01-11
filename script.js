const recipeInput = document.querySelector("#recipeInput");
const recipeBtn = document.querySelector("#recipeBtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetail = document.querySelector(".recipe-detail");
const recipeClosebtn = document.querySelector(".recipe-close-btn");
const recipeDetailContent = document.querySelector(".recipe-detail-content");
const textOnContainer = document.querySelector(".text-on-container");

const setStatusMessage = (message) => {
  textOnContainer.textContent = message;
};

const fetchRecipes = async (query) => {
  try {
    setStatusMessage(query ? "Searching..." : "Loading random recipes...");

    const apiUrl = query
      ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      : "https://www.themealdb.com/api/json/v1/1/search.php?s= ";

    const data = await fetch(apiUrl);
    const fetchData = await data.json();

    recipeContainer.innerHTML = " ";

    if (!query && !fetchData.meals) {
      setStatusMessage("No recipes found.");
      return;
    }

    fetchData.meals.forEach((meal) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");
      recipeDiv.innerHTML = `
        <img src=${meal.strMealThumb}>
        <h2>${meal.strMeal}</h2>
        <h4>${meal.strCategory}</h4>
        <h5>${meal.strArea}</h5>
      `;
      const recipeBtn = document.createElement("button");
      recipeBtn.textContent = "view more";
      recipeDiv.appendChild(recipeBtn);

      recipeBtn.addEventListener("click", () => {
        openRecipePop(meal);
      });
      recipeContainer.appendChild(recipeDiv);
    });

    setStatusMessage(""); // Clear the status message
  } catch (err) {
    console.error(err);
    setStatusMessage("An error occurred while fetching recipes.");
  }
};

const fetchIngrediant = (data) => {
  let IngredientsList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = data[`strIngredient${i}`];
    if (ingredient) {
      const measure = data[`strMeasure${i}`];
      IngredientsList += `<li>${measure} : ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return IngredientsList;
};

const openRecipePop = (query) => {
  recipeDetailContent.innerHTML = `
    <h2 class="recipeName">${query.strMeal} </h2>
    <h3 style="margin-bottom:20px"> Ingredients:</h3>
    <ul class="ingredientlist">${fetchIngrediant(query)}</ul>
    <div class="recipeInstruction">
      <h3>Instructions:</h3>
      <p>${query.strInstructions}</p>
    </div>      
  `;
  recipeDetailContent.parentElement.style.display = "block";
};

recipeClosebtn.addEventListener("click", () => {
  recipeDetailContent.parentElement.style.display = "none";
});

recipeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const inputValue = recipeInput.value.trim();
  fetchRecipes(inputValue);
});

document.addEventListener("DOMContentLoaded", () => {
  fetchRecipes(""); // Display random recipes on page load
});
