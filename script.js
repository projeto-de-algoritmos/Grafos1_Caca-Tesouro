let grid_size_x = 10;
let grid_size_y = grid_size_x;
let square_size_height = 50;
let square_size_width = 50;
let grid = document.getElementById("massive-grid");
let current_scale = 1.0;
let path_len = grid_size_x * grid_size_y;
let grid_matrix = [];
let selected;


function init() {
  draw_grid(grid_size_x, grid_size_y);
  grid.addEventListener("wheel", scroll_handler);
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
      square.addEventListener("mouseenter", square_mouseenter);
      square.addEventListener("mouseleave", square_mouseleave);
      square.addEventListener("click", square_click);
      grid.appendChild(square);
      grid_matrix[i].push(square);
    }
  }
}

function square_mouseenter(event) {
  let elem = event.target;
  elem.classList.add("highlight");
  draw_path(elem);
}

function square_mouseleave(event) {
  event.target.classList.remove("highlight");
}

function square_click(event) {
  if (selected === undefined) {
    let elem = event.target;
    selected = elem;
    elem.classList.add("clicked");
  } else {
    selected.classList.remove("clicked");
    selected = undefined;
    //clear_path();
  }
}

function clear_path() {
  for (let elem of document.querySelectorAll(".path")) {
    elem.classList.remove("path");
  }
}

function draw_path(target) {
  if (selected === undefined) return;
  clear_path();
  let path = shortest_path(selected, target, path_len - 1);

  for (let elem of path) {
    elem.classList.add("path");
  }
}


/* BFS --> Breadth-first-search - Busca em Largura (Início)*/

function shortest_path(start, end) {
  if (start === end) return [];

  let visited = new Set();
  let queue = [[start, []]];

  while (queue.length > 0) {
    let [currentNode, path] = queue.shift();

    if (visited.has(currentNode)) {
      continue;
    }

    visited.add(currentNode);
    path.push(currentNode);

    if (currentNode === end) {
      return path;
    }

    let neighbors = get_neighbors(currentNode);

    for (let neighbor of neighbors) {
      queue.push([neighbor, [...path]]);
    }
  }

  return null;
}

function get_neighbors(node) {
  let i = Number(node.dataset.i),
    j = Number(node.dataset.j);
  let neighbors = [    (grid_matrix[i - 1] || [])[j], // top
    (grid_matrix[i] || [])[j - 1], // left
    (grid_matrix[i] || [])[j + 1], // right
    (grid_matrix[i + 1] || [])[j], // bottom
  ];
  return neighbors.filter((neighbor) => neighbor && neighbor.className !== 'obstacle');
}

/* BFS --> Breadth-first-search - Busca em Largura (Fim)*/



/* DFS --> Depth-first-search - Busca Dinâmica (Início)
function shortest_path(start, end, max = Infinity) {
  let path = [];
  let visited = new Set();
  let found = dfs(start, end, path, visited, max);
  return found ? path : [];
}

function dfs(node, end, path, visited, max) {
  if (node === end) {
    path.push(node);
    return true;
  }

  if (visited.has(node)) {
    return false;
  }

  visited.add(node);
  path.push(node);

  if (path.length >= max) {
    return false;
  }

  let i = Number(node.dataset.i),
    j = Number(node.dataset.j);
  let end_x = end.offsetLeft;
  let end_y = end.offsetTop;
  let paths = [
    (grid_matrix[i - 1] || [])[j - 1], // diag
    (grid_matrix[i] || [])[j - 1],
    (grid_matrix[i + 1] || [])[j - 1], // diag
    (grid_matrix[i + 1] || [])[j],
    (grid_matrix[i + 1] || [])[j + 1], // diag
    (grid_matrix[i] || [])[j + 1],
    (grid_matrix[i - 1] || [])[j + 1], // diag
    (grid_matrix[i - 1] || [])[j],
  ];

  for (let neighbor of paths) {
    if (neighbor === undefined) continue;
    if (dfs(neighbor, end, path, visited, max)) {
      return true;
    }
  }

  path.pop();
  return false;
}

/* DFS --> Depth-first-search - Busca Dinâmica (Fim)*/




init();
