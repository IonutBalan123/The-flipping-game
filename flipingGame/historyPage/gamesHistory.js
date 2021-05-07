let table = document.getElementById("tableBody");

window.onload = () => {
  if (!JSON.parse(localStorage.getItem("timesList"))) {
    console.log("no times");
    document.getElementById("noTimes").style.display = "block";
    document.getElementById("deleteButton").style.display = "none";
  } else {
    JSON.parse(localStorage.getItem("timesList")).forEach(
      ({ difficulty, errorsMade, time, type }) => {
        let row = table.insertRow(0);
        row.style.backgroundColor = type === "win" ? "#74e374" : "#ff4d4d";
        let cell1 = row.insertCell(0);
        let cell2 = row.insertCell(1);
        let cell3 = row.insertCell(2);
        cell1.innerHTML = difficulty;
        cell2.innerHTML = time + "s";
        cell3.innerHTML = errorsMade;
      }
    );
  }
};
const deleteHistory = () => {
  localStorage.clear();
  table.innerHTML = "";
  document.getElementById("noTimes").style.display = "block";
  document.getElementById("deleteButton").style.display = "none";
};
