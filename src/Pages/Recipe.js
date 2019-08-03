import React, { useState, useEffect } from "react";
import SocialIcons from "../Components/SocialIcons";
import Tabs from "../Components/Tabs";
import Loader from "../Components/Loader";
import Ingredients from "../Components/Ingredients";
import Directions from "../Components/Directions";
import { Link } from "@reach/router";

const Recipe = props => {
  const [recipeData, setRecipeData] = useState("");
  const [isLoading, setLoadState] = useState(true);
  const [active, setActive] = useState("Ingredients");

  useEffect(() => {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${props.id}`)
      .then(response => response.json())
      .then(data => setRecipeData(data.meals[0]))
      .then(() => setLoadState(false))
      .catch(error => console.log(error));
  }, []);

  function IngredientPair(ingredient, unit) {
    this.ingredient = ingredient;
    this.unit = unit;
  }

  let handleIngredients = dataObj => {
    let arr = [];
    for (let i = 1; i < 20; i++) {
      let ing = `strIngredient${i}`;
      let unit = `strMeasure${i}`;
      arr.push(new IngredientPair(dataObj[ing], dataObj[unit]));
    }
    return arr.filter(item => item.ingredient);
  };

  let ingredients = handleIngredients(recipeData);

  return (
    <div>
      <Link to="/results">Back</Link>
      {isLoading ? (
        <Loader />
      ) : (
        <article className="recipe">
          <div className="recipe-main">
            <img
              src={recipeData.strMealThumb}
              alt={recipeData.strMeal}
              className="recipe__img"
            />
            <div className="recipe-details">
              <h1 className="recipe__title">{recipeData.strMeal}</h1>
              <p className="recipe__info">
                {recipeData.strCategory} | {recipeData.strArea}
              </p>
              <SocialIcons />
            </div>
          </div>
          <div className="recipe-instructions-mobile">
            <Tabs
              items={["Ingredients", "Directions"]}
              action={setActive}
              active={active}
            />
            {active === "Ingredients" ? (
              <Ingredients ingredients={ingredients} />
            ) : (
              <Directions
                link={recipeData.strYoutube}
                directions={recipeData.strInstructions.split(/\r\n/g)}
              />
            )}
          </div>
          <div className="recipe-instructions-desktop">
            <Ingredients ingredients={ingredients} />
            <Directions
              link={recipeData.strYoutube}
              directions={recipeData.strInstructions.split(/\r\n/g)}
            />
          </div>
        </article> //
      )}
    </div>
  );
};

export default Recipe;
