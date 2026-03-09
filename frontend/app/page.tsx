"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/EventCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Row = {
  name: string;
  totalSeats: number;
};

type Section = {
  name: string;
  rows: Row[];
};

type EventForm = {
  name: string;
  date: string;
  sections: Section[];
};

export default function Home() {

  const [events, setEvents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState<EventForm>({
    name: "",
    date: "",
    sections: []
  });

  useEffect(() => {
    fetch("http://localhost:8000/events")
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);


  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { name: "", rows: [] }]
    }));
  };

  const removeSection = (index: number) => {
    const updated = [...formData.sections];
    updated.splice(index, 1);
    setFormData({ ...formData, sections: updated });
  };

  const updateSectionName = (index: number, value: string) => {
    const updated = [...formData.sections];
    updated[index].name = value;
    setFormData({ ...formData, sections: updated });
  };

  const addRow = (sectionIndex: number) => {
    const updated = [...formData.sections];
    updated[sectionIndex].rows.push({ name: "", totalSeats: 1 });
    setFormData({ ...formData, sections: updated });
  };

  const removeRow = (sectionIndex: number, rowIndex: number) => {
    const updated = [...formData.sections];
    updated[sectionIndex].rows.splice(rowIndex, 1);
    setFormData({ ...formData, sections: updated });
  };

  const updateRow = (
    sectionIndex: number,
    rowIndex: number,
    field: "name" | "totalSeats",
    value: string | number
  ) => {
    const updated = [...formData.sections];

    if (field === "name") {
      updated[sectionIndex].rows[rowIndex].name = value as string;
    } else {
      updated[sectionIndex].rows[rowIndex].totalSeats = value as number;
    }

    setFormData({ ...formData, sections: updated });
  };

  const handleSubmit = async () => {

    if (formData.name === "") {
      return toast.error("Please add event name");
    }

    if (formData.sections.length === 0) {
      return toast.error("Please add at least one section");
    }

    for (let section of formData.sections) {

      if (!section.name) {
        return toast.error("Section name is required");
      }

      if (section.rows.length === 0) {
        return toast.error(`Section "${section.name}" must have at least one row`);
      }

      for (let row of section.rows) {

        if (!row.name) {
          return toast.error("Row name is required");
        }

        if (!row.totalSeats || row.totalSeats <= 0) {
          return toast.error("Total seats must be greater than 0");
        }

      }

    }

    try {

      const res = await fetch("http://localhost:8000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {

        toast.success("Event Created Successfully");

        setShowModal(false);

        const updated = await fetch("http://localhost:8000/events");
        setEvents(await updated.json());

        setFormData({
          name: "",
          date: "",
          sections: []
        });

      } else {
        toast.error(data.message);
      }

    } catch (error) {

      toast.error("Something went wrong");

    }

  };

  return (
    <div style={{ padding: 20 }}>
      <ToastContainer />
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 20
      }}>
        <h1>All Events</h1>

        <button
          style={{
            padding: "5px 10px",
            background: "#1677ff",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer"
          }}
          onClick={() => setShowModal(true)}
        >
          + Create Event
        </button>
      </div>

      {events.map((event) => (
        <EventCard key={event._id} event={event} />
      ))}

      {showModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>

          <div style={{
            background: "white",
            padding: 30,
            borderRadius: 10,
            width: 500,
            maxHeight: "80vh",
            overflowY: "auto"
          }}>

            <h2>Create Event</h2>

            <input
              placeholder="Event Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <br /><br />

            <input
              type="datetime-local"
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date: new Date(e.target.value).toISOString()
                })
              }
            />

            <br /><br />

            {formData.sections.map((section, sIndex) => (
              <div key={sIndex}
                style={{
                  border: "1px solid #ddd",
                  padding: 10,
                  marginBottom: 10
                }}
              >

                <div style={{ display: "flex", gap: 10 }}>

                  <input
                    placeholder="Section Name"
                    value={section.name}
                    onChange={(e) =>
                      updateSectionName(sIndex, e.target.value)
                    }
                  />

                  <button onClick={() => removeSection(sIndex)}>
                    Remove
                  </button>

                </div>

                <br />

                {section.rows.map((row, rIndex) => (
                  <div key={rIndex}
                    style={{ display: "flex", gap: 10, marginBottom: 6 }}
                  >

                    <input
                      placeholder="Row Name"
                      value={row.name}
                      onChange={(e) =>
                        updateRow(sIndex, rIndex, "name", e.target.value)
                      }
                    />

                    <input
                      type="number"
                      placeholder="Seats"
                      value={row.totalSeats}
                      onChange={(e) =>
                        updateRow(
                          sIndex,
                          rIndex,
                          "totalSeats",
                          Number(e.target.value)
                        )
                      }
                    />

                    <button
                      onClick={() => removeRow(sIndex, rIndex)}
                    >
                      Remove
                    </button>

                  </div>
                ))}

                <button onClick={() => addRow(sIndex)}>+ Add Row</button>
              </div>
            ))}

            <button onClick={addSection}>+ Add Section</button>
            <br /><br />
            <button style={{ marginRight: 10 }} onClick={handleSubmit}>Submit</button>
            <button onClick={() => setShowModal(false)}>Cancel</button>

          </div>

        </div>
      )}

    </div>
  );
}