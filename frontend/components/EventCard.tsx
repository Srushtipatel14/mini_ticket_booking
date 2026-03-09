"use client";

import Link from "next/link";

type Event = {
  _id: string;
  name: string;
  date: string;
};

type EventCardProps = {
  event: Event;
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "8px"
      }}
    >
      <h2>{event.name}</h2>

      <p>
        Date: {new Date(event.date).toLocaleString()}
      </p>

      <Link href={`/events/${event._id}`}>
        <button
          style={{
            padding: "8px 12px",
            cursor: "pointer"
          }}
        >
          View Event
        </button>
      </Link>
    </div>
  );
}