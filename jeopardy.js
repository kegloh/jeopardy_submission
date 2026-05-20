// You only need to touch comments with the todo of this file to complete the assignment!

/*
=== How to build on top of the starter code? ===

Problems have multiple solutions.
We have created a structure to help you on solving this problem.
On top of the structure, we created a flow shaped via the below functions.
We left descriptions, hints, and to-do sections in between.
If you want to use this code, fill in the to-do sections.
However, if you're going to solve this problem yourself in different ways, you can ignore this starter code.
 */

/*
=== Terminology for the API ===

Clue: The name given to the structure that contains the question and the answer together.
Category: The name given to the structure containing clues on the same topic.
 */

/*
=== Data Structure of Request the API Endpoints ===

/categories:
[
  {
    "id": <category ID>,
    "title": <category name>,
    "clues_count": <number of clues in the category where each clue has a question, an answer, and a value>
  },
  ... more categories
]

/category:
{
  "id": <category ID>,
  "title": <category name>,
  "clues_count": <number of clues in the category>,
  "clues": [
    {
      "id": <clue ID>,
      "answer": <answer to the question>,
      "question": <question>,
      "value": <value of the question (be careful not all questions have values) (Hint: you can assign your own value such as 200 or skip)>,
      ... more properties
    },
    ... more clues
  ]
}
 */

const API_URL = "https://rithm-jeopardy.herokuapp.com/api/"; // The URL of the API.
const NUMBER_OF_CATEGORIES = 6; // The number of categories you will be fetching. You can change this number.
const NUMBER_OF_CLUES_PER_CATEGORY = 5; // The number of clues you will be displaying per category. You can change this number.

let categories = []; // The categories with clues fetched from the API.
/*
[
  {
    "id": <category ID>,
    "title": <category name>,
    "clues": [
      {
        "id": <clue ID>,
        "value": <value (e.g. $200)>,
        "question": <question>,
        "answer": <answer>
      },
      ... more categories
    ]
  },
  ... more categories
]
 */

let activeClue = null; // Currently selected clue data.
let activeClueMode = 0; // Controls the flow of #active-clue element while selecting a clue, displaying the question of selected clue, and displaying the answer to the question.
/*
0: Empty. Waiting to be filled. If a clue is clicked, it shows the question (transits to 1).
1: Showing a question. If the question is clicked, it shows the answer (transits to 2).
2: Showing an answer. If the answer is clicked, it empties (transits back to 0).
 */

let isPlayButtonClickable = true; // Only clickable when the game haven't started yet or ended. Prevents the button to be clicked during the game.

$("#play").on("click", handleClickOfPlay);

/**
 * Manages the behavior of the play button (start or restart) when clicked.
 * Sets up the game.
 *
 * Hints:
 * - Sets up the game when the play button is clickable.
 */
function handleClickOfPlay() {
  // todo set the game up if the play button is clickable
  if (isPlayButtonClickable) {
    isPlayButtonClickable = false;
    setupTheGame();
  }
}

/**
 * Sets up the game.
 *
 * 1. Cleans the game since the user can be restarting the game.
 * 2. Get category IDs
 * 3. For each category ID, get the category with clues.
 * 4. Fill the HTML table with the game data.
 *
 * Hints:
 * - The game play is managed via events.
 */
async function setupTheGame() {
  // todo show the spinner while setting up the game
  $("#spinner").removeClass("disabled");

  // todo reset the DOM (table, button text, the end text)
  $("#categories").empty();
  $("#clues").empty();
  $("#active-clue").html(null);
  $("#play").text("Loading...");

  // todo fetch the game data (categories with clues)
  categories = [];
  const categoryIds = await getCategoryIds();

  for (let id of categoryIds) {
    const categoryData = await getCategoryData(id);
    categories.push(categoryData);
  }

  // todo fill the table
  fillTable(categories);

  // Hide spinner and update button
  $("#spinner").addClass("disabled");
  $("#play").text("Restart the Game!");
  isPlayButtonClickable = true;
}

/**
 * Gets as many category IDs as in the `NUMBER_OF_CATEGORIES` constant.
 * Returns an array of numbers where each number is a category ID.
 *
 * Hints:
 * - Use /categories endpoint of the API.
 * - Request as many categories as possible, such as 100. Randomly pick as many categories as given in the `NUMBER_OF_CATEGORIES` constant, if the number of clues in the category is enough (<= `NUMBER_OF_CLUES` constant).
 */
async function getCategoryIds() {
  const ids = []; // todo set after fetching

  // todo fetch NUMBER_OF_CATEGORIES amount of categories
  let res = await axios.get(`${API_URL}categories?count=100`);

  // Filter categories that have enough clues
  let validCategories = res.data.filter(
    (cat) => cat.clues_count >= NUMBER_OF_CLUES_PER_CATEGORY
  );

  // Randomly pick NUMBER_OF_CATEGORIES categories using lodash
  let randomCategories = _.sampleSize(validCategories, NUMBER_OF_CATEGORIES);

  for (let cat of randomCategories) {
    ids.push(cat.id);
  }

  return ids;
}

/**
 * Gets category with as many clues as given in the `NUMBER_OF_CLUES` constant.
 * Returns the below data structure:
 *  {
 *    "id": <category ID>
 *    "title": <category name>
 *    "clues": [
 *      {
 *        "id": <clue ID>,
 *        "value": <value of the question>,
 *        "question": <question>,
 *        "answer": <answer to the question>
 *      },
 *      ... more clues
 *    ]
 *  }
 *
 * Hints:
 * - You need to call this function for each category ID returned from the `getCategoryIds` function.
 * - Use /category endpoint of the API.
 * - In the API, not all clues have a value. You can assign your own value or skip that clue.
 */
async function getCategoryData(categoryId) {
  const categoryWithClues = {
    id: categoryId,
    title: undefined, // todo set after fetching
    clues: [] // todo set after fetching
  };

  // todo fetch the category with NUMBER_OF_CLUES_PER_CATEGORY amount of clues
  let res = await axios.get(`${API_URL}category?id=${categoryId}`);

  categoryWithClues.title = res.data.title;

  // Pick NUMBER_OF_CLUES_PER_CATEGORY clues from the category
  let allClues = res.data.clues;
  let selectedClues = _.sampleSize(allClues, NUMBER_OF_CLUES_PER_CATEGORY);

  for (let i = 0; i < selectedClues.length; i++) {
    let clue = selectedClues[i];
    categoryWithClues.clues.push({
      id: clue.id,
      value: clue.value || (i + 1) * 200, // Assign value if missing
      question: clue.question,
      answer: clue.answer
    });
  }

  return categoryWithClues;
}

/**
 * Fills the HTML table using category data.
 *
 * Hints:
 * - You need to call this function using an array of categories where each element comes from the `getCategoryData` function.
 * - Table head (thead) has a row (#categories).
 *   For each category, you should create a cell element (th) and append that to it.
 * - Table body (tbody) has a row (#clues).
 *   For each category, you should create a cell element (td) and append that to it.
 *   Besides, for each clue in a category, you should create a row element (tr) and append it to the corresponding previously created and appended cell element (td).
 * - To this row elements (tr) should add an event listener (handled by the `handleClickOfClue` function) and set their IDs with category and clue IDs. This will enable you to detect which clue is clicked.
 */
function fillTable(categories) {
  // todo
  for (let category of categories) {
    // Create and append category header (th)
    let $th = $("<th>").text(category.title);
    $("#categories").append($th);

    // Create a td for this category's clues
    let $td = $("<td>");

    for (let clue of category.clues) {
      // Create a tr for each clue with an ID containing category and clue IDs
      let $tr = $("<tr>")
        .attr("id", `${category.id}-${clue.id}`)
        .addClass("clue")
        .text(`$${clue.value}`)
        .on("click", handleClickOfClue);

      $td.append($tr);
    }

    $("#clues").append($td);
  }
}

/**
 * Manages the behavior when a clue is clicked.
 * Displays the question if there is no active question.
 *
 * Hints:
 * - Control the behavior using the `activeClueMode` variable.
 * - Identify the category and clue IDs using the clicked element's ID.
 * - Remove the clicked clue from categories since each clue should be clickable only once. Don't forget to remove the category if all the clues are removed.
 * - Don't forget to update the `activeClueMode` variable.
 *
 */
function handleClickOfClue(event) {
  // Only allow clicking a clue if no question is currently active
  if (activeClueMode !== 0) return;

  // todo find and remove the clue from the categories
  let clickedId = $(event.target).attr("id");
  let [categoryId, clueId] = clickedId.split("-").map(Number);

  // Find the category and clue
  let categoryIndex = categories.findIndex((cat) => cat.id === categoryId);
  if (categoryIndex === -1) return;

  let category = categories[categoryIndex];
  let clueIndex = category.clues.findIndex((clue) => clue.id === clueId);
  if (clueIndex === -1) return;

  // Get the clue data before removing
  activeClue = category.clues[clueIndex];

  // Remove the clue from the category
  category.clues.splice(clueIndex, 1);

  // If no more clues in this category, remove the category
  if (category.clues.length === 0) {
    categories.splice(categoryIndex, 1);
  }

  // todo mark clue as viewed (you can use the class in style.css), display the question at #active-clue
  $(event.target).addClass("viewed");
  $(event.target).off("click"); // Remove click handler so it can't be clicked again

  activeClueMode = 1;
  $("#active-clue").html(activeClue.question);
}

$("#active-clue").on("click", handleClickOfActiveClue);

/**
 * Manages the behavior when a displayed question or answer is clicked.
 * Displays the answer if currently displaying a question.
 * Clears if currently displaying an answer.
 *
 * Hints:
 * - Control the behavior using the `activeClueMode` variable.
 * - After clearing, check the categories array to see if it is empty to decide to end the game.
 * - Don't forget to update the `activeClueMode` variable.
 */
function handleClickOfActiveClue(event) {
  // todo display answer if displaying a question

  // todo clear if displaying an answer
  // todo after clear end the game when no clues are left

  if (activeClueMode === 1) {
    activeClueMode = 2;
    $("#active-clue").html(activeClue.answer);
  }
  else if (activeClueMode === 2) {
    activeClueMode = 0;
    $("#active-clue").html(null);

    if (categories.length === 0) {
      isPlayButtonClickable = true;
      $("#play").text("Restart the Game!");
      $("#active-clue").html("The End!");
    }
  }
}
