function loginCheck() {

  const password = document.getElementById("login-ipt").value;

  if (password === "bssmadmin") {
    alert("인증에 성공하셨습니다");
    location.href = "writing.html";
  } else if (password === ""){
    alert("비밀번호를 입력해 주세요");
  } else {
    alert("비밀번호가 틀렸습니다");
  }
}