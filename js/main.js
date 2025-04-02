const apiBase = "https://y46ix3dhbb.execute-api.us-east-2.amazonaws.com/items";

document.getElementById("load-button").addEventListener("click", loadItems);
document.getElementById("add-button").addEventListener("click", showAddForm);
document.getElementById("submit-item").addEventListener("click", submitNewItem);
document.getElementById("cancel-add").addEventListener("click", () => {
  document.getElementById("add-form").style.display = "none";
});

function loadItems() {
  fetch(apiBase)
    .then(res => res.json())
    .then(data => populateTable(data))
    .catch(err => console.error("Failed to load items:", err));
}

function populateTable(items) {
  const tableBody = document.getElementById("items-table").querySelector("tbody");
  tableBody.innerHTML = "";

  items.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>
        <button onclick="deleteItem('${item.id}')">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function deleteItem(id) {
  fetch(`${apiBase}/${id}`, {
    method: "DELETE"
  })
    .then(res => {
      if (res.ok) {
        loadItems(); // Reload after deletion
      } else {
        console.error("Delete failed");
      }
    });
}

function showAddForm() {
  document.getElementById("add-form").style.display = "block";
}

function submitNewItem() {
  const id = document.getElementById("new-id").value;
  const name = document.getElementById("new-name").value;
  const price = parseFloat(document.getElementById("new-price").value);

  fetch(apiBase, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id, name, price })
  })
    .then(res => {
      if (res.ok) {
        document.getElementById("add-form").style.display = "none";
        loadItems();
      } else {
        console.error("Failed to add item");
      }
    });
}
