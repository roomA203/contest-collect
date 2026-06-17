// ====== 데이터 읽기/쓰기 ======
function loadContests() {
  return JSON.parse(localStorage.getItem("contests")) || [];
}

function saveContests(contests) {
  localStorage.setItem("contests", JSON.stringify(contests));
}

// 현재 화면을 다시 그리는 함수. 페이지(전체 목록 / 북마크)마다 다르게 설정됨.
let renderCurrentView = () => {};

// ====== 렌더링 ======
function renderContests(data) {
  const contestList = document.querySelector("#contest-list");
  if (!contestList) return;

  if (data.length === 0) {
    contestList.innerHTML = `<p>표시할 대회가 없습니다.</p>`;
    return;
  }

  contestList.innerHTML = data
    .map(
      (contest) => `
        <div class="contest-card" data-id="${contest.id}">
            <div class="card-top">
                <h3>${contest.title}</h3>
                <div class="card-actions">
                    <button
                        type="button"
                        class="bookmark-btn"
                        data-action="bookmark"
                        data-id="${contest.id}"
                        title="북마크"
                    >${contest.bookmarked ? "★" : "☆"}</button>
                    <button
                        type="button"
                        class="delete-btn"
                        data-action="delete"
                        data-id="${contest.id}"
                    >삭제</button>
                </div>
            </div>
            <p>${contest.category} · ${contest.teamType}</p>
            <p>모집마감 ${contest.deadline}</p>
            <div class="detail" id="detail-${contest.id}" style="display:none;">
                <hr>
                <p>대회일: ${contest.contestDate}</p>
                ${
                  contest.image
                    ? `<img src="${contest.image}" class="contest-image" alt="첨부 이미지" />`
                    : ""
                }
                <div>${marked.parse(contest.content || "")}</div>
            </div>
        </div>
      `,
    )
    .join("");
}

// ====== 동작 함수 ======
function toggleDetail(id) {
  const detail = document.getElementById(`detail-${id}`);
  if (!detail) return;
  detail.style.display = detail.style.display === "none" ? "block" : "none";
}

function toggleBookmark(id) {
  const contests = loadContests();
  const target = contests.find((c) => c.id === id);
  if (!target) return;

  target.bookmarked = !target.bookmarked;
  saveContests(contests);
  renderCurrentView();
}

function deleteContest(id) {
  const password = prompt("삭제하려면 비밀번호를 입력하세요.");

  if (password === null) return; // 취소
  if (password !== "bssmadmin") {
    alert("비밀번호가 틀렸습니다.");
    return;
  }

  const contests = loadContests().filter((c) => c.id !== id);
  saveContests(contests);
  renderCurrentView();
}

// 카드 영역 클릭을 한 곳에서 처리 (삭제/북마크 버튼 vs 카드 본문 클릭 구분)
function setupCardEvents() {
  const contestList = document.querySelector("#contest-list");
  if (!contestList) return;

  contestList.addEventListener("click", (e) => {
    const actionBtn = e.target.closest("[data-action]");

    if (actionBtn) {
      const id = Number(actionBtn.dataset.id);
      if (actionBtn.dataset.action === "delete") {
        deleteContest(id);
      } else if (actionBtn.dataset.action === "bookmark") {
        toggleBookmark(id);
      }
      return; // 버튼 클릭이면 상세보기 토글은 실행하지 않음
    }

    const card = e.target.closest(".contest-card");
    if (card) {
      toggleDetail(Number(card.dataset.id));
    }
  });
}

// ====== 필터 (카테고리 / 모집중) - 대회 모아보기 페이지에서만 동작 ======
function getFilteredContests() {
  const all = loadContests();
  const categorySelect = document.querySelector("#category-filter");
  const recruitCheckbox = document.querySelector("#recruit-filter");

  let filtered = all;

  if (categorySelect && categorySelect.value !== "카테고리 . .") {
    filtered = filtered.filter((c) => c.category === categorySelect.value);
  }

  if (recruitCheckbox && recruitCheckbox.checked) {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    filtered = filtered.filter((c) => c.deadline >= today);
  }

  return filtered;
}

// ====== 페이지 초기화 ======
document.addEventListener("DOMContentLoaded", () => {
  setupCardEvents();

  const contestListEl = document.querySelector("#contest-list");
  if (!contestListEl) return;

  const categorySelect = document.querySelector("#category-filter");
  const recruitCheckbox = document.querySelector("#recruit-filter");

  // 필터 컨트롤(select, checkbox)이 있든 없든 일단 목록은 항상 보여줍니다.
  // (필터 컨트롤이 없거나 id가 다르면 그냥 전체 목록이 보입니다)
  renderCurrentView = () => renderContests(getFilteredContests());

  if (categorySelect) categorySelect.addEventListener("change", renderCurrentView);
  if (recruitCheckbox) recruitCheckbox.addEventListener("change", renderCurrentView);

  renderCurrentView();

  // bookmark.html처럼 별도 초기화가 있는 페이지는 그 스크립트가
  // 아래에서 renderCurrentView를 덮어쓰고 다시 호출합니다.
});