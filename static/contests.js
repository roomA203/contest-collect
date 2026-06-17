// localStorage에 저장된 대회 목록을 가져오고 저장하는 함수들
function loadContests() {
  return JSON.parse(localStorage.getItem("contests")) || [];
}

function saveContests(contests) {
  localStorage.setItem("contests", JSON.stringify(contests));
}

function renderContests(data) {
  const contestList = document.querySelector("#contest-list");

  if (!contestList) {
    console.error(
      "#contest-list 요소를 찾을 수 없습니다. HTML의 id와 script 태그 위치를 확인하세요.",
    );
    return;
  }

  if (data.length === 0) {
    contestList.innerHTML = `<p>등록된 대회가 없습니다.</p>`;
    return;
  }

  contestList.innerHTML = data
    .map(
      (contest) => `
        <div class="contest-card" onclick="toggleDetail(${contest.id})">
            <div class="card-top">
                <h3>${contest.title}</h3>
                <div class="card-actions">
                    <button
                        type="button"
                        class="bookmark-btn"
                        onclick="event.stopPropagation(); toggleBookmark(${contest.id})"
                        title="북마크"
                    >${contest.bookmarked ? "★" : "☆"}</button>
                    <button
                        type="button"
                        class="delete-btn"
                        onclick="event.stopPropagation(); deleteContest(${contest.id})"
                    >삭제</button>
                </div>
            </div>
            <p>${contest.category} · ${contest.teamType}</p>
            <p>모집마감 ${contest.deadline}</p>
            <div
                id="detail-${contest.id}"
                class="detail"
                style="display:none;"
            >
                <hr>
                <p>대회일: ${contest.contestDate}</p>
                <div>${marked.parse(contest.content || "")}</div>
            </div>
        </div>
      `,
    )
    .join("");
}

// 카드 클릭 시 상세 정보 펼치기/접기
function toggleDetail(id) {
  const detail = document.getElementById(`detail-${id}`);
  if (!detail) return;
  detail.style.display = detail.style.display === "none" ? "block" : "none";
}

// 북마크 토글 (즐겨찾기 표시만 변경, 비밀번호 필요 없음)
function toggleBookmark(id) {
  const contests = loadContests();
  const target = contests.find((c) => c.id === id);
  if (!target) return;

  target.bookmarked = !target.bookmarked;
  saveContests(contests);
  renderContests(contests);
}

// 비밀번호 확인 후 삭제
function deleteContest(id) {
  const password = prompt("삭제하려면 비밀번호를 입력하세요.");

  if (password === null) return; // 취소 누른 경우

  if (password !== "bssmadmin") {
    alert("비밀번호가 틀렸습니다.");
    return;
  }

  const contests = loadContests().filter((c) => c.id !== id);
  saveContests(contests);
  renderContests(contests);
}

// DOM이 완전히 로드된 후에 실행
document.addEventListener("DOMContentLoaded", () => {
  renderContests(loadContests());
});