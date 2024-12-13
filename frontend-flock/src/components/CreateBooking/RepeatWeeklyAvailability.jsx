// import React, { useState } from "react";
// import { ReactComponent as AddSquareSvg } from "../../svg/add-square.svg";
// import { ReactComponent as CancelRightSvg } from "../../svg/cancel-right.svg";
// import "./repeat-weekly-availability.css";

// const RepeatWeeklyAvailability = () => {
//   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   const [availability, setAvailability] = useState(
//     days.reduce((acc, day) => {
//       acc[day] = [];
//       return acc;
//     }, {})
//   );

//   // Generate 12-hour formatted time options
//   const generateTimeOptions = () => {
//     const options = [];
//     for (let h = 0; h < 24; h++) {
//       for (let m = 0; m < 60; m += 30) {
//         const hour = h % 12 || 12; // Convert to 12-hour format
//         const minute = m.toString().padStart(2, "0");
//         const period = h < 12 ? "AM" : "PM";
//         options.push(`${hour}:${minute} ${period}`);
//       }
//     }
//     return options;
//   };

//   const convertTo24Hour = (time) => {
//     const [hourMinute, period] = time.split(" ");
//     let [hour, minute] = hourMinute.split(":").map(Number);
//     if (period === "PM" && hour !== 12) hour += 12;
//     if (period === "AM" && hour === 12) hour = 0;
//     return `${hour.toString().padStart(2, "0")}:${minute
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   const convertTo12Hour = (time) => {
//     const [hour, minute] = time.split(":").map(Number);
//     const period = hour < 12 ? "AM" : "PM";
//     const hour12 = hour % 12 || 12;
//     return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
//   };

//   const addTimeSlot = (day) => {
//     setAvailability({
//       ...availability,
//       [day]: [...availability[day], { start: "09:00", end: "17:00" }],
//     });
//   };

//   const removeTimeSlot = (day, index) => {
//     const updatedSlots = availability[day].filter((_, i) => i !== index);
//     setAvailability({ ...availability, [day]: updatedSlots });
//   };

//   const handleTimeChange = (day, index, field, value) => {
//     const updatedSlots = availability[day].map((slot, i) =>
//       i === index ? { ...slot, [field]: convertTo24Hour(value) } : slot
//     );
//     setAvailability({ ...availability, [day]: updatedSlots });
//   };

//   const timeOptions = generateTimeOptions();

//   return (
//     <div className="repeat-weekly-container">
//       {days.map((day) => (
//         <div key={day} className="day-row-availability">
//           {/* Day Block */}
//           <div className="day-block">
//             <h4 className="repeat-weekly-day">{day}</h4>
//           </div>

//           {/* Availability Block */}
//           <div className="availability-block">
//             {availability[day].length === 0 ? (
//               <p className="availability unavailable">Unavailable</p>
//             ) : (
//               <div className="time-slots-wrapper">
//                 {availability[day].map((slot, index) => (
//                   <div key={index} className="time-slot">
//                     <select
//                       className="time-picker"
//                       value={convertTo12Hour(slot.start)}
//                       onChange={(e) =>
//                         handleTimeChange(day, index, "start", e.target.value)
//                       }
//                     >
//                       {timeOptions.map((time) => (
//                         <option key={time} value={time}>
//                           {time}
//                         </option>
//                       ))}
//                     </select>
//                     <span className="time-separator">-</span>
//                     <select
//                       className="time-picker"
//                       value={convertTo12Hour(slot.end)}
//                       onChange={(e) =>
//                         handleTimeChange(day, index, "end", e.target.value)
//                       }
//                     >
//                       {timeOptions.map((time) => (
//                         <option key={time} value={time}>
//                           {time}
//                         </option>
//                       ))}
//                     </select>
//                     <button
//                       className="remove-availability-button"
//                       onClick={() => removeTimeSlot(day, index)}
//                     >
//                       <CancelRightSvg />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Add Time Slot Button */}
//           <button
//             className="add-availability-button"
//             onClick={() => addTimeSlot(day)}
//           >
//             <AddSquareSvg />
//           </button>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default RepeatWeeklyAvailability;
import React, { useState } from "react";
import { ReactComponent as AddSquareSvg } from "../../svg/add-square.svg";
import { ReactComponent as CancelRightSvg } from "../../svg/cancel-right.svg";
import "./repeat-weekly-availability.css";

const RepeatWeeklyAvailability = () => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [availability, setAvailability] = useState(
    days.reduce((acc, day) => {
      acc[day] = [];
      return acc;
    }, {})
  );
  const [error, setError] = useState("");

  const convertToMinutes = (time) => {
    const [hourMinute, period] = time.split(" ");
    let [hour, minute] = hourMinute.split(":").map(Number);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return hour * 60 + minute;
  };

  const convertTo12Hour = (minutes) => {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const validateNoOverlap = (slots, newSlot, index) => {
    const newStart = convertToMinutes(newSlot.start);
    const newEnd = convertToMinutes(newSlot.end);

    for (let i = 0; i < slots.length; i++) {
      if (i === index) continue; // Skip the current slot being edited
      const slotStart = convertToMinutes(slots[i].start);
      const slotEnd = convertToMinutes(slots[i].end);

      // Check for overlap
      if (
        (newStart >= slotStart && newStart < slotEnd) || // New start overlaps an existing slot
        (newEnd > slotStart && newEnd <= slotEnd) || // New end overlaps an existing slot
        (newStart <= slotStart && newEnd >= slotEnd) // New slot fully encloses an existing slot
      ) {
        return false; // Overlap detected
      }
    }
    return true; // No overlap
  };

  const getNextAvailableSlot = (slots) => {
    const defaultDuration = 60; // 1-hour meeting duration
    if (slots.length === 0) {
      return { start: "09:00 AM", end: "10:00 AM" }; // Default start time
    }

    // Sort slots by start time to find gaps
    const sortedSlots = [...slots].sort(
      (a, b) => convertToMinutes(a.start) - convertToMinutes(b.start)
    );

    // Check for gaps between slots
    for (let i = 0; i < sortedSlots.length - 1; i++) {
      const currentEnd = convertToMinutes(sortedSlots[i].end);
      const nextStart = convertToMinutes(sortedSlots[i + 1].start);
      if (nextStart - currentEnd >= defaultDuration) {
        // Gap found
        return {
          start: convertTo12Hour(currentEnd),
          end: convertTo12Hour(currentEnd + defaultDuration),
        };
      }
    }

    // If no gaps, place the slot after the last slot
    const lastEnd = convertToMinutes(sortedSlots[sortedSlots.length - 1].end);
    return {
      start: convertTo12Hour(lastEnd),
      end: convertTo12Hour(lastEnd + defaultDuration),
    };
  };

  const addTimeSlot = (day) => {
    setError(""); // Clear any previous error

    const nextSlot = getNextAvailableSlot(availability[day]);

    setAvailability({
      ...availability,
      [day]: [...availability[day], nextSlot],
    });
  };

  const removeTimeSlot = (day, index) => {
    setError(""); // Clear any previous error
    const updatedSlots = availability[day].filter((_, i) => i !== index);
    setAvailability({ ...availability, [day]: updatedSlots });
  };

  const handleTimeChange = (day, index, field, value) => {
    const updatedSlots = availability[day].map((slot, i) =>
      i === index ? { ...slot, [field]: value } : slot
    );

    const newSlot = updatedSlots[index];
    if (!validateNoOverlap(updatedSlots, newSlot, index)) {
      setError("Time slots cannot overlap.");
      return; // Prevent the change
    }

    setError(""); // Clear error if no overlap
    setAvailability({ ...availability, [day]: updatedSlots });
  };

  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2).toString().padStart(2, "0");
    const minute = (i % 2 === 0 ? "00" : "30");
    const period = i < 24 ? "AM" : "PM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${period}`;
  });

  return (
    <div className="repeat-weekly-container">
      {days.map((day) => (
        <div key={day} className="day-row-availability">
          {/* Day Block */}
          <div className="day-block">
            <h4 className="repeat-weekly-day">{day}</h4>
          </div>

          {/* Availability Block */}
          <div className="availability-block">
            {availability[day].length === 0 ? (
              <p className="availability unavailable">Unavailable</p>
            ) : (
              <div className="time-slots-wrapper">
                {availability[day].map((slot, index) => (
                  <div key={index} className="time-slot">
                    <select
                      className="time-picker"
                      value={slot.start}
                      onChange={(e) =>
                        handleTimeChange(day, index, "start", e.target.value)
                      }
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <span className="time-separator">-</span>
                    <select
                      className="time-picker"
                      value={slot.end}
                      onChange={(e) =>
                        handleTimeChange(day, index, "end", e.target.value)
                      }
                    >
                      {timeOptions.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <button
                      className="remove-availability-button"
                      onClick={() => removeTimeSlot(day, index)}
                    >
                      <CancelRightSvg />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Time Slot Button */}
          <button
            className="add-availability-button"
            onClick={() => addTimeSlot(day)}
          >
            <AddSquareSvg />
          </button>
        </div>
      ))}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default RepeatWeeklyAvailability;


