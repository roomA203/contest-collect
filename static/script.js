function savePosts() {
  const title = document.getElementById("contest-title").value.trim();
  const categorySelect = document.getElementById("category");
  const category = categorySelect.value;
  const teamTypeInput = document.querySelector('input[name="mens"]:checked');
  const deadline = document.getElementById("deadline").value;
  const contestDate = document.getElementById("contest-date").value;
  const content = document.getElementById("details").value;
  const imageInput = document.getElementById("con-img");

  // 필수값 체크
  if (
    !title ||
    !category ||
    category === "카테고리" ||
    !teamTypeInput ||
    !deadline ||
    !contestDate
  ) {
    alert("필수 항목을 모두 입력해주세요.");
    return;
  }

  const teamType = teamTypeInput.value;
  const imageFile = imageInput.files[0];

  // 실제로 localStorage에 저장하는 부분 (이미지 base64 변환이 끝난 뒤 호출됨)
  function finishSave(imageDataUrl) {
    const contest = {
      id: Date.now(),
      title,
      category,
      teamType,
      deadline,
      contestDate,
      content,
      bookmarked: false,
      image: imageDataUrl || null,
    };

    const contests = JSON.parse(localStorage.getItem("contests")) || [];
    contests.push(contest);
    localStorage.setItem("contests", JSON.stringify(contests));

    alert("등록 완료!");
    window.location.href = "contests.html";
  }

  if (imageFile) {
    // 이미지 파일을 base64 문자열로 변환해서 localStorage에 같이 저장
    const reader = new FileReader();
    reader.onload = () => finishSave(reader.result);
    reader.onerror = () => {
      alert("이미지를 불러오는 중 오류가 발생했습니다. 이미지 없이 저장합니다.");
      finishSave(null);
    };
    reader.readAsDataURL(imageFile);
  } else {
    finishSave(null);
  }
}