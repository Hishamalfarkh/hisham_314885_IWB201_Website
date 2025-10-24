// ===== Toggle Details Function =====
function toggleDetails(button) {
    const row = button.closest('tr');
    const detailsRow = row.nextElementSibling;

    if (detailsRow && detailsRow.classList.contains('details-row')) {
        if (detailsRow.style.display === 'none' || detailsRow.style.display === '') {
            $(detailsRow).fadeIn(300);
            button.textContent = '▲ Exit';
        } else {
            $(detailsRow).fadeOut(300);
            button.textContent = '▼ Show';
        }
    }
}

// ===== Validation Functions =====
function validateAppName(name) {
    const pattern = /^[A-Za-z]+$/;
    return pattern.test(name);
}

function validateCompanyName(name) {
    const pattern = /^[A-Za-z0-9]+$/;
    return pattern.test(name);
}

function validateURL(url) {
    try {
        new URL(url);
        return url.startsWith('http://') || url.startsWith('https://');
    } catch (e) {
        return false;
    }
}

function validateDescription(text) {
    return text.trim().length > 0;
}

// ===== Form Validation =====
function validateForm() {
    let isValid = true;

    const appName = document.getElementById('appName');
    const appNameError = document.getElementById('appNameError');
    if (!validateAppName(appName.value)) {
        appName.classList.add('invalid');
        appNameError.style.display = 'block';
        appNameError.textContent = 'اسم التطبيق يجب أن يحتوي على أحرف إنجليزية فقط بدون فراغات أو أرقام';
        isValid = false;
    } else {
        appName.classList.remove('invalid');
        appNameError.style.display = 'none';
    }

    const companyName = document.getElementById('companyName');
    const companyNameError = document.getElementById('companyNameError');
    if (!validateCompanyName(companyName.value)) {
        companyName.classList.add('invalid');
        companyNameError.style.display = 'block';
        companyNameError.textContent = 'اسم الشركة يجب أن يحتوي على أحرف إنجليزية وأرقام فقط';
        isValid = false;
    } else {
        companyName.classList.remove('invalid');
        companyNameError.style.display = 'none';
    }

    const website = document.getElementById('website');
    const websiteError = document.getElementById('websiteError');
    if (!validateURL(website.value)) {
        website.classList.add('invalid');
        websiteError.style.display = 'block';
        websiteError.textContent = 'يرجى إدخال رابط صحيح يبدأ بـ http:// أو https://';
        isValid = false;
    } else {
        website.classList.remove('invalid');
        websiteError.style.display = 'none';
    }

    const category = document.getElementById('category');
    const categoryError = document.getElementById('categoryError');
    if (category.value === '') {
        category.classList.add('invalid');
        categoryError.style.display = 'block';
        categoryError.textContent = 'يرجى اختيار مجال الاستخدام';
        isValid = false;
    } else {
        category.classList.remove('invalid');
        categoryError.style.display = 'none';
    }

    const description = document.getElementById('description');
    const descriptionError = document.getElementById('descriptionError');
    if (!validateDescription(description.value)) {
        description.classList.add('invalid');
        descriptionError.style.display = 'block';
        descriptionError.textContent = 'يرجى إدخال شرح مختصر عن التطبيق';
        isValid = false;
    } else {
        description.classList.remove('invalid');
        descriptionError.style.display = 'none';
    }

    const isFree = document.querySelector('input[name="isFree"]:checked');
    const isFreeError = document.getElementById('isFreeError');
    if (!isFree) {
        isFreeError.style.display = 'block';
        isFreeError.textContent = 'يرجى تحديد ما إذا كان التطبيق مجاني أم لا';
        isValid = false;
    } else {
        isFreeError.style.display = 'none';
    }

    if (isValid) {
        const appData = {
            name: appName.value,
            company: companyName.value,
            website: website.value,
            category: category.value,
            description: description.value,
            isFree: isFree.value
        };

        let apps = JSON.parse(localStorage.getItem('apps')) || [];
        apps.push(appData);
        localStorage.setItem('apps', JSON.stringify(apps));

        window.location.href = 'apps.html';
        return false;
    }

    return false;
}

// ===== Load Apps from localStorage =====
function loadApps() {
    const apps = JSON.parse(localStorage.getItem('apps')) || [];
    const tableBody = document.getElementById('appsTableBody');

    if (apps.length > 0 && tableBody) {
        apps.forEach((app, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${app.name}</td>
                <td>${app.company}</td>
                <td>${app.category}</td>
                <td>${app.isFree === 'yes' ? 'نعم' : 'لا'}</td>
                <td><button class="toggle-btn" onclick="toggleDetails(this)">▼ Show </button></td>
            `;
            tableBody.appendChild(row);

            const logoURL = `https://via.placeholder.com/150/667eea/ffffff?text=${encodeURIComponent(app.name)}`;

            const detailsRow = document.createElement('tr');
            detailsRow.className = 'details-row';
            detailsRow.style.display = 'none';
            detailsRow.innerHTML = `
                <td colspan="5">
                    <div class="details-content">
                        <h3>التفاصيل الإضافية</h3>
                        <p><strong>عنوان الموقع الإلكتروني:</strong> <a href="${app.website}" target="_blank" class="link">${app.website}</a></p>
                        <p><strong>شرح مختصر:</strong> ${app.description}</p>
                        <img src="${logoURL}" alt="${app.name} Logo">
                    </div>
                </td>
            `;
            tableBody.appendChild(detailsRow);
        });
    }
}

// ===== jQuery Ready Function =====
$(document).ready(function () {
    if (window.location.pathname.includes('apps.html')) {
        loadApps();
    }

    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        const target = $(this.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 20
            }, 500);
        }
    });

    $('input, select, textarea').focus(function () {
        $(this).animate({ borderWidth: '3px' }, 200);
    }).blur(function () {
        $(this).animate({ borderWidth: '2px' }, 200);
    });
});
