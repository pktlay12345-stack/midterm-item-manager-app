import { useEffect, useMemo, useState } from "react";

import deleteIcon from "./assets/delete.svg";
import inkPen from "./assets/ink_pen.svg";
import flatware from "./assets/flatware.svg";
import electrical from "./assets/electrical_services.svg";

const CATEGORIES = ["Stationary", "Kitchenware", "Appliance"];
const STORAGE_KEY = "midterm-items"; 

function getCategoryIcon(category) {
  if (category === "Stationary") return inkPen;
  if (category === "Kitchenware") return flatware;
  if (category === "Appliance") return electrical;
  return null;
}

export default function App() {
  const [items, setItems] = useState([]);

  
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  const [error, setError] = useState("");

  
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      } catch (e) {
        
      }
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const nextId = useMemo(() => {
    if (items.length === 0) return 1;
    return Math.max(...items.map((it) => it.id)) + 1;
  }, [items]);

  const handleAdd = () => {
    setError("");

    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Item name must not be empty");
      return;
    }

    const duplicated = items.some(
      (it) => it.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (duplicated) {
      setError("Item must not be duplicated");
      return;
    }

    if (!category) {
      setError("Please select a category");
      return;
    }

    const priceNumber = Number(price);
    if (Number.isNaN(priceNumber) || priceNumber < 0) {
      setError("Price must not be less than 0");
      return;
    }

    const newItem = {
      id: nextId,
      name: trimmedName,
      category,
      price: priceNumber,
    };

    setItems((prev) => [...prev, newItem]);

    setName("");
    setCategory("");
    setPrice("");
  };

 
  const askDelete = (item) => {
    setSelectedItem(item);
    setOpenDialog(true);
  };

  
  const confirmDelete = () => {
    if (!selectedItem) return;
    setItems((prev) => prev.filter((it) => it.id !== selectedItem.id));
    setOpenDialog(false);
    setSelectedItem(null);
  };

  
  const cancelDelete = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  return (
    <div style={{ padding: 24, fontFamily: "Arial" }}>
      <h2 style={{ marginBottom: 16 }}>Item Management App</h2>

      <table style={tableStyle}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Category</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}></th>
          </tr>
        </thead>

        <tbody>
          {/* Form row inside table */}
          <tr>
            <td style={tdStyle}>-</td>

            <td style={tdStyle}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Item name"
                style={inputStyle}
              />
            </td>

            <td style={tdStyle}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={inputStyle}
              >
                <option value="">-- Select --</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </td>

            <td style={tdStyle}>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                style={inputStyle}
              />
            </td>

            <td style={tdStyle}>
              <button onClick={handleAdd} style={buttonStyle}>
                Add Item
              </button>
            </td>
          </tr>

          {/* Items */}
          {items.map((item) => (
            <tr key={item.id}>
              <td style={tdStyle}>{item.id}</td>
              <td style={tdStyle}>{item.name}</td>

              <td style={tdStyle}>
                <img
                  src={getCategoryIcon(item.category)}
                  alt={item.category}
                  style={{ width: 22, height: 22 }}
                />
              </td>

              <td style={tdStyle}>{item.price}</td>

              <td style={tdStyle}>
                <img
                  src={deleteIcon}
                  alt="delete"
                  style={{ width: 22, height: 22, cursor: "pointer" }}
                  onClick={() => askDelete(item)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Error message below table */}
      {error && (
        <div style={{ marginTop: 12, color: "red", fontWeight: "bold" }}>
          {error}
        </div>
      )}

      {/* ✅ Custom confirm dialog */}
      {openDialog && selectedItem && (
        <div style={overlayStyle}>
          <div style={dialogStyle}>
            <h3 style={{ marginTop: 0 }}>Confirm Delete</h3>

            <p style={{ marginBottom: 8 }}>
              Are you sure you want to delete this item?
            </p>

            <div style={detailBoxStyle}>
              <div>
                <b>ID:</b> {selectedItem.id}
              </div>
              <div>
                <b>Name:</b> {selectedItem.name}
              </div>
              <div>
                <b>Category:</b> {selectedItem.category}
              </div>
              <div>
                <b>Price:</b> {selectedItem.price}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={cancelDelete} style={cancelBtn}>
                Cancel
              </button>
              <button onClick={confirmDelete} style={confirmBtn}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const tableStyle = {
  width: "700px",
  borderCollapse: "collapse",
  border: "1px solid #ddd",
};

const thStyle = {
  padding: 12,
  border: "1px solid #ddd",
  textAlign: "left",
};

const tdStyle = {
  padding: 10,
  border: "1px solid #ddd",
};

const inputStyle = {
  width: "100%",
  padding: 8,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "2px solid #111",
  cursor: "pointer",
  background: "white",
  fontWeight: "bold",
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const dialogStyle = {
  width: 360,
  background: "white",
  borderRadius: 12,
  padding: 16,
  border: "1px solid #ddd",
};

const detailBoxStyle = {
  border: "1px solid #eee",
  borderRadius: 10,
  padding: 12,
  background: "#fafafa",
};

const cancelBtn = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 10,
  border: "1px solid #ccc",
  cursor: "pointer",
  background: "white",
  fontWeight: "bold",
};

const confirmBtn = {
  flex: 1,
  padding: "10px 12px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  background: "crimson",
  color: "white",
  fontWeight: "bold",
};