// === Tab Switching Logic ===
function switchTab(tabId, element) {
    document.querySelectorAll('.tab-content').forEach(function(tab) {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.avi-tabs-bar button').forEach(function(btn) {
        btn.classList.remove('active');
    });

    document.getElementById('tab-' + tabId).classList.add('active');
    element.classList.add('active');
}

// === Accordion Logic ===
function toggleAccordion(id) {
    var content = document.getElementById(id);
    var icon = document.getElementById('icon-' + id);
    if (content.classList.contains('expanded')) {
        content.classList.remove('expanded');
        icon.textContent = '+';
    } else {
        document.querySelectorAll('.accordion-content').forEach(function(el) {
            el.classList.remove('expanded');
        });
        document.querySelectorAll('[id^="icon-"]').forEach(function(el) {
            el.textContent = '+';
        });
        content.classList.add('expanded');
        icon.textContent = '−';
    }
}

// === Mobile Nav Toggle ===
document.addEventListener('DOMContentLoaded', function() {
    var toggleBtn = document.getElementById('aviMobileToggle');
    var mobileMenu = document.getElementById('aviMobileMenu');
    if (toggleBtn && mobileMenu) {
        toggleBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
        });
        // Close mobile menu on link click
        mobileMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('open');
            });
        });
    }
});

// === Chart.js Implementations ===
document.addEventListener('DOMContentLoaded', function() {

    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.color = '#64748B';

    // 1. Market Sizing Chart (Bar)
    var ctxSizing = document.getElementById('marketSizingChart');
    if (ctxSizing) {
        new Chart(ctxSizing.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Charter', 'FBOs', 'MROs', 'Jet Card/Frac', 'Terminals'],
                datasets: [{
                    label: 'Est. TAM 2025 (Billions USD)',
                    data: [14.5, 9.2, 8.8, 4.5, 1.5],
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: 'rgba(15, 23, 42, 1)',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        padding: 12,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 13 },
                        callbacks: {
                            label: function(context) {
                                return '$' + context.parsed.y + ' Billion';
                            }
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.5)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // 2. CAGR Chart (Line)
    var ctxCagr = document.getElementById('cagrChart');
    if (ctxCagr) {
        new Chart(ctxCagr.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['2023', '2024', '2025(E)', '2026(E)', '2027(E)'],
                datasets: [{
                    label: 'Flight Ops Growth Index',
                    data: [100, 98, 103, 108, 114],
                    borderColor: 'rgba(217, 119, 6, 1)',
                    backgroundColor: 'rgba(217, 119, 6, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#fff',
                    pointBorderColor: 'rgba(217, 119, 6, 1)',
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        padding: 12
                    }
                },
                scales: {
                    y: { grid: { color: 'rgba(226, 232, 240, 0.5)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    // 3. Scorecard Radar Chart
    var ctxScorecard = document.getElementById('scorecardChart');
    if (ctxScorecard) {
        new Chart(ctxScorecard.getContext('2d'), {
            type: 'radar',
            data: {
                labels: [
                    ['Willingness', 'to Pay'],
                    ['Pain', 'Intensity'],
                    ['Sales Cycle', 'Efficiency'],
                    ['Solution', 'Scalability'],
                    ['Competition', '(Inverted)'],
                    ['Regulatory Risk', '(Inverted)'],
                    ['Brand', 'Prestige']
                ],
                datasets: [{
                    label: 'Opportunity Score',
                    data: [9, 9, 6, 7, 8, 4, 8],
                    backgroundColor: 'rgba(217, 119, 6, 0.2)',
                    borderColor: 'rgba(217, 119, 6, 1)',
                    pointBackgroundColor: 'rgba(15, 23, 42, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(15, 23, 42, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(226, 232, 240, 0.8)' },
                        grid: { color: 'rgba(226, 232, 240, 0.8)' },
                        pointLabels: {
                            font: { size: 12, family: "'Inter', sans-serif", weight: 'bold' },
                            color: '#1E293B'
                        },
                        ticks: {
                            min: 0,
                            max: 10,
                            stepSize: 2,
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        padding: 12,
                        callbacks: {
                            title: function(tooltipItems) {
                                return tooltipItems[0].label.replace(/,/g, ' ');
                            }
                        }
                    }
                }
            }
        });
    }

    // === Active state updating for navbar based on scroll ===
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.avi-nav-links a');

    window.addEventListener('scroll', function() {
        var current = '';
        sections.forEach(function(section) {
            var sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function(link) {
            link.classList.remove('nav-active');
            if (link.getAttribute('href') && link.getAttribute('href').includes(current) && current !== '') {
                if (!link.classList.contains('nav-scorecard')) {
                    link.classList.add('nav-active');
                }
            }
        });
    });
});
