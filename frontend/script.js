// =====================================================================
// PLINTH — property valuation UI logic
// =====================================================================

// Point this at wherever your FastAPI app (main.py) is actually running.
// Locally that's usually http://127.0.0.1:8000 — update for a deployed API.
const API_BASE = "https://house-price-prediction-ng0y.onrender.com";
const PREDICT_ENDPOINT = `${API_BASE}/predict`;

// ---------------------------------------------------------------------
// Locations known to the model (mirrors TOP_LOCATIONS in main.py).
// Anything typed that isn't in this list is sent as "Other".
// ---------------------------------------------------------------------
const KNOWN_LOCATIONS = [
  "Electronic City Phase II","Chikka Tirupathi","Uttarahalli","Lingadheeranahalli","Kothanur",
  "Whitefield","Old Airport Road","Rajaji Nagar","Marathahalli","7th Phase JP Nagar","Gottigere",
  "Sarjapur","Mysore Road","Bisuvanahalli","Raja Rajeshwari Nagar","Kengeri","Binny Pete",
  "Thanisandra","Bellandur","Electronic City","Ramagondanahalli","Yelahanka","Hebbal",
  "Kasturi Nagar","Kanakpura Road","Electronics City Phase 1","Kundalahalli","Chikkalasandra",
  "Murugeshpalya","Sarjapur  Road","Ganga Nagar","HSR Layout","Doddathoguru","KR Puram",
  "Bhoganhalli","Lakshminarayana Pura","Begur Road","Devanahalli","Varthur","Bommanahalli",
  "Gunjur","Hegde Nagar","Haralur Road","Hennur Road","Kothannur","Kalena Agrahara",
  "Kaval Byrasandra","ISRO Layout","Garudachar Palya","EPIP Zone","Dasanapura","Kasavanhalli",
  "Sanjay nagar","Domlur","Sarjapura - Attibele Road","Yeshwanthpur","Chandapura","Nagarbhavi",
  "Ramamurthy Nagar","Malleshwaram","Akshaya Nagar","Shampura","Kadugodi","LB Shastri Nagar",
  "Hormavu","Vishwapriya Layout","Kudlu Gate","8th Phase JP Nagar","Bommasandra Industrial Area",
  "Anandapura","Vishveshwarya Layout","Kengeri Satellite Town","Kannamangala",
  " Devarachikkanahalli","Hulimavu","Mahalakshmi Layout","Hosa Road","Attibele","CV Raman Nagar",
  "Kumaraswami Layout","Nagavara","Hebbal Kempapura","Vijayanagar","Pattandur Agrahara",
  "Nagasandra","Kogilu","Panathur","Padmanabhanagar","1st Block Jayanagar","Kammasandra",
  "Dasarahalli","Magadi Road","Koramangala","Dommasandra","Budigere","Kalyan nagar",
  "OMBR Layout","Horamavu Agara","Ambedkar Nagar","Talaghattapura","Balagere","Jigani",
  "Gollarapalya Hosahalli","Old Madras Road","Kaggadasapura","9th Phase JP Nagar","Jakkur",
  "TC Palaya","Giri Nagar","Singasandra","AECS Layout","Mallasandra","Begur","JP Nagar",
  "Malleshpalya","Munnekollal","Kaggalipura","6th Phase JP Nagar","Ulsoor","Thigalarapalya",
  "Somasundara Palya","Basaveshwara Nagar","Bommasandra","Ardendale","Harlur","Kodihalli",
  "Bannerghatta Road","Hennur","5th Phase JP Nagar","Kodigehaali","Billekahalli","Jalahalli",
  "Mahadevpura","Anekal","Sompura","Dodda Nekkundi","Hosur Road","Battarahalli","Sultan Palaya",
  "Ambalipura","Hoodi","Brookefield","Yelenahalli","Vittasandra","2nd Stage Nagarbhavi",
  "Vidyaranyapura","Amruthahalli","Kodigehalli","Subramanyapura","Basavangudi","Kenchenahalli",
  "Banjara Layout","Kereguddadahalli","Kambipura","Banashankari Stage III","Sector 7 HSR Layout",
  "Rajiv Nagar","Arekere","Mico Layout","Kammanahalli","Banashankari","Chikkabanavar",
  "HRBR Layout","Nehru Nagar","Kanakapura","Konanakunte","Margondanahalli","R.T. Nagar",
  "Tumkur Road","Vasanthapura","GM Palaya","Jalahalli East","Hosakerehalli","Indira Nagar",
  "Kodichikkanahalli","Varthur Road","Anjanapura","Abbigere","Tindlu","Gubbalala","Dairy Circle",
  "Cunningham Road","Kudlu","Banashankari Stage VI","Cox Town","Kathriguppe","HBR Layout",
  "Yelahanka New Town","Sahakara Nagar","Rachenahalli","Sadashiva Nagar","Yelachenahalli",
  "Green Glen Layout","Thubarahalli","Naganathapura","Horamavu Banaswadi","1st Phase JP Nagar",
  "NGR Layout","Seegehalli","NRI Layout","ITPL","Babusapalaya","Nagappa Reddy Layout",
  "BTM 1st Stage","Iblur Village","Ananth Nagar","Channasandra","Choodasandra",
  "Kaikondrahalli","Neeladri Nagar","Frazer Town","Cooke Town","Doddakallasandra","Chamrajpet",
  "Rayasandra","Kalkere","5th Block Hbr Layout","Pai Layout","Banashankari Stage V",
  "Sonnenahalli","Benson Town","Poorna Pragna Layout","Judicial Layout","Banashankari Stage II",
  "Karuna Nagar","Bannerghatta","Marsur","Bommenahalli","Laggere","Prithvi Layout","Banaswadi",
  "Sector 2 HSR Layout","Shivaji Nagar","Nagavarapalya","BTM Layout","BTM 2nd Stage",
  "1st Block Koramangala","Hoskote","Doddaballapur","Gunjur Palya","Sarakki Nagar",
  "Thyagaraja Nagar","Bharathi Nagar","Dodsworth Layout","HAL 2nd Stage","Kadubeesanahalli"
];

// ---------------------------------------------------------------------
// Populate the location datalist once, on load.
// ---------------------------------------------------------------------
function populateLocations() {
  const list = document.getElementById("locationList");
  const frag = document.createDocumentFragment();
  KNOWN_LOCATIONS.slice().sort((a, b) => a.trim().localeCompare(b.trim())).forEach((loc) => {
    const opt = document.createElement("option");
    opt.value = loc.trim();
    frag.appendChild(opt);
  });
  list.appendChild(frag);
}

// ---------------------------------------------------------------------
// Draw the blueprint grid backdrop once (SVG, cheap one-shot animation).
// ---------------------------------------------------------------------
function buildGridBackdrop() {
  const svg = document.getElementById("gridBackdrop");
  const ns = "http://www.w3.org/2000/svg";
  const w = window.innerWidth;
  const h = window.innerHeight;
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

  const step = w < 640 ? 64 : 88;
  const frag = document.createDocumentFragment();
  let delay = 0;

  for (let x = 0; x <= w; x += step) {
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", x); line.setAttribute("y1", 0);
    line.setAttribute("x2", x); line.setAttribute("y2", h);
    line.classList.add("draw");
    line.style.setProperty("--len", h);
    line.style.setProperty("--delay", `${delay}s`);
    frag.appendChild(line);
    delay += 0.012;
  }
  for (let y = 0; y <= h; y += step) {
    const line = document.createElementNS(ns, "line");
    line.setAttribute("x1", 0); line.setAttribute("y1", y);
    line.setAttribute("x2", w); line.setAttribute("y2", y);
    line.classList.add("draw");
    line.style.setProperty("--len", w);
    line.style.setProperty("--delay", `${delay}s`);
    frag.appendChild(line);
    delay += 0.012;
  }
  svg.appendChild(frag);
}

// ---------------------------------------------------------------------
// Currency formatting — Indian Lakh/Crore convention.
// API returns predicted_price in plain rupees.
// ---------------------------------------------------------------------
function formatIndianPrice(rupees) {
  if (rupees >= 1e7) {
    return { value: rupees / 1e7, unit: "Crore", perSqftBasis: rupees };
  }
  return { value: rupees / 1e5, unit: "Lakh", perSqftBasis: rupees };
}

function formatNumber(n, decimals) {
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// ---------------------------------------------------------------------
// Animate a number counting up (rAF-driven, cancels cleanly).
// ---------------------------------------------------------------------
let countRAF = null;
function animateCount(el, target, decimals, durationMs = 900) {
  if (countRAF) cancelAnimationFrame(countRAF);
  const start = performance.now();
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    el.textContent = `₹${formatNumber(target, decimals)}`;
    return;
  }

  function tick(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / durationMs, 1);
    const eased = 1 - Math.pow(1 - t, 3); // ease-out-cubic
    const current = target * eased;
    el.textContent = `₹${formatNumber(current, decimals)}`;
    if (t < 1) {
      countRAF = requestAnimationFrame(tick);
    }
  }
  countRAF = requestAnimationFrame(tick);
}

// ---------------------------------------------------------------------
// UI state helpers
// ---------------------------------------------------------------------
const states = {
  empty: document.getElementById("stateEmpty"),
  loading: document.getElementById("stateLoading"),
  error: document.getElementById("stateError"),
  result: document.getElementById("stateResult"),
};

function showState(name) {
  Object.entries(states).forEach(([key, el]) => {
    el.hidden = key !== name;
  });
}

// ---------------------------------------------------------------------
// Form submission
// ---------------------------------------------------------------------
const form = document.getElementById("surveyForm");
const submitBtn = document.getElementById("submitBtn");
const formError = document.getElementById("formError");
const locationNote = document.getElementById("locationNote");

let lastPayload = null;

async function runValuation(payload) {
  showState("loading");
  submitBtn.disabled = true;

  try {
    const res = await fetch(PREDICT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let detail = "";
      try {
        const errBody = await res.json();
        detail = errBody?.detail
          ? (Array.isArray(errBody.detail) ? errBody.detail.map(d => d.msg).join(", ") : errBody.detail)
          : "";
      } catch (_) {}
      throw new Error(detail || `Request failed (${res.status})`);
    }

    const data = await res.json();
    renderResult(data, payload);
  } catch (err) {
    const messageEl = document.getElementById("errorMessage");
    if (err.message && err.message.toLowerCase().includes("failed to fetch")) {
      messageEl.textContent = "Couldn't reach the valuation engine. Make sure the API server is running.";
    } else {
      messageEl.textContent = err.message || "Something went wrong while valuing this property.";
    }
    showState("error");
  } finally {
    submitBtn.disabled = false;
  }
}

function renderResult(data, payload) {
  const price = Number(data.predicted_price);
  const { value, unit } = formatIndianPrice(price);
  const decimals = unit === "Crore" ? 2 : 1;

  const isKnown = KNOWN_LOCATIONS.some(
    (l) => l.trim().toLowerCase() === payload.location.trim().toLowerCase()
  );

  document.getElementById("stampUnit").textContent = unit;
  document.getElementById("breakdownRate").textContent =
    `₹${formatNumber(price / payload.total_sqft, 0)} / sq ft`;
  document.getElementById("breakdownBasis").textContent =
    `${payload.size} BHK · ${formatNumber(payload.total_sqft, 0)} sq ft`;

  const noteEl = document.getElementById("resultNote");
  if (!isKnown) {
    noteEl.textContent = `We don't have enough listings for "${payload.location}" specifically, so this uses our general Bangalore benchmark.`;
    noteEl.hidden = false;
  } else {
    noteEl.hidden = true;
  }

  showState("result");

  const stampEl = document.getElementById("stamp");
  stampEl.classList.remove("stamp-in");
  void stampEl.offsetWidth; // restart animation
  stampEl.classList.add("stamp-in");

  animateCount(document.getElementById("stampPrice"), value, decimals);
}

function validateForm() {
  const size = Number(document.getElementById("size").value);
  const sqft = Number(document.getElementById("sqft").value);
  const location = document.getElementById("location").value.trim();

  if (!size || size < 1) return "Enter a size of at least 1 BHK.";
  if (!sqft || sqft <= 0) return "Enter a total area greater than 0 sq ft.";
  if (!location) return "Enter a locality name.";
  return null;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  formError.hidden = true;

  const validationMessage = validateForm();
  if (validationMessage) {
    formError.textContent = validationMessage;
    formError.hidden = false;
    return;
  }

  lastPayload = {
    size: Number(document.getElementById("size").value),
    total_sqft: Number(document.getElementById("sqft").value),
    location: document.getElementById("location").value.trim(),
  };

  runValuation(lastPayload);
});

document.getElementById("retryBtn").addEventListener("click", () => {
  if (lastPayload) runValuation(lastPayload);
});

// ---------------------------------------------------------------------
// Init
// ---------------------------------------------------------------------
populateLocations();
buildGridBackdrop();

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    document.getElementById("gridBackdrop").innerHTML = "";
    buildGridBackdrop();
  }, 300);
});
