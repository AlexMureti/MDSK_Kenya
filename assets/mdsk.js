const body = document.body;
const nav = document.getElementById("primaryNav");
const menuToggle = document.getElementById("menuToggle");
const contrastToggle = document.getElementById("contrastToggle");
const easyToggle = document.getElementById("easyToggle");
const fontUp = document.getElementById("fontUp");
const fontDown = document.getElementById("fontDown");
const quickExit = document.getElementById("quickExit");
const guideMessages = document.getElementById("guideMessages");
const guideForm = document.getElementById("guideForm");
const guideInput = document.getElementById("guideInput");
const guideEndpoint = "";
const guideSensitivePattern = /gbv|violence|abuse|assault|rape|hiv|srhr|mental|suicide|self-harm|danger|emergency|crisis|psychosocial/i;
let fontScale = 1;
let guideHistory = [];

const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

function setFontScale(value) {
  fontScale = Math.max(0.95, Math.min(1.35, value));
  document.documentElement.style.setProperty("--font-scale", fontScale.toFixed(2));
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
}

if (nav && menuToggle) {
  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
  });
}

if (contrastToggle) {
  contrastToggle.addEventListener("click", () => {
    const on = body.classList.toggle("hc");
    contrastToggle.setAttribute("aria-pressed", String(on));
  });
}

if (easyToggle) {
  easyToggle.addEventListener("click", () => {
    const on = body.classList.toggle("easy");
    easyToggle.setAttribute("aria-pressed", String(on));
  });
}

if (fontUp) {
  fontUp.addEventListener("click", () => setFontScale(fontScale + 0.08));
}

if (fontDown) {
  fontDown.addEventListener("click", () => setFontScale(fontScale - 0.08));
}

if (quickExit) {
  quickExit.addEventListener("click", () => {
    window.location.replace("https://www.google.com/");
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function guideMessage(content, who, html = false) {
  if (!guideMessages) return null;
  const message = document.createElement("div");
  message.className = `guide-message ${who}`;
  if (html) {
    message.innerHTML = content;
  } else {
    message.textContent = content;
  }
  guideMessages.appendChild(message);
  guideMessages.scrollTop = guideMessages.scrollHeight;
  return message;
}

function localGuideAnswer(question) {
  const text = question.toLowerCase();
  const contact = '<a href="contact.html">contact MDSK</a>';
  const donate = '<a href="donate.html">donation details</a>';

  if (/^(hi|hello|hey|karibu|sasa|niaje)\b/.test(text)) {
    return `Karibu. You can ask about joining MDSK, donating by M-Pesa, caregiver support, events, accessibility, partnerships, or direct contact details. Choose one of the quick routes below or type your question.`;
  }

  if (/gbv|violence|abuse|assault|rape|hiv|srhr|mental|suicide|self-harm|danger|emergency|crisis|psychosocial/.test(text)) {
    return `For private or urgent support, avoid sharing personal details in this guide. If someone is in immediate danger, use trusted local emergency channels now. The Quick exit button is at the top of this page. For disability-responsive referrals or MDSK follow-up, ${contact} when it is safe.`;
  }

  if (/donat|mpesa|m-pesa|paybill|give|fund/.test(text)) {
    return `You can support MDSK through M-Pesa Paybill <strong>522533</strong>, Account <strong>1344899730</strong>. See ${donate} for the full support options.`;
  }

  if (/join|member|register|membership|volunteer/.test(text)) {
    return `Membership and volunteer pathways should go through MDSK directly so the team can confirm the right support route. Use ${contact}, or call <a href="tel:+254739000171">+254 739 000 171</a>.`;
  }

  if (/caregiver|family|diaper|incontinence|baba|mama|tota/.test(text)) {
    return `MDSK's Family Inclusion work includes caregiver support and dignity supplies such as the Baba Diaper, Mama Diaper, and Tota Diaper campaign. The best next step is to ${contact} and describe the county, support need, and urgency.`;
  }

  if (/partner|organization|institution|ngo|government|donor|media|press/.test(text)) {
    return `MDSK partnership routes include health access, GBV/SRHR/HIV response, livelihoods, accessibility, caregiver dignity, media, research, and inclusive employment. Start with ${contact}; include the organization name, proposed support area, timeline, and lead contact person.`;
  }

  if (/ksl|sign|language|easy|read|swahili|kiswahili|accessib|contrast|font/.test(text)) {
    return `MDSK's access pathway includes Kiswahili structure, Easy Read support, high contrast, larger text, keyboard navigation, and space for future Kenyan Sign Language videos. The display controls are at the top of the page, and access issues can go through ${contact}.`;
  }

  if (/event|conference|world aids|men'?s day|summit|afralti|kise/.test(text)) {
    return `MDSK's signature platforms include the National Conference 2025, World AIDS Day walk, International Men's Day, HIV-response advocacy, and health integration events. The conference theme was rights, dignity, and inclusion for men and boys with disabilities and caregivers.`;
  }

  if (/phone|email|address|reach|contact|office|where/.test(text)) {
    return `MDSK is based at Kenbanco House, Moi Avenue, Nairobi. Email <a href="mailto:info@menwdsocietyk.org">info@menwdsocietyk.org</a> or call <a href="tel:+254739000171">+254 739 000 171</a>. Full details are in the ${contact} section.`;
  }

  if (/what|mission|vision|objective|work|program|does/.test(text)) {
    return `MDSK advances rights, health, psychosocial wellbeing, inclusive education, livelihoods, leadership, caregiving support, and partnerships for boys and men with disabilities and their caregivers across Kenya.`;
  }

  return `I can help you find the right MDSK route: membership, donations, caregiver support, partnerships, accessibility, events, or contact details. For personal follow-up, ${contact} directly so a team member can respond.`;
}

async function askGuide(question) {
  const clean = question.trim();
  if (!clean || !guideMessages) return;

  guideMessage(clean, "user");
  if (guideInput) {
    guideInput.value = "";
  }
  const pending = guideMessage("Finding the best MDSK route...", "bot");
  if (!pending) return;
  const sensitive = guideSensitivePattern.test(clean);

  if (guideEndpoint && !sensitive) {
    try {
      const response = await fetch(guideEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: clean,
          history: guideHistory.slice(-6),
          context: "MDSK public website access navigator"
        })
      });
      if (!response.ok) throw new Error("Guide endpoint failed");
      const data = await response.json();
      const reply = data && data.reply ? String(data.reply) : localGuideAnswer(clean);
      pending.textContent = reply;
      guideHistory.push({ q: clean, a: reply });
      return;
    } catch (error) {
      pending.innerHTML = localGuideAnswer(clean);
      guideHistory.push({ q: clean, a: pending.textContent || "" });
      return;
    }
  }

  pending.innerHTML = localGuideAnswer(clean);
  guideHistory.push({ q: clean, a: pending.textContent || "" });
}

document.querySelectorAll("[data-guide-prompt]").forEach((button) => {
  button.addEventListener("click", () => {
    const prompt = button.getAttribute("data-guide-prompt") || "";
    askGuide(prompt);
    if (guideInput) guideInput.focus();
  });
});

if (guideForm && guideInput) {
  guideForm.addEventListener("submit", (event) => {
    event.preventDefault();
    askGuide(guideInput.value);
  });
}

if (guideInput) {
  guideInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      askGuide(guideInput.value);
    }
  });
}
