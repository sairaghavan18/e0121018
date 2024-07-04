const express = require('express');
const app = express();
const PORT = 9876;

const numbers = {
  p: [],
  e: [],
  r: [],
  f: []
};

const maxWindowSize = 10;

// Mock function to fetch numbers from a server
async function fetchNumber(category) {
  // Mocking different categories of numbers
  const mocks = {
    p: Math.floor(Math.random() * 50) + 1, // Random prime number
    e: Math.floor(Math.random() * 50) * 2, // Random even number
    r: Math.floor(Math.random() * 100),    // Random number
    f: Math.floor(Math.random() * 50)      // Random Fibonacci number
  };
  return mocks[category];
}

async function addNumberAndCalculateAverage(category) {
  const number = await fetchNumber(category);
  const previousState = [...numbers[category]];

  if (numbers[category].length >= maxWindowSize) {
    numbers[category].shift();
  }
  numbers[category].push(number);

  const sum = numbers[category].reduce((acc, curr) => acc + curr, 0);
  const average = sum / numbers[category].length;

  return {
    previousState,
    currentState: [...numbers[category]],
    average
  };
}

app.get('/numbers/:numberid', async (req, res) => {
  const category = req.params.numberid;
  if (!['p', 'e', 'r', 'f'].includes(category)) {
    return res.status(400).send('Invalid category');
  }

  try {
    const result = await addNumberAndCalculateAverage(category);
    res.json({
      number: result.currentState,
      windowprestate: result.previousState,
      windowcurrstate: result.currentState,
      avg: result.average.toFixed(2)
    });
  } catch (error) {
    res.status(500).send('Error calculating average');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
