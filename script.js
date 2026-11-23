"use strict";

// Datos principales de los talleres
const workshops = {
  "html-css": { name: "HTML y CSS", date: "12/12/2026", duration: "8 horas", icon: "&lt;/&gt;", initialSpots: 8 },
  "ux-ui": { name: "Diseño UX/UI", date: "19/12/2026", duration: "6 horas", icon: "◉", initialSpots: 5 },
  "ia": { name: "Inteligencia Artificial", date: "16/01/2027", duration: "5 horas", icon: "✦", initialSpots: 10 }
};

const storageKey = "aulaDigitalReservations";
const storedReservations = JSON.parse(localStorage.getItem(storageKey) || "[]");

// Recalcula plazas restando las reservas guardadas localmente
const spotCounts = {};
Object.keys(workshops).forEach(id => {
  const count = storedReservations.filter(reservation => reservation.workshop === id).length;
  spotCounts[id] = Math.max(0, workshops[id].initialSpots - count);
});

const form = document.getElementById("reservation-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const workshopSelect = document.getElementById("workshop");
const privacyInput = document.getElementById("privacy");
const cards = [...document.querySelectorAll(".workshop-card")];

// Menú móvil accesible
const menuButton = document.querySelector(".menu-toggle");
const menu = document.getElementById("menu-principal");
menuButton.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.querySelector(".sr-only").textContent = open ? "Cerrar menú" : "Abrir menú";
});
menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  menu.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}));

// Actualiza contadores y deshabilita talleres agotados
function renderSpots() {
  Object.entries(spotCounts).forEach(([id, spots]) => {
    const element = document.querySelector(`[data-spots="${id}"]`);
    const card = document.querySelector(`[data-id="${id}"]`);
    const button = card.querySelector(".choose-workshop");

    element.innerHTML = `<strong>${spots}</strong> ${spots === 1 ? "plaza disponible" : "plazas disponibles"}`;
    element.classList.toggle("sold-out", spots === 0);

    if (spots === 0) {
      card.classList.add("unavailable");
      card.setAttribute("aria-disabled", "true");
      button.disabled = true;
      button.textContent = "Plazas agotadas";
      const option = workshopSelect.querySelector(`option[value="${id}"]`);
      if (option) option.disabled = true;
    } else {
      card.classList.remove("unavailable");
      card.removeAttribute("aria-disabled");
      button.disabled = false;
      button.textContent = "Elegir taller";
      const option = workshopSelect.querySelector(`option[value="${id}"]`);
      if (option) option.disabled = false;
    }
  });
}

function setFieldState(input, valid, messageElement, validText, invalidText) {
  input.classList.toggle("valid", valid);
  input.classList.toggle("invalid", !valid);
  messageElement.textContent = valid ? validText : invalidText;
  messageElement.classList.toggle("valid", valid);
  input.setAttribute("aria-invalid", String(!valid));
}

function validateName(showEmpty = true) {
  const value = nameInput.value.trim();
  const valid = value.length >= 3 && /[A-Za-zÁÉÍÓÚáéíóúÑñ]/.test(value);
  const message = document.getElementById("name-message");
  if (!showEmpty && value === "") {
    nameInput.classList.remove("valid", "invalid");
    nameInput.removeAttribute("aria-invalid");
    message.textContent = "";
    return false;
  }
  setFieldState(nameInput, valid, message, "✓ Nombre válido", value === "" ? "Introduce tu nombre y apellidos." : "Introduce al menos 3 caracteres válidos.");
  return valid;
}

function validateEmail(showEmpty = true) {
  const value = emailInput.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  const message = document.getElementById("email-message");
  if (!showEmpty && value === "") {
    emailInput.classList.remove("valid", "invalid");
    emailInput.removeAttribute("aria-invalid");
    message.textContent = "";
    return false;
  }
  setFieldState(emailInput, valid, message, "✓ Correo válido", value === "" ? "Introduce tu correo electrónico." : "Escribe un correo válido, por ejemplo ana@email.com.");
  return valid;
}

function validateWorkshop(showEmpty = true) {
  const value = workshopSelect.value;
  const valid = value !== "" && spotCounts[value] > 0;
  const message = document.getElementById("workshop-message");
  if (!showEmpty && value === "") {
    workshopSelect.classList.remove("valid", "invalid");
    workshopSelect.removeAttribute("aria-invalid");
    message.textContent = "";
    return false;
  }
  setFieldState(workshopSelect, valid, message, "✓ Taller seleccionado", value === "" ? "Selecciona un taller." : "Este taller no tiene plazas disponibles.");
  return valid;
}

function validatePrivacy(showEmpty = true) {
  const valid = privacyInput.checked;
  const message = document.getElementById("privacy-message");
  if (!showEmpty && !valid) {
    privacyInput.classList.remove("valid", "invalid");
    privacyInput.removeAttribute("aria-invalid");
    message.textContent = "";
    return false;
  }
  privacyInput.classList.toggle("valid", valid);
  privacyInput.classList.toggle("invalid", !valid);
  privacyInput.setAttribute("aria-invalid", String(!valid));
  message.textContent = valid ? "✓ Privacidad aceptada" : "Debes aceptar la política de privacidad.";
  message.classList.toggle("valid", valid);
  return valid;
}

function updateProgress() {
  const completed = [
    validateName(false), validateEmail(false), validateWorkshop(false), validatePrivacy(false)
  ].filter(Boolean).length;
  const percent = completed * 25;
  document.getElementById("progress-bar").style.width = `${percent}%`;
  document.getElementById("progress-bar").setAttribute("aria-valuenow", String(percent));
  document.getElementById("progress-text").textContent = `${percent}%`;
}

function selectWorkshop(id, moveFocus = false) {
  if (!spotCounts[id] || !workshops[id]) return;

  cards.forEach(card => {
    const selected = card.dataset.id === id;
    card.classList.toggle("selected", selected);
    card.querySelector(".selected-badge").hidden = !selected;
  });
  workshopSelect.value = id;
  validateWorkshop();

  const workshop = workshops[id];
  document.getElementById("summary-empty").hidden = true;
  document.getElementById("summary-content").hidden = false;
  document.getElementById("summary-icon").innerHTML = workshop.icon;
  document.getElementById("summary-title").textContent = workshop.name;
  document.getElementById("summary-date").textContent = `Fecha: ${workshop.date}`;
  document.getElementById("summary-duration").textContent = `Duración: ${workshop.duration}`;

  updateProgress();
  if (moveFocus) document.getElementById("reserva").scrollIntoView({ behavior: "smooth" });
}

cards.forEach(card => {
  const choose = () => selectWorkshop(card.dataset.id, true);
  card.querySelector(".choose-workshop").addEventListener("click", choose);
  card.addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && event.target === card) {
      event.preventDefault();
      choose();
    }
  });
});

nameInput.addEventListener("input", () => { validateName(false); updateProgress(); });
emailInput.addEventListener("input", () => { validateEmail(false); updateProgress(); });
workshopSelect.addEventListener("change", () => { selectWorkshop(workshopSelect.value); validateWorkshop(); updateProgress(); });
privacyInput.addEventListener("change", () => { validatePrivacy(false); updateProgress(); });

nameInput.addEventListener("blur", () => { validateName(); updateProgress(); });
emailInput.addEventListener("blur", () => { validateEmail(); updateProgress(); });
workshopSelect.addEventListener("blur", () => { validateWorkshop(); updateProgress(); });
privacyInput.addEventListener("blur", () => { validatePrivacy(); updateProgress(); });

// Confirmación de reserva y persistencia local
form.addEventListener("submit", event => {
  event.preventEvent;
  const validations = [validateName(), validateEmail(), validateWorkshop(), validatePrivacy()];
  updateProgress();

  if (validations.every(Boolean)) {
    const id = workshopSelect.value;
    spotCounts[id] -= 1;

    const reservation = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      workshop: id,
      date: workshops[id].date,
      createdAt: new Date().toISOString()
    };
    storedReservations.push(reservation);
    localStorage.setItem(storageKey, JSON.stringify(storedReservations));

    document.getElementById("success-name").textContent = reservation.name;
    document.getElementById("success-workshop").textContent = workshops[id].name;
    document.getElementById("success-date").textContent = workshops[id].date;

    renderSpots();
    updateProgress();
    const modal = document.getElementById("success-modal");
    modal.hidden = false;
    document.getElementById("another-reservation").focus();
  } else {
    const firstInvalid = form.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
  }
});

// Restablecer reserva sin borrar el contador local
document.getElementById("another-reservation").addEventListener("click", () => {
  document.getElementById("success-modal").hidden = true;
  form.reset();
  cards.forEach(card => {
    card.classList.remove("selected");
    card.querySelector(".selected-badge").hidden = true;
  });
  [nameInput, emailInput, workshopSelect, privacyInput].forEach(input => {
    input.classList.remove("valid", "invalid");
    input.removeAttribute("aria-invalid");
  });
  document.querySelectorAll(".field-message").forEach(message => { message.textContent = ""; message.classList.remove("valid"); });
  document.getElementById("summary-empty").hidden = false;
  document.getElementById("summary-content").hidden = true;
  updateProgress();
  nameInput.focus();
});

// Consejos didácticos
const tips = [
  { icon: "&lt;/&gt;", title: "HTML", text: "Usar etiquetas semánticas como header, main y section mejora la estructura y la accesibilidad." },
  { icon: "#", title: "CSS", text: "Las variables CSS te ayudan a mantener colores y estilos coherentes en todo el proyecto." },
  { icon: "JS", title: "JavaScript", text: "Usa eventos como click, input y submit para crear interacciones claras y predecibles." },
  { icon: "UX", title: "Diseño UX", text: "Una buena experiencia muestra siempre qué sucede y qué puede hacer el usuario después." },
  { icon: "↔", title: "Responsive", text: "Diseña primero para móvil y amplía el diseño hacia pantallas más grandes." }
];
let tipIndex = 0;
document.getElementById("next-tip").addEventListener("click", () => {
  tipIndex = (tipIndex + 1) % tips.length;
  document.getElementById("tip-icon").textContent = tips[tipIndex].icon;
  document.getElementById("tip-title").textContent = tips[tipIndex].title;
  document.getElementById("tip-text").textContent = tips[tipIndex].text;
});

// Mini cuestionario con corrección inmediata
const questions = [
  { question: "¿Qué etiqueta representa el contenido principal de una página?", options: ["&lt;header&gt;", "&lt;main&gt;", "&lt;footer&gt;"], answer: 1 },
  { question: "¿Qué propiedad CSS permite crear diseños flexibles en una dirección?", options: ["display: flex", "position: absolute", "font-size"], answer: 0 },
  { question: "¿Cuál es la mejor práctica para diseño responsive?", options: ["Usar solo píxeles fijos", "Diseñar Mobile First", "Ocultar el contenido"], answer: 1 }
];
let quizIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function renderQuestion() {
  quizAnswered = false;
  const current = questions[quizIndex];
  document.getElementById("quiz-question").textContent = `${quizIndex + 1}. ${current.question}`;
  const optionsContainer = document.getElementById("quiz-options");
  optionsContainer.innerHTML = "";
  document.getElementById("quiz-feedback").textContent = "";
  document.getElementById("quiz-next").hidden = true;

  current.options.forEach((option, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.innerHTML = option;
    button.addEventListener("click", () => {
      if (quizAnswered) return;
      quizAnswered = true;
      const buttons = [...optionsContainer.children];
      buttons.forEach((buttonItem, buttonIndex) => {
        buttonItem.disabled = true;
        if (buttonIndex === current.answer) buttonItem.classList.add("correct");
      });
      if (index === current.answer) {
        quizScore += 1;
        button.classList.add("correct");
        document.getElementById("quiz-feedback").textContent = "✓ Correcto";
      } else {
        button.classList.add("incorrect");
        document.getElementById("quiz-feedback").textContent = `✕ Incorrecto. La respuesta correcta está marcada.`;
      }
      document.getElementById("quiz-next").hidden = false;
      document.getElementById("quiz-score").textContent = `Puntuación: ${quizScore} de ${questions.length}`;
    });
    optionsContainer.appendChild(button);
  });
}

document.getElementById("quiz-next").addEventListener("click", () => {
  quizIndex += 1;
  if (quizIndex < questions.length) renderQuestion();
  else {
    document.getElementById("quiz-question").textContent = "Cuestionario completado";
    document.getElementById("quiz-options").innerHTML = "";
    document.getElementById("quiz-feedback").textContent = quizScore === questions.length ? "¡Excelente! Has acertado todo." : "Puedes repetir el cuestionario para seguir practicando.";
    document.getElementById("quiz-next").hidden = true;
    document.getElementById("quiz-score").textContent = `Puntuación final: ${quizScore} de ${questions.length}`;
  }
});

// Simulador responsive
const device = document.getElementById("device-preview");
document.querySelectorAll(".device-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".device-button").forEach(item => {
      item.classList.remove("active");
      item.setAttribute("aria-pressed", "false");
    });
    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");
    device.classList.toggle("mobile", button.dataset.view === "mobile");
  });
});

renderSpots();
updateProgress();
renderQuestion();
