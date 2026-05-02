export const toggleGridMode = () => {
  const gridMode = document.getElementById("grid-mode");
  const listMode = document.getElementById("list-mode");
  if (gridMode.style.display === "none") {
    listMode.style.display = "none";
    gridMode.style.display = "block";
  }
};

export const toggleListMode = () => {
  const gridMode = document.getElementById("grid-mode");
  const listMode = document.getElementById("list-mode");
  if (gridMode.style.display === "block") {
    gridMode.style.display = "none";
    listMode.style.display = "block";
  }
};
