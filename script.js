let grid_size_x = 10;
let grid_size_y = grid_size_x;
let square_size_height = 40;
let square_size_width = 40;
let grid = document.getElementById("massive-grid");
let current_scale = 1.0;
let path_len = grid_size_x * grid_size_y;
let grid_matrix = [];
let selected;
let num_obstacle = 23;

const pirate_music = new Audio("assets/pirate_music.mp3"); //music
pirate_music.loop = true;
pirate_music.volume = 0.3;

function init() {
  draw_grid(grid_size_x, grid_size_y);
  add_obstacles(num_obstacle);
}

function draw_grid(height, width) {
  let grid_width = width * square_size_width + width * 2;

  grid.style.width = `${grid_width}px`;

  for (let i = 0; i < height; i++) {
    grid_matrix.push([]);

    for (let j = 0; j < width; j++) {
      let square = document.createElement("div");
      square.classList.add("square");

      square.style.height = `${square_size_height}px`;

      square.style.width = `${square_size_width}px`;
      square.dataset.i = i;
      square.dataset.j = j;
      square.addEventListener("click", square_click);
      grid.appendChild(square);
      grid_matrix[i].push(square);
    }
  }
}

function add_obstacles(num_obstacle) {
  let added_obstacle = 0;
  
  while (added_obstacle < num_obstacle) {
    let i = Math.floor(Math.random() * grid_size_x);
    let j = Math.floor(Math.random() * grid_size_y);
    let node = grid_matrix[i][j];
    
    if (!node.classList.contains("start") && !node.classList.contains("end") && !node.classList.contains("obstacle")) {
      node.classList.add("obstacle");
      added_obstacle++;
    }
  }
}

function limit_input_obstacle(input) {
  if (input.value > 100) {
    input.value = input.max;
  }
}

function limit_input_x(input) {
  if (input.value > 20) {
    input.value = input.max;
  }
}

function limit_input_y(input) {
  if (input.value > 20) {
    input.value = input.max;
  }
}

let startNode = null;
let endNode = null;

function square_click(event) {
  let elem = event.target;

  if (elem.classList.contains("obstacle")) {
    return;
  }
  
  if (startNode === null) {
    startNode = elem;
    elem.classList.add("start");
  } else if (endNode === null) {
    endNode = elem;

    if(draw_path() == false) {
      elem.classList.add("end2");
    }else {
    elem.classList.add("end");
    draw_path();
    }
  } else {
    startNode.classList.remove("start");
    endNode.classList.remove("end");
    endNode.classList.remove("end2");
    startNode = elem;
    endNode = null;
    startNode.classList.add("start");
    clear_path();
  }
}

function draw_path() {
  if (startNode === null || endNode === null) return;
  clear_path();
  let path = shortest_path(startNode, endNode);
  if (path == null){
    return false;
  } else {
    for (let elem of path) {
      elem.classList.add("path");
    }
  }

  let count = path.length;
  update_step_count(count);
}

function update_step_count(count) {
  let stepCount = document.getElementById("step-count");
  stepCount.innerText = count - 1;
}

function clear_path() {
  for (let elem of document.querySelectorAll(".path")) {
    elem.classList.remove("path");
  }
}

function shortest_path(start, end) {
  let visited = new Set();
  let queue = [[start, []]];
  
  while (queue.length > 0) {
    let [node, path] = queue.shift();
    
    if (node === end) {
      return path.concat([node]);
    }
    
    if (visited.has(node)) continue;
    visited.add(node);
    
    for (let neighbor of get_neighbors(node)) {
      if (!visited.has(neighbor)) {
        queue.push([neighbor, path.concat([node])]);
      }
    }
  }
  
  return null;
}

function get_neighbors(node) {
  let i = Number(node.dataset.i);
  let j = Number(node.dataset.j);
  let neighbors = [    (grid_matrix[i - 1] || [])[j],
    (grid_matrix[i] || [])[j + 1],
    (grid_matrix[i + 1] || [])[j],
    (grid_matrix[i] || [])[j - 1],
  ];
  
  return neighbors.filter(neighbor => neighbor !== undefined && !neighbor.classList.contains("obstacle"));
}

function restart_obstacles() {
  // Remove all obstacles
  let obstacles = document.querySelectorAll(".obstacle");
  for (let obstacle of obstacles) {
    obstacle.classList.remove("obstacle");
  }
  
  startNode.classList.remove("start");
  endNode.classList.remove("end");
  endNode.classList.remove("end2");
  clear_path();

  // Add new obstacles
  add_obstacles(num_obstacle);
}

function update_obstacles() {
  let num_input = document.getElementById("num-obstacles");
  let new_num_obstacle = parseInt(num_input.value);
  
  if (!isNaN(new_num_obstacle)) {
    num_obstacle = new_num_obstacle;
    restart_obstacles();
  }

  startNode.classList.remove("start");
  endNode.classList.remove("end");
  endNode.classList.remove("end2");
  clear_path();
}

function change_grid_size() {
  let grid_size_x_input = document.getElementById("grid-size-x");
  let grid_size_y_input = document.getElementById("grid-size-y");

  let new_grid_size_x = parseInt(grid_size_x_input.value);
  let new_grid_size_y = parseInt(grid_size_y_input.value);

  if (new_grid_size_x !== grid_size_x || new_grid_size_y !== grid_size_y) {
    grid_size_x = new_grid_size_x;
    grid_size_y = new_grid_size_y;
    grid_matrix = [];
    path_len = grid_size_x * grid_size_y;
    grid.innerHTML = "";
    init();
  }
}

init();

window.onclick = function() {
  pirate_music.play();
};