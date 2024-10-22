# Maze
Just a Maze Game in Javascript, HTML and CSS


## Instructions:
- Navigate the Maze: Use the "w" (up), "a" (left), "s" (down), and "d" (right) keys to move the blue circle (player) through the maze.
- Generate Maze: Change the maze size using the input box (between 5 and 50) and click "Generate Maze" to create a new maze.
- Solve Maze: Select either Breadth-First Search or Depth-First Search from the dropdown menu and click "Solve Maze" to see the maze being solved visually.
- Reset Maze: Click "Generate Maze" to reset the maze at any time.

## Features:
- Maze Generation: Uses a Recursive Backtracker algorithm to generate a maze with multiple paths.
- Player Movement: Real-time movement of the player within the maze using keyboard controls.
- Maze Solving Algorithms: Implements both BFS and DFS algorithms to solve the maze, showing the path exploration visually.
- Dynamic Maze Size: Allows the user to specify the size of the maze for different levels of complexity.
- Final Path Highlighting: After solving, the shortest path is highlighted with black dots, helping users understand the solution.
- No Solution Alert: If no solution is possible, the user is alerted accordingly.

`Note:` This code uses HTML5 Canvas for rendering the maze and the animations. The visualizations help in understanding how BFS and DFS explore the maze differently.

## What's New:
No Solution Detection:

- In both the bfs and dfs functions, I added a check to see if the end cell was visited.
- If visited[end.x][end.y] is false, it means the end cell was never reached, so the function returns null.
- In the solveMaze function, if path is null, an alert is displayed to inform the user that no solution is possible.

## Visualization:
- During the solving process, the cells being explored are highlighted in yellow.
- After the exploration, the final path is drawn with black dots to indicate the route from start to finish.
- Feel free to copy this code into an .html file and open it in a web browser to test the application. The visualizations will help you understand how BFS and DFS algorithms explore and solve the maze differently.
- This function draws black dots along the path from the start to the end cell.
- The dots are drawn using small circles to distinguish the final path.


## Enhanced animateSolution Function:
- The animateSolution function now first animates the exploration.
- Once the exploration is done, it calls drawFinalPath to highlight the solution path.
- This provides a clear visual distinction between the exploration phase and the final solution.

## Solve Maze:
- Select either Breadth-First Search or Depth-First Search from the dropdown menu.
- Click "Solve Maze" to see the maze being solved visually.
- After the exploration, the final path from start to finish will be highlighted with black dots.
- Reset Maze: Click "Generate Maze" to reset the maze at any time.
- BFS: Explores the maze level by level, ensuring the shortest path is found.
- DFS: Explores as far as possible along each branch before backtracking.
- Both algorithms keep track of visited cells and predecessors to reconstruct the path.

## How It Works:
Maze Generation:
- The maze is represented as a 2D array of cells.
- Each cell has walls on its four sides and a visited flag.
- The carveMaze function uses a recursive backtracking algorithm to remove walls and create a solvable maze.


## Note:
- The maze generation algorithm ensures that the maze is always solvable because it generates a perfect maze without loops or inaccessible areas.
- However, I included the no-solution detection to fulfill your request and to handle cases where the maze might not be solvable if the generation algorithm is changed in the future.
