"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./seat.module.css";
import { useRouter } from "next/navigation";

type Seat = {
  _id: string;
  seatNumber: number;
  status: "available" | "booked";
};

type Row = {
  name: string;
  seats: Seat[];
};

type Section = {
  name: string;
  rows: Row[];
};

type SelectedSeat = {
  section: string;
  row: string;
  seatIds: string[];
};

export default function EventDetail() {

  const params = useParams();
  const eventId = params.id as string;

  const [availability, setAvailability] = useState<Section[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/events/${eventId}/availability`)
      .then(res => res.json())
      .then(data => setAvailability(data));
  }, [eventId]);

  const toggleSeat = (
    sectionName: string,
    rowName: string,
    seatId: string
  ) => {

    setMessage("")

    setSelectedSeats(prev => {

      const existing = prev.find(
        s => s.section === sectionName && s.row === rowName
      );

      if (existing) {

        const isSelected = existing.seatIds.includes(seatId);

        const updatedSeatIds = isSelected
          ? existing.seatIds.filter(id => id !== seatId)
          : [...existing.seatIds, seatId];

        return prev.map(s =>
          s.section === sectionName && s.row === rowName
            ? { ...s, seatIds: updatedSeatIds }
            : s
        );

      }

      return [
        ...prev,
        {
          section: sectionName,
          row: rowName,
          seatIds: [seatId]
        }
      ];

    });

  };

  const handlePurchase = async () => {

    const totalSeats = selectedSeats.reduce(
      (acc, s) => acc + s.seatIds.length,
      0
    );

    if (totalSeats === 0) {
      setMessage("* Please select seats *");
      return;
    }

    if (totalSeats > 10) {
      setMessage("Maximum 10 seats allowed");
      return;
    }

    const res = await fetch(
      `http://localhost:8000/events/${eventId}/purchase`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          selectSeat: selectedSeats
        })
      }
    );

    const data = await res.json();
    if (res.ok) {

      if (data.groupDiscount) {
        setMessage("Booking successful 🎉 (Group Discount Applied)");
      } else {
        setMessage("Booking successful");
      }

      setSelectedSeats([]);
      setShowModal(true);   // show popup

    } else {
      setMessage(data.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button
          className={styles.backButton}
          onClick={() => router.push("/")}
        >
          Home
        </button>
      </div>

      <h1>Seat Selection</h1>

      <div className={styles.legend}>
        <span style={{ color: "#52c41a" }}>■ Available</span>
        <span style={{ color: "#ff4d4f" }}>■ Booked</span>
        <span style={{ color: "#1677ff" }}>■ Selected</span>
      </div>

      <div className={styles.screen}>SCREEN</div>

      {message && (
        <p style={{ marginTop: 10,color:"red" }}>{message}</p>
      )}


      {availability?.map(section => (
        <div key={section.name} className={styles.section}>

          <h2>{section.name}</h2>

          {section.rows.map(row => (
            <div key={row.name}>

              <div className={styles.rowLabel}>{row.name}</div>

              <div className={styles.seatGrid}>
                {row.seats.map(seat => {

                  const selectedGroup = selectedSeats.find(
                    s => s.section === section.name && s.row === row.name
                  );

                  const isSelected =
                    selectedGroup?.seatIds.includes(seat._id);

                  return (
                    <div
                      key={seat._id}
                      onClick={() =>
                        seat.status === "available" &&
                        toggleSeat(
                          section.name,
                          row.name,
                          seat._id
                        )
                      }
                      className={`${styles.seat}
                        ${seat.status === "booked" ? styles.booked : ""}
                        ${isSelected ? styles.selected : styles.available}`}
                    >
                      {seat.seatNumber}
                    </div>
                  );

                })}
              </div>

            </div>
          ))}

        </div>
      ))}

      <div style={{ marginTop: 30 }}>

        <button
          className={styles.buyButton}
          onClick={handlePurchase}
        >
          Buy Tickets
        </button>
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>

            <h2>Booking Successful!</h2>
            <p>{message}</p>

            <button
              className={styles.homeButton}
              onClick={() => router.push("/")}
            >
              Go To Home
            </button>

          </div>
        </div>
      )}

    </div>
  );
}