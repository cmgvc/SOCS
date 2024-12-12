import React from "react";

const LogoutPopup = ({ isVisible, onConfirm, onCancel }) => {
  if (!isVisible) return null; // Don't render the popup if not visible

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "15px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          textAlign: "center",
          maxWidth: "400px",
          width: "90%",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontWeight: "bold" }}>
          Are you sure you want to logout?
        </h2>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "black",
              color: "white",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={onConfirm}
          >
            Yes
          </button>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "black",
              color: "white",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
            }}
            onClick={onCancel}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopup;
