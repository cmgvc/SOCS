const CreateBookingSidebar = ({ onSave }) => {
  return (
    <aside className="sidebar">
      <h3>Bookable Meeting Schedule</h3>
      <form onSubmit={onSave}>
        <label>
          Add title:
          <input type="text" name="title" placeholder="Title" required />
        </label>
        <label>
          Meeting type:
          <select name="meetingType">
            <option value="1-1">1-1 Meeting</option>
            <option value="group">Group Meeting</option>
          </select>
        </label>
        <label>
          Meeting duration:
          <select name="duration">
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
          </select>
        </label>
        <h4>General availability</h4>
        {/* Repeat Weekly Toggle */}
        <div>
          <label>Repeat Weekly:</label>
          <input type="checkbox" name="repeatWeekly" />
        </div>
        {/* Days and Times */}
        {["MON", "TUE", "WED", "THU", "FRI"].map((day) => (
          <div key={day}>
            <label>{day}</label>
            <input type="time" name={`${day}-start`} />
            <input type="time" name={`${day}-end`} />
          </div>
        ))}
        <h4>Adjusted Availability</h4>
        <button type="button">Change a date's availability</button>
        <button type="submit">Save</button>
      </form>
    </aside>
  );
};

export default CreateBookingSidebar;
