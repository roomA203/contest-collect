document.addEventListener("DOMContentLoaded", () => {
  renderCurrentView = () =>
    renderContests(loadContests().filter((contest) => contest.bookmarked));

  renderCurrentView();
});
