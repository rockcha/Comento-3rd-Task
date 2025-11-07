/*************************************************
 * 1) 시간 포맷 유틸
 *************************************************/
function formatTime(date = new Date()) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/*************************************************
 * 2) DOM 요소 참조
 *************************************************/
const $timer = document.getElementById("timer");
const $timerSection = document.getElementById("timer-section");
const $pct = document.getElementById("pct");
const $batterySection = document.querySelector("#battery-section");
const $alarmInput = document.querySelector("#alarm-input input");
const $alarmAddButton = document.querySelector("#alarm-input button");
const $alarmList = document.getElementById("alarm-list");
const $alarmListCnt = document.getElementById("alarm-cnt");

/*************************************************
 * 3) 전역 상태
 *************************************************/
// 경과 시간(초). 100초 미만일 때만 배터리 퍼센트 감소 처리
let duration = 0;

// 배터리 퍼센트가 줄어들 때 사용할 색상 팔레트(10단계)
const BATTERY_COLORS = [
  "#22C55E",
  "#84CC16",
  "#EAB308",
  "#F59E0B",
  "#F97316",
  "#EA580C",
  "#FB5A5A",
  "#EF4444",
  "#DC2626",
  "#B91C1C",
];

// 배터리 색상 순회용 인덱스 (0 ~ 9)
let idx = 1; // 초기 1로 시작 (기존 로직 유지)

/*************************************************
 * 4) 보조 유틸: "HH:mm" → "오전/오후 h시 m분"
 *************************************************/
const formatKoreanTime = (timeStr) => {
  const [hourStr, minuteStr] = timeStr.split(":");
  let hour = Number(hourStr);
  const minute = Number(minuteStr);

  const period = hour < 12 ? "오전" : "오후";
  if (hour === 0) hour = 12; // 00 → 12시
  else if (hour > 12) hour -= 12; // 13~23 → 1~11시

  return `${period} ${hour}시 ${minute}분`;
};

/*************************************************
 * 5) 타이머 렌더러
 * - 현재 시간을 한국식 포맷으로 표시
 * - 100초 동안 1초마다 배터리 % 감소
 *************************************************/
const render = () => {
  // 현재 시간 표시
  $timer.textContent = formatKoreanTime(formatTime());

  // 100초 안 지났을 경우만 배터리 로직 수행
  if (duration < 10) {
    duration++;
    $pct.textContent = `${100 - duration}%`;
  } else {
    // 시계 방전

    clearInterval(timer);
    $timer.textContent = "";
    $timerSection.style.backgroundColor = "black";
  }
};

/*************************************************
 * 6) 배터리 색상 변경
 * - 10초마다 색을 다음 단계로 변경
 * - 10단계 도달 시 배터리 색상 타이머 해제
 *************************************************/
const setBatteryColor = () => {
  $batterySection.style.color = `${BATTERY_COLORS[idx]}`;
  idx++;
  if (idx === 10) clearInterval(BatteryTimer); // 마지막 단계에 도달하면 색상 변경 종료
};

/*************************************************
 * 7) 인터벌 타이머 시작
 *************************************************/
const timer = setInterval(render, 1000);
const BatteryTimer = setInterval(setBatteryColor, 10000);

/*************************************************
 * 8) 알람 목록 상태 및 상수
 *************************************************/
const alarmList = []; // 표시용 문자열(예: "오전 9시 10분")을 담는 배열
const max_alarmCnt = 3; // 최대 알람 개수
let alarmCnt = 0; // 현재 알람 개수

/*************************************************
 * 9) 알람 삭제
 * - 버튼의 data-idx에서 인덱스를 읽어 삭제
 * - 카운트 감소 후 목록 갱신
 *************************************************/
const DeleteAlarm = (btn) => {
  const index = Number(btn.dataset.idx);
  if (alarmList[index]) {
    alarmList.splice(index, 1); // 해당 인덱스 요소 삭제
    alarmCnt--;
  }
  UpdateAlarmList();
};

/*************************************************
 * 10) 알람 목록 렌더링
 * - 알람이 없으면 안내 문구 표시
 * - 각 알람은 "삭제" 버튼과 함께 렌더
 *************************************************/
const UpdateAlarmList = () => {
  $alarmList.innerHTML =
    alarmList.length === 0
      ? "알람이 없습니다. 새로운 알람을 추가해주세요!"
      : "";

  for (let i = 0; i < alarmList.length; ++i) {
    $alarmList.innerHTML += `
      <div class="alarm-item">
        <div>⏰${i + 1}번째 알람</div>
        <div>${alarmList[i]}</div>
        <button data-idx="${i}" onClick="DeleteAlarm(this)">삭제</button>
      </div>
    `;
  }

  $alarmListCnt.textContent = `(${alarmCnt})`;
};

/*************************************************
 * 11) 알람 추가
 * - 최대 3개까지 추가 가능
 * - 입력된 "HH:mm" 값을 한국식 포맷으로 변환해 저장
 *************************************************/
const addAlarm = () => {
  if (alarmCnt === max_alarmCnt) {
    alert("알람은 최대 3개까지 설정할 수 있습니다.");
    return;
  }

  // 입력값 → 한국식 표기 변환
  const newAlarmTime = formatKoreanTime($alarmInput.value);

  alarmList.push(newAlarmTime);
  alarmCnt++;
  UpdateAlarmList();
};

/*************************************************
 * 12) 이벤트 바인딩
 *************************************************/
$alarmAddButton.addEventListener("click", addAlarm);
