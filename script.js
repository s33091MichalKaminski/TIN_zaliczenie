const services = document.querySelectorAll('.service');
const summaryList = document.getElementById('summaryList');

const totalPrice = document.getElementById('totalPrice');
const netPrice = document.getElementById('netPrice');
const vatPrice = document.getElementById('vatPrice');

const clearBtn = document.getElementById('clearBtn');
const paintState = document.getElementById('paintState');
const vehicleType = document.getElementById('vehicleType');

let selectedServices = [];

/* ====== KLIK W KAFELKI ====== */
services.forEach(function (service) {
  service.addEventListener('click', function () {

    /* --- BLOKADA: tylko jedna korekta lakieru naraz --- */
    // działa jeśli korekty mają klasę: correction
    if (service.classList.contains('correction')) {
      selectedServices.forEach(function (item) {
        if (item.classList.contains('correction')) {
          item.classList.remove('active');
        }
      });

      selectedServices = selectedServices.filter(function (item) {
        return !item.classList.contains('correction');
      });
    }

    /* --- BLOKADA: PPF Full Front vs PPF Full Body --- */
    // działa jeśli:
    // Full Front ma klasę: ppf-front
    // Full Body ma klasę: ppf-body
    if (service.classList.contains('ppf-front')) {
      // klikam front -> usuń full body (jeśli był)
      selectedServices.forEach(function (item) {
        if (item.classList.contains('ppf-body')) {
          item.classList.remove('active');
        }
      });

      selectedServices = selectedServices.filter(function (item) {
        return !item.classList.contains('ppf-body');
      });
    }

    if (service.classList.contains('ppf-body')) {
      // klikam body -> usuń full front (jeśli był)
      selectedServices.forEach(function (item) {
        if (item.classList.contains('ppf-front')) {
          item.classList.remove('active');
        }
      });

      selectedServices = selectedServices.filter(function (item) {
        return !item.classList.contains('ppf-front');
      });
    }

    /* --- dodaj/usuń usługę --- */
    if (selectedServices.includes(service)) {
      selectedServices = selectedServices.filter(function (item) {
        return item !== service;
      });
      service.classList.remove('active');
    } else {
      selectedServices.push(service);
      service.classList.add('active');
    }

    updateSummary();
  });
});

/* ====== ZMIANA SELECTÓW ====== */
if (vehicleType) {
  vehicleType.addEventListener('change', function () {
    updateSummary();
  });
}

if (paintState) {
  paintState.addEventListener('change', function () {
    updateSummary();
  });
}

/* ====== WYCZYŚĆ ====== */
if (clearBtn) {
  clearBtn.addEventListener('click', function () {
    selectedServices = [];
    services.forEach(function (s) {
      s.classList.remove('active');
    });
    updateSummary();
  });
}

/* ====== LICZENIE I PODSUMOWANIE ====== */
function updateSummary() {
  if (!summaryList) return;

  summaryList.innerHTML = '';
  let totalBrutto = 0;

  if (selectedServices.length === 0) {
    summaryList.innerHTML = '<p class="empty">Brak wybranych usług</p>';
  }

  selectedServices.forEach(function (service) {
    let name = service.getAttribute('data-name');
    let price = Number(service.getAttribute('data-price'));

    // MNOŻNIK: typ pojazdu
    if (vehicleType) {
      if (vehicleType.value === 'sedan') {
        price = price * 1.10;
      } else if (vehicleType.value === 'suv') {
        price = price * 1.25;
      } else if (vehicleType.value === 'van') {
        price = price * 1.35;
      }
      // hatchback = bez zmian
    }

    // MNOŻNIK: stan lakieru (tylko .paint)
    if (service.classList.contains('paint') && paintState) {
      if (paintState.value === 'bad') {
        price = price * 1.20;
      } else if (paintState.value === 'premium') {
        price = price * 1.35;
      }
      // standard = bez zmian
    }

    totalBrutto = totalBrutto + price;

    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = '<span>' + name + '</span><span>' + price.toFixed(2) + ' zł</span>';
    summaryList.appendChild(row);
  });

  // BRUTTO/NETTO/VAT
  const brutto = totalBrutto;
  const netto = brutto / 1.23;
  const vat = brutto - netto;

  if (netPrice) netPrice.textContent = netto.toFixed(2) + ' zł';
  if (vatPrice) vatPrice.textContent = vat.toFixed(2) + ' zł';
  if (totalPrice) totalPrice.textContent = brutto.toFixed(2) + ' zł';
}
