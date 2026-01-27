// admin.js (food management only
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

window.initFoodManagement = function () {
  const foodForm = document.getElementById("food-form");
  const foodTbody = document.getElementById("food-tbody");

  if (!foodForm || !foodTbody) {
    console.warn("Food management elements not found");
    return;
  }

  // Add food
  foodForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = foodForm.querySelector("#food-name").value.trim();
    const price = Number(foodForm.querySelector("#food-price").value);
    const category = foodForm.querySelector("#food-category").value.trim();
    const status = foodForm.querySelector("#food-status").value;

    if (!name || !price) {
      alert("Food name and price are required");
      return;
    }

    await addDoc(collection(window.db, "foods"), {
      name,
      price,
      category,
      status,
      image: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    foodForm.reset();
  });

  // Render table
  const renderRow = (food) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${food.name}</td>
      <td>${food.category || "-"}</td>
      <td>₦${Number(food.price).toLocaleString()}</td>
      <td>
        <span class="food-status ${food.status}">
          ${food.status === "available" ? "Available" : "Sold out"}
        </span>
      </td>
      <td>
        <button class="btn btn-ghost btn-sm" disabled>Edit</button>
      </td>
    `;
    return tr;
  };

  const foodsQuery = query(
    collection(window.db, "foods"),
    orderBy("createdAt", "desc")
  );

  onSnapshot(foodsQuery, (snap) => {
    foodTbody.innerHTML = "";
    snap.forEach((doc) => foodTbody.appendChild(renderRow(doc.data())));
  });
};
