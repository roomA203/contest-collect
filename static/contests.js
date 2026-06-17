// localStorage에 저장된 대회 목록을 가져옵니다.
// (contest-write.html / script.js 의 savePosts() 에서 저장한 데이터)
function loadContests() {
  return JSON.parse(localStorage.getItem("contests")) || [];
}

const contestList = document.querySelector("#contest-list");

function renderContests(data) {
  if (data.length === 0) {
    contestList.innerHTML = `<p>등록된 대회가 없습니다.</p>`;
    return;
  }

  contestList.innerHTML = data
    .map(
      (contest) => `
        <div class="contest-card" onclick="toggleDetail(${contest.id})">
            <h3>${contest.title}</h3>
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

// 페이지 로드 시 localStorage에 있는 데이터로 렌더링
renderContests(loadContests());