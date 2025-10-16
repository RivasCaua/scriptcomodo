<script>
document.addEventListener('DOMContentLoaded', function () {

    // --- Função que busca o valor de qualquer parâmetro da URL ---
    function getUrlParameter(name) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[\\?&]' + name + '(=([^&#]*)|&|#|$)');
        var results = regex.exec(location.search);
        var value = '';
        if (results && results[2]) {
            value = decodeURIComponent(results[2].replace(/\+/g, ' '));
        }
        return value;
    }

    // --- Lista de parâmetros UTM e outros ---
    var paramNames = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'gclid',
        'fbclid'
    ];

    var capturedData = {};

    // --- Captura os parâmetros da URL ---
    paramNames.forEach(function (param) {
        capturedData[param] = getUrlParameter(param);
    });

    // --- Campos adicionais ---
    capturedData['pagina_captura'] = window.location.pathname;

    // Captura apenas o domínio do site (ex: https://seudominio.com.br)
    capturedData['utm_referrer'] = window.location.origin;

    // --- Função para preencher campos de formulários ---
    window.fillFieldsInFormByElement = function (formElement) {
        for (var key in capturedData) {
            if (capturedData.hasOwnProperty(key)) {
                var inputField = formElement.querySelector('[name="form_fields[' + key + ']"]') ||
                                 formElement.querySelector('#form-field-' + key);

                if (inputField) {
                    inputField.value = capturedData[key];
                    console.log('Preenchido: ' + key + ' com valor: ' + capturedData[key]);
                } else {
                    console.warn('Campo não encontrado: ' + key);
                }
            }
        }
    };

    // --- Preenche formulários já existentes ---
    var initialForms = document.querySelectorAll('.elementor-form');
    initialForms.forEach(function (form) {
        window.fillFieldsInFormByElement(form);
    });

    // --- Observa formulários carregados dinamicamente (como popups) ---
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (node.nodeType === 1 && node.matches('.elementor-form')) {
                    window.fillFieldsInFormByElement(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

});
</script>
