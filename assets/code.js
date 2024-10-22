  // Maze settings
  let mazeSize = 20;
  const canvas = document.getElementById('mazeCanvas');
  const ctx = canvas.getContext('2d');
  let cellSize;
  let maze;
  let player;
  let end;
  let playerPath = [];

  // Generate the maze when the page loads
  window.onload = () => {
      generateMaze();
  };

  // Event listeners for controls
  document.getElementById('generateMaze').addEventListener('click', generateMaze);
  document.getElementById('solveMaze').addEventListener('click', solveMaze);
  document.getElementById('mazeSize').addEventListener('change', (e) => {
      mazeSize = parseInt(e.target.value);
  });
  document.getElementById('showRoute').addEventListener('click', drawPlayerPath);

  // Listen for keyboard input
  document.addEventListener('keydown', movePlayer);

  function generateMaze() {
      maze = createArray(mazeSize, mazeSize);
      cellSize = canvas.width / mazeSize;
      initializeMaze();
      carveMaze();
      player = { x: 0, y: 0 };
      end = { x: mazeSize - 1, y: mazeSize - 1 };
      playerPath = [{ x: player.x, y: player.y }]; // Reset player path
      drawMaze();
      drawPlayer();
  }

  function initializeMaze() {
      for (let x = 0; x < mazeSize; x++) {
          for (let y = 0; y < mazeSize; y++) {
              maze[x][y] = {
                  x: x,
                  y: y,
                  walls: [true, true, true, true], // top, right, bottom, left
                  visited: false,
              };
          }
      }
  }

  // Maze generation using Recursive Backtracker (similar to DFS)
  function carveMaze() {
      let stack = [];
      let current = maze[0][0];
      current.visited = true;

      while (true) {
          let neighbors = getUnvisitedNeighbors(current);
          if (neighbors.length > 0) {
              let next = neighbors[Math.floor(Math.random() * neighbors.length)];
              removeWalls(current, next);
              stack.push(current);
              current = next;
              current.visited = true;
          } else if (stack.length > 0) {
              current = stack.pop();
          } else {
              break;
          }
      }
  }

  function getUnvisitedNeighbors(cell) {
      let neighbors = [];
      let { x, y } = cell;

      if (y > 0 && !maze[x][y - 1].visited) neighbors.push(maze[x][y - 1]);
      if (x < mazeSize - 1 && !maze[x + 1][y].visited) neighbors.push(maze[x + 1][y]);
      if (y < mazeSize - 1 && !maze[x][y + 1].visited) neighbors.push(maze[x][y + 1]);
      if (x > 0 && !maze[x - 1][y].visited) neighbors.push(maze[x - 1][y]);

      return neighbors;
  }

  function removeWalls(a, b) {
      let x = a.x - b.x;
      if (x === 1) {
          a.walls[3] = false;
          b.walls[1] = false;
      } else if (x === -1) {
          a.walls[1] = false;
          b.walls[3] = false;
      }
      let y = a.y - b.y;
      if (y === 1) {
          a.walls[0] = false;
          b.walls[2] = false;
      } else if (y === -1) {
          a.walls[2] = false;
          b.walls[0] = false;
      }
  }

  function drawMaze() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;

      for (let x = 0; x < mazeSize; x++) {
          for (let y = 0; y < mazeSize; y++) {
              let cell = maze[x][y];
              let px = x * cellSize;
              let py = y * cellSize;

              if (cell.walls[0]) {
                  ctx.beginPath();
                  ctx.moveTo(px, py);
                  ctx.lineTo(px + cellSize, py);
                  ctx.stroke();
              }
              if (cell.walls[1]) {
                  ctx.beginPath();
                  ctx.moveTo(px + cellSize, py);
                  ctx.lineTo(px + cellSize, py + cellSize);
                  ctx.stroke();
              }
              if (cell.walls[2]) {
                  ctx.beginPath();
                  ctx.moveTo(px + cellSize, py + cellSize);
                  ctx.lineTo(px, py + cellSize);
                  ctx.stroke();
              }
              if (cell.walls[3]) {
                  ctx.beginPath();
                  ctx.moveTo(px, py + cellSize);
                  ctx.lineTo(px, py);
                  ctx.stroke();
              }
          }
      }

      // Draw the end point
      ctx.fillStyle = 'green';
      ctx.fillRect(end.x * cellSize + cellSize / 4, end.y * cellSize + cellSize / 4, cellSize / 2, cellSize / 2);
  }

  function drawPlayer() {
      ctx.fillStyle = 'blue';
      ctx.beginPath();
      ctx.arc(player.x * cellSize + cellSize / 2, player.y * cellSize + cellSize / 2, cellSize / 4, 0, 2 * Math.PI);
      ctx.fill();
  }

  function movePlayer(e) {
      let key = e.key.toLowerCase();
      let x = player.x;
      let y = player.y;
      let cell = maze[x][y];

      let moved = false;

      if (key === 'w' && !cell.walls[0]) {
          player.y--;
          moved = true;
      }
      if (key === 'd' && !cell.walls[1]) {
          player.x++;
          moved = true;
      }
      if (key === 's' && !cell.walls[2]) {
          player.y++;
          moved = true;
      }
      if (key === 'a' && !cell.walls[3]) {
          player.x--;
          moved = true;
      }

      if (moved) {
          playerPath.push({ x: player.x, y: player.y });
      }

      drawMaze();
      drawPlayer();

      if (player.x === end.x && player.y === end.y) {
          alert('Congratulations, you reached the end!');
      }
  }

  function solveMaze() {
      let algorithm = document.getElementById('algorithm').value;
      let path = [];
      let visited = createArray(mazeSize, mazeSize, false);

      if (algorithm === 'bfs') {
          path = bfs();
      } else {
          path = dfs();
      }

      if (path === null) {
          alert('No solution is possible!');
          return;
      }

      animateSolution(path);
  }

  function bfs() {
      let queue = [];
      let visited = createArray(mazeSize, mazeSize, false);
      let prev = createArray(mazeSize, mazeSize, null);

      queue.push(maze[player.x][player.y]);
      visited[player.x][player.y] = true;

      while (queue.length > 0) {
          let cell = queue.shift();

          if (cell.x === end.x && cell.y === end.y) {
              break;
          }

          let neighbors = getNeighbors(cell);
          for (let neighbor of neighbors) {
              if (!visited[neighbor.x][neighbor.y]) {
                  queue.push(neighbor);
                  visited[neighbor.x][neighbor.y] = true;
                  prev[neighbor.x][neighbor.y] = cell;
              }
          }
      }

      if (!visited[end.x][end.y]) {
          return null; // No solution
      }

      let path = [];
      let cell = maze[end.x][end.y];
      while (cell) {
          path.push(cell);
          cell = prev[cell.x][cell.y];
      }
      return path.reverse();
  }

  function dfs() {
      let stack = [];
      let visited = createArray(mazeSize, mazeSize, false);
      let prev = createArray(mazeSize, mazeSize, null);

      stack.push(maze[player.x][player.y]);
      visited[player.x][player.y] = true;

      while (stack.length > 0) {
          let cell = stack.pop();

          if (cell.x === end.x && cell.y === end.y) {
              break;
          }

          let neighbors = getNeighbors(cell);
          for (let neighbor of neighbors) {
              if (!visited[neighbor.x][neighbor.y]) {
                  stack.push(neighbor);
                  visited[neighbor.x][neighbor.y] = true;
                  prev[neighbor.x][neighbor.y] = cell;
              }
          }
      }

      if (!visited[end.x][end.y]) {
          return null; // No solution
      }

      let path = [];
      let cell = maze[end.x][end.y];
      while (cell) {
          path.push(cell);
          cell = prev[cell.x][cell.y];
      }
      return path.reverse();
  }

  function getNeighbors(cell) {
      let neighbors = [];
      let { x, y } = cell;

      // Top
      if (!cell.walls[0] && y > 0) neighbors.push(maze[x][y - 1]);
      // Right
      if (!cell.walls[1] && x < mazeSize - 1) neighbors.push(maze[x + 1][y]);
      // Bottom
      if (!cell.walls[2] && y < mazeSize - 1) neighbors.push(maze[x][y + 1]);
      // Left
      if (!cell.walls[3] && x > 0) neighbors.push(maze[x - 1][y]);

      return neighbors;
  }

  function animateSolution(path) {
      let index = 0;
      let explorationInterval = setInterval(() => {
          if (index >= path.length) {
              clearInterval(explorationInterval);
              drawFinalPath(path);
              return;
          }
          drawMaze();
          ctx.fillStyle = 'yellow';
          for (let i = 0; i <= index; i++) {
              let cell = path[i];
              ctx.fillRect(cell.x * cellSize + cellSize / 4, cell.y * cellSize + cellSize / 4, cellSize / 2, cellSize / 2);
          }
          drawPlayer();
          index++;
      }, 100);
  }

  function drawFinalPath(path) {
      drawMaze();
      ctx.fillStyle = 'black';
      for (let cell of path) {
          ctx.beginPath();
          ctx.arc(cell.x * cellSize + cellSize / 2, cell.y * cellSize + cellSize / 2, cellSize / 6, 0, 2 * Math.PI);
          ctx.fill();
      }
      drawPlayer();
  }

  function drawPlayerPath() {
      drawMaze();
      // Draw the player's path
      ctx.fillStyle = 'purple';
      for (let i = 0; i < playerPath.length; i++) {
          let cell = playerPath[i];
          ctx.beginPath();
          ctx.arc(cell.x * cellSize + cellSize / 2, cell.y * cellSize + cellSize / 2, cellSize / 6, 0, 2 * Math.PI);
          ctx.fill();
      }
      drawPlayer();
  }

  function createArray(rows, cols, defaultValue = null) {
      let arr = [];
      for (let x = 0; x < rows; x++) {
          arr[x] = [];
          for (let y = 0; y < cols; y++) {
              arr[x][y] = defaultValue;
          }
      }
      return arr;
  }