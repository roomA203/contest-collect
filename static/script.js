function savePosts() {
  const title = document.getElementById("contest-title").value;

  const category = document.getElementById("category").value;

  const teamType = document.querySelector('input[name="mens"]:checked').value;

  const deadline = document.getElementById("deadline").value;

  const contestDate = document.getElementById("contest-date").value;

  const content = document.getElementById("details").value;

  const contest = {
    id: Date.now(),
    title,
    category,
    teamType,
    deadline,
    contestDate,
    content,
    bookmarked: false,
  };

  const contests = JSON.parse(localStorage.getItem("contests")) || [];

  contests.push(contest);

  localStorage.setItem("contests", JSON.stringify(contests));

  alert("등록 완료!");

  window.location.href = "contests.html";
}
