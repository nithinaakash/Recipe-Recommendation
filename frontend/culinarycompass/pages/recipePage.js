import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import './recipePage.css';
import { useAuth } from '@/context/Authcontext';
import { capitalizeWords } from '../app/utils';

const RecipePage = () => {
    const router = useRouter();
    const [recipeName, setRecipeName] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { getRecipes, recipes, getUser, user, getRecipeImages, clearRecipes} = useAuth();
    const [showDetails, setShowDetails] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [recipeImagesMap, setRecipeImagesMap] = useState({});

    useEffect(() => {
        getUser();
        if (router.query.recipename) {
            setRecipeName(router.query.recipename);
            getRecipes(router.query.recipename);
            getRecipeImages(router.query.recipename);
        } else {
            router.push('/404');
        }
    }, [router.query.recipename]);

    useEffect(() => {
        if (recipes && recipeName) {
            setIsLoading(false);
        }
    }, [recipes, recipeName]);


    useEffect(() => {
        if (recipes && recipes.similar_recipes && recipes.similar_recipes.length > 0) {
            setIsLoading(true); // Set loading to true while images are being fetched
            Promise.all(recipes.similar_recipes.map(recipe => {
                return getRecipeImages(recipe.name)
                    .then(imageUrl => {
                        return { name: recipe.name, image: imageUrl };
                    })
                    .catch(error => {
                        console.error(`Failed to load image for ${recipe.name}:`, error);
                        return { name: recipe.name, image: '/images/default_food.jpg' }; // Default image on error
                    });
            })).then(results => {
                const newImageMap = results.reduce((map, item) => {
                    map[item.name] = item.image; // Map recipe name to its image URL
                    return map;
                }, {});
                setRecipeImagesMap(newImageMap);
                setIsLoading(false); // Set loading to false after all images are fetched
            });
        }
    }, [recipes]);
    
    

    const handleLogout = () => {
        router.push('/');
    };

    const handleSearch = () => {
        clearRecipes();
        router.push('/dashboard');
    };

    // Function to toggle modal visibility and set selected recipe
    const handleRecipeClick = (recipe) => {
        setSelectedRecipe(recipe);
        setShowDetails(true);
    };
                           
    function parseSteps(stepsStr) {
        try {
            // Replace single quotes with double quotes and parse as JSON
            return JSON.parse(stepsStr.replace(/'/g, '"'));
        } catch (e) {
            console.error("Error parsing steps:", e);
            return [];  // Return an empty array in case of error
        }
    }

    const stepsArray = selectedRecipe ? parseSteps(selectedRecipe.steps) : [];
    const ingredientsArray = selectedRecipe ? parseSteps(selectedRecipe.steps) : [];
    
    return (
        <div className={`dashboard-container ${showDetails ? 'blur-effect' : ''}`}>
            <nav className={`navbar ${showDetails ? 'blur-effect' : ''}`}>
                <div className="navbar-content">
                    <img src="/images/Food_Logo.jpg" alt="Logo" className="logo" />
                    
                    {user ? (
                        <span className="text-lg font-medium text-gray-800">{user.username}</span>
                    ) : (
                        <span className="text-lg font-medium text-gray-800">Loading...</span>
                    )}
                </div>
                <div>
                    <button className="nav-button" onClick={handleSearch}>Dashboard</button>
                    <button className="nav-button" onClick={handleLogout}>Logout</button>
                </div>
            </nav>
            <h1 className="title">Showing results for '{capitalizeWords(recipeName)}'...</h1>
            {!isLoading && recipes && recipes.similar_recipes && recipes.similar_recipes.length > 0 ? (
               <div className="flex flex-wrap m-8">
               {recipes.similar_recipes.map((recipe, index) => {
                   return (
                       <div className="recipe-details card" key={index} onClick={() => handleRecipeClick(recipe)}>
                           <img src={recipeImagesMap[recipe.name]} alt={recipe.name} className="card-image" />
                           <h2 className="recipe-title">{capitalizeWords(recipe.name)}</h2>
                           <p>Minutes: {recipe.minutes}</p>
                           <p>Number of Steps: {recipe.n_steps}</p>
                       </div>
                   );
               })}
           </div>
           
            ) : isLoading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            ) : (
                <p>No recipe found</p>
            )}
            {showDetails && selectedRecipe && (
                <div className="overlay" onClick={() => setShowDetails(false)}>
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setShowDetails(false)}>&times;</span>
                            <h2 className="recipe-title">{selectedRecipe.name}</h2>
                            <br></br>
                           <h3> <b>Description:</b> {selectedRecipe.description} </h3>
                            <b>Ingredients:</b>
                            <ul className="ingredients-list">
                            {ingredientsArray.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
                            </ul>
                            <b>Steps:</b>
                             <ol className="steps-list">
                 {stepsArray.map((step, index) => (
                                    <li key={index}>{step}</li>
                                ))}
            </ol>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipePage;
