// =====================================================
// NETWORK PERFORMANCE METRICS DASHBOARD
// =====================================================

(function () {
    'use strict';

    // Current Language
    const currentLang = document.documentElement.lang || 'vi';

    const I18N = {
        vi: {
            refreshing: 'Đang làm mới...',
            refresh: '🔄 Làm mới',
            enabled: 'Đã bật ✓',
            disabled: 'Đã tắt ✗',
            unknown: 'không xác định'
        },
        en: {
            refreshing: 'Refreshing...',
            refresh: '🔄 Refresh Metrics',
            enabled: 'Enabled ✓',
            disabled: 'Disabled ✗',
            unknown: 'unknown'
        }
    };

    const STRINGS = I18N[currentLang] || I18N.en;

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNetworkTools);
    } else {
        initNetworkTools();
    }

    function initNetworkTools() {
        // Initialize all metrics
        measurePerformanceMetrics();
        inspectHTTPHeaders();
        analyzeProtocol();

        // Add refresh button listener
        const refreshBtn = document.getElementById('refresh-metrics');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', refreshAllMetrics);
        }
    }

    // =====================================================
    // PERFORMANCE METRICS
    // =====================================================
    function measurePerformanceMetrics() {
        try {
            const perfData = performance.getEntriesByType('navigation')[0];

            if (!perfData) {
                console.warn('Performance API not available');
                return;
            }

            // DNS Lookup Time
            const dnsTime = perfData.domainLookupEnd - perfData.domainLookupStart;
            updateMetric('dns-time', dnsTime.toFixed(2), 'ms');

            // TCP Connection Time
            const tcpTime = perfData.connectEnd - perfData.connectStart;
            updateMetric('tcp-time', tcpTime.toFixed(2), 'ms');

            // TLS Handshake Time
            const tlsTime = perfData.secureConnectionStart > 0
                ? (perfData.connectEnd - perfData.secureConnectionStart).toFixed(2)
                : 0;
            updateMetric('tls-time', tlsTime, 'ms');

            // Total Load Time
            const totalTime = perfData.loadEventEnd - perfData.fetchStart;
            updateMetric('total-time', (totalTime / 1000).toFixed(2), 's');

            // Additional metrics
            measureResourceMetrics();

        } catch (error) {
            console.error('Error measuring performance:', error);
        }
    }

    function measureResourceMetrics() {
        try {
            const resources = performance.getEntriesByType('resource');

            // Total resources
            const totalResources = resources.length;

            // Cached resources (transferSize === 0 means from cache)
            const cachedResources = resources.filter(r => r.transferSize === 0).length;

            // Total size
            const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);

            // Update UI if elements exist
            updateElement('total-resources', totalResources);
            updateElement('cached-resources', cachedResources);
            updateElement('total-size', formatBytes(totalSize));
            updateElement('cache-ratio', ((cachedResources / totalResources) * 100).toFixed(1) + '%');

        } catch (error) {
            console.error('Error measuring resources:', error);
        }
    }

    // =====================================================
    // HTTP HEADERS INSPECTOR
    // =====================================================
    function inspectHTTPHeaders() {
        try {
            // Get headers from current page
            fetch(window.location.href, { method: 'HEAD' })
                .then(response => {
                    const headers = {};
                    response.headers.forEach((value, key) => {
                        headers[key] = value;
                    });
                    displayHeaders(headers);
                })
                .catch(error => {
                    console.error('Error fetching headers:', error);
                    displayDefaultHeaders();
                });
        } catch (error) {
            console.error('Error inspecting headers:', error);
            displayDefaultHeaders();
        }
    }

    function displayHeaders(headers) {
        const container = document.getElementById('headers-list');
        if (!container) return;

        container.innerHTML = '';

        // Important headers to display
        const importantHeaders = [
            'content-type',
            'content-encoding',
            'cache-control',
            'server',
            'x-frame-options',
            'strict-transport-security',
            'content-security-policy'
        ];

        importantHeaders.forEach(key => {
            if (headers[key]) {
                addHeaderItem(container, key, headers[key]);
            }
        });

        // If no headers found, show default info
        if (container.children.length === 0) {
            displayDefaultHeaders();
        }
    }

    function displayDefaultHeaders() {
        const container = document.getElementById('headers-list');
        if (!container) return;

        const defaultHeaders = {
            'content-type': 'text/html; charset=utf-8',
            'content-encoding': 'gzip',
            'cache-control': 'public, max-age=3600',
            'server': 'GitHub Pages'
        };

        Object.entries(defaultHeaders).forEach(([key, value]) => {
            addHeaderItem(container, key, value);
        });
    }

    function addHeaderItem(container, key, value) {
        const item = document.createElement('div');
        item.className = 'header-item';
        item.innerHTML = `
            <div class="header-key">${escapeHtml(key)}</div>
            <div class="header-value">${escapeHtml(value)}</div>
        `;
        container.appendChild(item);
    }

    // =====================================================
    // PROTOCOL ANALYZER
    // =====================================================
    function analyzeProtocol() {
        try {
            const perfData = performance.getEntriesByType('navigation')[0];

            if (!perfData) return;

            // Protocol version
            const protocol = perfData.nextHopProtocol || 'http/1.1';
            const protocolName = getProtocolName(protocol);
            updateElement('protocol-version', protocolName);

            // Connection type
            const connectionType = navigator.connection
                ? navigator.connection.effectiveType
                : STRINGS.unknown;
            updateElement('connection-type', connectionType.toUpperCase());

            // Transfer encoding (from headers or default)
            updateElement('transfer-encoding', 'gzip');

            // HTTPS status
            const isSecure = window.location.protocol === 'https:';
            updateElement('https-status', isSecure ? STRINGS.enabled : STRINGS.disabled);

        } catch (error) {
            console.error('Error analyzing protocol:', error);
        }
    }

    function getProtocolName(protocol) {
        const protocolMap = {
            'h2': 'HTTP/2',
            'h3': 'HTTP/3',
            'http/1.1': 'HTTP/1.1',
            'http/1.0': 'HTTP/1.0'
        };
        return protocolMap[protocol] || protocol.toUpperCase();
    }

    // =====================================================
    // UTILITY FUNCTIONS
    // =====================================================
    function updateMetric(id, value, unit) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            if (unit) {
                const unitSpan = element.nextElementSibling;
                if (unitSpan && unitSpan.classList.contains('metric-unit')) {
                    unitSpan.textContent = unit;
                }
            }
        }
    }

    function updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function refreshAllMetrics() {
        // Show loading state
        const btn = document.getElementById('refresh-metrics');
        if (btn) {
            btn.textContent = STRINGS.refreshing;
            btn.disabled = true;
        }

        // Reload metrics
        setTimeout(() => {
            measurePerformanceMetrics();
            inspectHTTPHeaders();
            analyzeProtocol();

            if (btn) {
                btn.textContent = STRINGS.refresh;
                btn.disabled = false;
            }
        }, 500);
    }

    // Initialize tooltips (same as before)
    function initTooltips() {
        const tooltips = document.querySelectorAll('.metric-tooltip');
        tooltips.forEach(tooltip => {
            tooltip.addEventListener('mouseenter', showTooltip);
            tooltip.addEventListener('mouseleave', hideTooltip);
        });
    }

    function showTooltip(event) {
        const content = event.currentTarget.querySelector('.tooltip-content');
        if (content) {
            content.style.visibility = 'visible';
            content.style.opacity = '1';
        }
    }

    function hideTooltip(event) {
        const content = event.currentTarget.querySelector('.tooltip-content');
        if (content) {
            content.style.visibility = 'hidden';
            content.style.opacity = '0';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTooltips);
    } else {
        initTooltips();
    }

    // Export for debugging
    window.NetworkTools = {
        refresh: refreshAllMetrics,
        measurePerformance: measurePerformanceMetrics,
        inspectHeaders: inspectHTTPHeaders,
        analyzeProtocol: analyzeProtocol
    };

})();
