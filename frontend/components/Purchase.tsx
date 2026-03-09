"use client";

import { useState } from "react";

type PurchaseProps = {
  eventId: string;
};

export default function Purchase({ eventId }: PurchaseProps) {
  const [section, setSection] = useState<string>("");
  const [row, setRow] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [message, setMessage] = useState<string>("");

  const handlePurchase = async () => {
    try {
      const res = await fetch(`http://localhost:8000/events/${eventId}/purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          section,
          row,
          quantity
        })
      });

      const data = await res.json();

      if (res.ok) {
        if (data.groupDiscount) {
          setMessage("Booking successful 🎉 (Group Discount Applied)");
        } else {
          setMessage("Booking successful 🎉");
        }
      } else {
        setMessage(data.message || "Booking failed");
      }

    } catch (error) {
      setMessage("Server error");
    }
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Purchase Tickets</h2>

      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <input
          placeholder="Section"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        />

        <input
          placeholder="Row"
          value={row}
          onChange={(e) => setRow(e.target.value)}
        />

        <input
          type="number"
          min={1}
          max={10}
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <button onClick={handlePurchase}>
          Buy Tickets
        </button>
      </div>

      {message && (
        <p style={{ marginTop: 15 }}>{message}</p>
      )}
    </div>
  );
}