const calendarSlot = document.querySelectorAll(".rbc-day-bg");

calendarSlot.forEach((slot) => {
  slot.addEventListener("click", () => {
    console.log("Slot is clicked from the DOM");
  });
});
