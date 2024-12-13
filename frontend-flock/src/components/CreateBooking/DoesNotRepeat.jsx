// import React, { useState } from "react";
// import "./does-not-repeat.css";
// import { ReactComponent as AddIcon } from "../../svg/add-square.svg"; // Replace with your actual SVG path

// const DoesNotRepeat = () => {
//   // Helper function to get tomorrow's date in yyyy-mm-dd format
//   const getTomorrowDate = () => {
//     const today = new Date();
//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);
//     return tomorrow.toISOString().split("T")[0];
//   };

//   // Helper function to generate 30-minute interval time options in 12-hour format
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

//   // Helper function to convert 12-hour format to 24-hour format
//   const convertTo24Hour = (time) => {
//     const [hourMinute, period] = time.split(" ");
//     let [hour, minute] = hourMinute.split(":").map(Number);
//     if (period === "PM" && hour !== 12) hour += 12;
//     if (period === "AM" && hour === 12) hour = 0;
//     return `${hour.toString().padStart(2, "0")}:${minute
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   // Helper function to convert 24-hour format to 12-hour format
//   const convertTo12Hour = (time) => {
//     const [hour, minute] = time.split(":").map(Number);
//     const period = hour < 12 ? "AM" : "PM";
//     const hour12 = hour % 12 || 12;
//     return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
//   };

//   const timeOptions = generateTimeOptions();

//   const [dates, setDates] = useState([
//     { date: getTomorrowDate(), startTime: "09:00", endTime: "17:00" }, // Default first date to tomorrow
//   ]);

//   const [error, setError] = useState(null); // Track validation errors

//   const handleDateChange = (index, field, value) => {
//     if (
//       field === "date" &&
//       dates.some((item, i) => i !== index && item.date === value)
//     ) {
//       setError("This date is already selected. Please choose another date.");
//       return;
//     }
//     setError(null);

//     const updatedDates = dates.map((item, i) =>
//       i === index
//         ? {
//             ...item,
//             [field]: field.includes("Time") ? convertTo24Hour(value) : value,
//           }
//         : item
//     );
//     setDates(updatedDates);
//   };

//   const addDate = () => {
//     setDates([
//       ...dates,
//       { date: "", startTime: "09:00", endTime: "17:00" }, // New date starts in "Select a date" state
//     ]);
//     setError(null); // Clear error when adding a new row
//   };

//   const formatDate = (date) => {
//     if (!date) return "Select a date";
//     const [year, month, day] = date.split("-");
//     const months = [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ];
//     return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
//   };

//   return (
//     <div className="does-not-repeat-container">
//       {dates.map((item, index) => (
//         <div key={index} className="date-row">
//           {/* Date Block */}
//           <div className="date-display-wrapper">
//             <input
//               type="date"
//               className="date-picker"
//               value={item.date}
//               onChange={(e) => handleDateChange(index, "date", e.target.value)}
//             />
//             <div
//               className="date-display"
//               onClick={(e) =>
//                 e.target.previousSibling &&
//                 e.target.previousSibling.showPicker()
//               }
//             >
//               {formatDate(item.date)}
//             </div>
//           </div>

//           {/* Time Inputs */}
//           <div className="time-inputs">
//             <select
//               className="time-picker"
//               value={convertTo12Hour(item.startTime)}
//               onChange={(e) =>
//                 handleDateChange(index, "startTime", e.target.value)
//               }
//             >
//               {timeOptions.map((time) => (
//                 <option key={time} value={time}>
//                   {time}
//                 </option>
//               ))}
//             </select>
//             <span className="time-separator">-</span>
//             <select
//               className="time-picker"
//               value={convertTo12Hour(item.endTime)}
//               onChange={(e) =>
//                 handleDateChange(index, "endTime", e.target.value)
//               }
//             >
//               {timeOptions.map((time) => (
//                 <option key={time} value={time}>
//                   {time}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Add Icon */}
//           {index === dates.length - 1 && (
//           )}
//         </div>
//       ))}

//       {/* Error Message */}
//       {error && <div className="error-message">{error}</div>}

//       {/* Add a Date Button */}
//       <button className="add-date-footer" onClick={addDate}>
//         Add a date
//       </button>
//     </div>
//   );
// };

// export default DoesNotRepeat;

import React, { useState } from "react";
import "./does-not-repeat.css";
import { ReactComponent as AddIcon } from "../../svg/add-square.svg";
import { ReactComponent as CancelIcon } from "../../svg/cancel-right.svg";

const DoesNotRepeat = () => {
  const getTomorrowDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h % 12 || 12; // Convert to 12-hour format
        const minute = m.toString().padStart(2, "0");
        const period = h < 12 ? "AM" : "PM";
        options.push(`${hour}:${minute} ${period}`);
      }
    }
    return options;
  };

  const convertTo24Hour = (time) => {
    const [hourMinute, period] = time.split(" ");
    let [hour, minute] = hourMinute.split(":").map(Number);
    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")}`;
  };

  const convertTo12Hour = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour < 12 ? "AM" : "PM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
  };

  const timeOptions = generateTimeOptions();

  const [dates, setDates] = useState([
    { date: getTomorrowDate(), startTime: "09:00", endTime: "17:00" },
  ]);

  const [error, setError] = useState(null);

  const handleDateChange = (index, field, value) => {
    if (
      field === "date" &&
      dates.some((item, i) => i !== index && item.date === value)
    ) {
      setError("This date is already selected. Please choose another date.");
      return;
    }
    setError(null);

    const updatedDates = dates.map((item, i) =>
      i === index
        ? {
            ...item,
            [field]: field.includes("Time") ? convertTo24Hour(value) : value,
          }
        : item
    );
    setDates(updatedDates);
  };

  const addDate = () => {
    setDates([...dates, { date: "", startTime: "09:00", endTime: "17:00" }]);
    setError(null);
  };

  const removeDate = (index) => {
    setDates(dates.filter((_, i) => i !== index));
  };

  const formatDate = (date) => {
    if (!date) return "Select a date";
    const [year, month, day] = date.split("-");
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}, ${year}`;
  };

  return (
    <div className="does-not-repeat-container">
      {dates.map((item, index) => (
        <div key={index} className="date-row">
          {/* Date Block */}
          <div className="date-display-wrapper">
            <input
              type="date"
              className="date-picker"
              value={item.date}
              onChange={(e) => handleDateChange(index, "date", e.target.value)}
            />
            <div
              className="date-display"
              onClick={(e) =>
                e.target.previousSibling &&
                e.target.previousSibling.showPicker()
              }
            >
              {formatDate(item.date)}
            </div>
          </div>

          {/* Time Inputs */}
          <div className="time-inputs">
            <select
              className="time-picker"
              value={convertTo12Hour(item.startTime)}
              onChange={(e) =>
                handleDateChange(index, "startTime", e.target.value)
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
              value={convertTo12Hour(item.endTime)}
              onChange={(e) =>
                handleDateChange(index, "endTime", e.target.value)
              }
            >
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Remove Button */}
          <button
            className="remove-date-button"
            onClick={() => removeDate(index)}
          >
            <CancelIcon />
          </button>
        </div>
      ))}

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Add a Date Button */}
      <button className="add-date-footer" onClick={addDate}>
        Add a date
      </button>
    </div>
  );
};

export default DoesNotRepeat;