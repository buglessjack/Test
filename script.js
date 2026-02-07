// 1. DATA: Subject Code -> Full Name Mapping
const subjectMap = {
  // AI (Theory + Lab)
  "CS-4214": "Advanced AI + Machine Learning",
  "CS-4214 (Lab)": "Advanced AI + Machine Learning",
  "CS-4214(Lab)": "Advanced AI + Machine Learning",

  // Cloud Computing
  "CS-4216": "Cloud Computing",
  "CS-4216 (Lab)": "Cloud Computing",
  "CS-4216(Lab)": "Cloud Computing",

  "CST-4211": "Distributed and Parallel Computing",
  "CST-4257": "Business Info System (e-Commerce)",

  // Database
  "CS-4225": "Advanced Database System",
  "CS-4225 (Lab)": "Advanced Database System",
  "CS-4225(Lab)": "Advanced Database System",

  "CST-4242": "Modeling and Simulations",

  // OODD
  "CS-4223": "Object-Oriented Design (OODD)",
  "CS-4223 (Lab)": "Object-Oriented Design (OODD)",
  "CS-4223(Lab)": "Object-Oriented Design (OODD)",

  // Self Study & Library
  Library: "Library",
  "Self-Study": "Self-Study",
};

// ==========================================
// 2. TIME & LIVE LOGIC
// ==========================================
function updateTimeAndLiveSpot() {
  const now = new Date();
  const dateString = now.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeString = now.toLocaleTimeString();

  // Update Main Header
  const clockEl = document.getElementById("live-clock");
  if (clockEl) clockEl.innerText = `${dateString} - ${timeString}`;

  // Update Modal Time
  const modalTimeEl = document.getElementById("modal-today-time");
  if (modalTimeEl) {
    modalTimeEl.innerText = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  // Live Slot Logic
  const day = now.getDay();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const slots = [
    { index: 0, start: 510, end: 570 },
    { index: 1, start: 575, end: 635 },
    { index: 2, start: 640, end: 700 },
    { index: 3, start: 700, end: 760 },
    { index: 4, start: 760, end: 820 },
    { index: 5, start: 825, end: 885 },
    { index: 6, start: 890, end: 950 },
  ];

  // Reset Styles
  document
    .querySelectorAll(".live-indicator-group")
    .forEach((el) => el.remove());
  document
    .querySelectorAll(".live-active-bg")
    .forEach((el) => el.classList.remove("live-active-bg"));

  // Reset Modal Rows
  document.querySelectorAll(".modal-row").forEach((el) => {
    el.classList.remove(
      "bg-green-50",
      "scale-[1.02]",
      "shadow-sm",
      "z-10",
      "relative",
    );
    el.classList.add("hover:bg-slate-50");
    const dot = el.querySelector(".live-dot");
    if (dot) dot.remove();
  });

  if (day === 0 || day === 6) return;

  let activeSlotIndex = -1;
  for (let i = 0; i < slots.length; i++) {
    if (currentMins >= slots[i].start && currentMins < slots[i].end) {
      activeSlotIndex = i;
      break;
    }
  }

  if (activeSlotIndex !== -1) {
    // Update Page
    let desktopId = `d${day}-s${activeSlotIndex}`;
    let mobileId = `mob-d${day}-s${activeSlotIndex}`;

    if (day === 1 && (activeSlotIndex === 5 || activeSlotIndex === 6)) {
      desktopId = `d1-s56`;
      mobileId = `mob-d1-s56`;
    }
    if (day === 2 && (activeSlotIndex === 0 || activeSlotIndex === 1)) {
      desktopId = `d2-s01`;
      mobileId = `mob-d2-s01`;
    }
    if (day === 3 && (activeSlotIndex === 0 || activeSlotIndex === 1)) {
      desktopId = `d3-s01`;
      mobileId = `mob-d3-s01`;
    }
    if (activeSlotIndex === 3) {
      desktopId = `lunch-col`;
      mobileId = `mob-d${day}-s3`;
    }

    injectLiveIndicator(desktopId, false);
    injectLiveIndicator(mobileId, true);

    // Update Modal
    const activeModalRow = document.querySelector(
      `#modal-today-content div[data-original-id="${mobileId}"]`,
    );
    if (activeModalRow) {
      activeModalRow.classList.remove("hover:bg-slate-50");
      activeModalRow.classList.add(
        "bg-green-50",
        "scale-[1.02]",
        "shadow-sm",
        "z-10",
        "relative",
        "rounded-xl",
      );

      // Add Dot
      const dot = document.createElement("span");
      dot.className = "live-dot mx-3";
      dot.style.width = "8px";
      dot.style.height = "8px";
      activeModalRow.insertBefore(dot, activeModalRow.lastElementChild);
    }
  }
}

function injectLiveIndicator(elementId, isMobile) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.classList.add("live-active-bg");
  const container = document.createElement("span");
  container.className =
    "live-indicator-group inline-flex items-center justify-center bg-transparent px-2 py-0.5 mx-2";
  if (isMobile) {
    container.innerHTML = `<span class="live-dot"></span>`;
    const timeSpan = el.querySelector(".mobile-time");
    if (timeSpan) timeSpan.after(container);
    else el.prepend(container);
  } else {
    container.innerHTML = `<span class="live-dot mr-1"></span><span class="text-green-700 font-bold text-[12px] leading-none uppercase">Now</span>`;
    const wrapper = document.createElement("div");
    wrapper.className = "live-indicator-group mb-1 flex justify-center";
    wrapper.appendChild(container);
    container.className =
      "inline-flex items-center justify-center bg-green-100 bg-transparent rounded px-2 py-0.5";
    el.prepend(wrapper);
  }
}

// 3. POPOVER TOGGLE
function toggleSubjectPopover(event, id) {
  event.stopPropagation();
  const popover = document.getElementById(id);

  // Close others
  document.querySelectorAll(".subject-popover").forEach((el) => {
    if (el.id !== id) el.classList.add("hidden", "opacity-0", "translate-y-2");
  });

  if (popover && popover.innerText.trim() !== "") {
    if (popover.classList.contains("hidden")) {
      popover.classList.remove("hidden");
      setTimeout(
        () => popover.classList.remove("opacity-0", "translate-y-2"),
        10,
      );
    } else {
      popover.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => popover.classList.add("hidden"), 200);
    }
  }
}

// Close on click outside
document.addEventListener("click", function (e) {
  if (!e.target.closest(".subject-btn")) {
    document.querySelectorAll(".subject-popover").forEach((el) => {
      el.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => el.classList.add("hidden"), 200);
    });
  }
});

// 4. GENERATE CONTENT
window.addEventListener("load", function () {
  const modal = document.getElementById("modal-today");
  const contentDiv = document.getElementById("modal-today-content");
  const dateEl = document.getElementById("modal-today-date");
  const dayEl = document.getElementById("modal-today-day");
  const body = document.querySelector("body");

  const now = new Date();
  const dayIndex = now.getDay();

  dateEl.innerText = now.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  dayEl.innerText = now.toLocaleDateString("en-GB", { weekday: "long" });

  if (dayIndex === 0 || dayIndex === 6) {
    contentDiv.innerHTML = `<div class="text-center py-12"><span class="text-5xl block mb-4">🎉</span><h4 class="text-lg font-bold text-slate-800">Happy Weekend!</h4><p class="text-slate-500 text-sm mt-1">No classes today.</p></div>`;
  } else {
    const mobileCards = document.querySelectorAll(".mobile-card");
    const targetCard = mobileCards[dayIndex - 1];

    if (targetCard) {
      const rows = targetCard.querySelectorAll(
        ".flex.justify-between, .text-center",
      );
      let htmlContent = '<div class="space-y-1">';

      rows.forEach((row, index) => {
        const originalId = row.id;
        if (row.classList.contains("text-center")) {
          // Lunch
          htmlContent += `<div class="modal-row py-1 my-2 text-center bg-slate-50 rounded-xl" data-original-id="${originalId}"><span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lunch Break</span></div>`;
        } else {
          // Class Row
          const timeText = row.querySelector(".mobile-time")?.innerText || "";
          const rawSubjectHtml =
            row.querySelector(".mobile-subject")?.innerText.trim() || "";
          const fullName = subjectMap[rawSubjectHtml] || "";
          const popoverId = `pop-${originalId}-${index}`;

          htmlContent += `
                        <div class="modal-row flex justify-between items-center py-3.5 px-4 rounded-xl transition-all cursor-default" data-original-id="${originalId}">
                            <div class="modal-time flex items-center text-xs font-bold text-slate-500 w-1/3">${timeText}</div>
                            <div class="w-1/3 text-right relative group">
                                <button onclick="toggleSubjectPopover(event, '${popoverId}')" class="subject-btn inline-block text-slate-900 hover:text-indigo-600 text-sm font-extrabold transition-colors focus:outline-none">
                                    ${rawSubjectHtml}
                                </button>
                                <div id="${popoverId}" class="${fullName ? "" : "hidden"} subject-popover hidden opacity-0 translate-y-2 transition-all duration-200 ease-out absolute right-0 bottom-full mb-2 w-auto whitespace-nowrap bg-white text-slate-800 text-xs font-semibold px-4 py-3 rounded-xl shadow-xl ring-1 ring-black/5 z-50 text-center">
                                    ${fullName}
                                    <div class="absolute bottom-[-6px] right-4 w-3 h-3 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
                                </div>
                            </div>
                        </div>
                    `;
        }
      });
      htmlContent += "</div>";
      contentDiv.innerHTML = htmlContent;
    }
  }
  modal.classList.remove("hidden");
  body.classList.add("overflow-hidden");
});

function closeTodayModal() {
  const modal = document.getElementById("modal-today");
  const body = document.querySelector("body");
  modal.classList.add("hidden");
  body.classList.remove("overflow-hidden");
}

updateTimeAndLiveSpot();
setInterval(updateTimeAndLiveSpot, 1000);

function toggleModal(modalID) {
  const modal = document.getElementById(modalID);
  const body = document.querySelector("body");
  if (modal) {
    modal.classList.toggle("hidden");
    modal.classList.toggle("block");
    if (!modal.classList.contains("hidden")) {
      body.classList.add("overflow-hidden");
    } else {
      body.classList.remove("overflow-hidden");
    }
  }
}

// GAp
function injectLiveIndicator(elementId, isMobile) {
  const el = document.getElementById(elementId);
  if (!el) return;

  // Highlight row/cell background
  el.classList.add("live-active-bg");

  // Create the container group
  const container = document.createElement("span");
  container.className =
    "live-indicator-group inline-flex items-center justify-center bg-transparent px-2 py-0.5 mx-2";

  if (isMobile) {
    // Mobile: Just the dot, no text
    container.innerHTML = `<span class="live-dot"></span>`;

    // Mobile placement
    const timeSpan = el.querySelector(".mobile-time");
    if (timeSpan) {
      timeSpan.after(container);
    } else {
      el.prepend(container);
    }
  } else {
    // Desktop: Dot + "Now" text
    container.innerHTML = `
            <span class="live-dot mr-1"></span>
            <span class="text-green-700 font-bold text-[12px] leading-none uppercase">Now</span>
          `;

    // Desktop placement (wrapped in div to stack nicely)
    const wrapper = document.createElement("div");
    wrapper.className = "live-indicator-group mb-1 flex justify-center";
    wrapper.appendChild(container);

    // Add specific classes for desktop look
    container.className =
      "inline-flex items-center justify-center bg-green-100 bg-transparent rounded px-2 py-0.5";

    el.prepend(wrapper);
  }
}

// Run immediately and every second
updateTimeAndLiveSpot();
setInterval(updateTimeAndLiveSpot, 1000);

function toggleModal(modalID) {
  const modal = document.getElementById(modalID);
  const body = document.querySelector("body");

  if (modal) {
    modal.classList.toggle("hidden");
    modal.classList.toggle("block"); // Keeps it as a block element

    // Lock background scroll when modal is open
    if (!modal.classList.contains("hidden")) {
      body.classList.add("overflow-hidden");
    } else {
      body.classList.remove("overflow-hidden");
    }
  }
}
