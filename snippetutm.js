<script>
document.addEventListener('DOMContentLoaded', function () {

    // Função que busca o valor de qualquer parâmetro da URL de forma segura
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

    // Lista de todos os parâmetros que queremos capturar da URL
    var paramNames = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'gclid',
        'fbclid',
        'referrer'
    ];

    var capturedData = {};

    // Captura e traduz os parâmetros da URL
    paramNames.forEach(function (param) {
        var rawValue = getUrlParameter(param);
        
        // Lógica para traduzir o utm_medium do Google Ads para algo legível
        if (param === 'utm_medium' && getUrlParameter('utm_source') === 'google_ads') {
            switch (rawValue) {
                case 'g':
                    capturedData[param] = 'Pesquisa';
                    break;
                case 's':
                    capturedData[param] = 'Parceiros de Pesquisa';
                    break;
                case 'd':
                    capturedData[param] = 'Display';
                    break;
                case 'ytv':
                    capturedData[param] = 'YouTube';
                    break;
                case 'vp':
                    capturedData[param] = 'Parceiros de Vídeo';
                    break;
                case 'gtv':
                    capturedData[param] = 'Google TV';
                    break;
                case 'x':
                    capturedData[param] = 'Performance Max';
                    break;
                case 'e':
                    capturedData[param] = 'Apps de Engajamento';
                    break;
                default:
                    capturedData[param] = rawValue;
                    break;
            }
        } else {
            capturedData[param] = rawValue;
        }
    });

    // Captura campos adicionais
    capturedData['pagina_captura'] = window.location.pathname;
    capturedData['referrer_url'] = window.location.href; // <-- LINHA CORRIGIDA

    // Função para preencher os campos do formulário com os dados capturados
    window.fillFieldsInFormByElement = function (formElement) {
        // Itera sobre todos os dados capturados e preenche os campos correspondentes
        for (var key in capturedData) {
            if (capturedData.hasOwnProperty(key)) {
                // Tenta encontrar o campo pelo 'name' ou 'id'
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

    // Preenche os formulários que já estão visíveis ao carregar a página
    var initialForms = document.querySelectorAll('.elementor-form');
    initialForms.forEach(function (form) {
        window.fillFieldsInFormByElement(form);
    });

    // Observa se novos formulários são inseridos dinamicamente (como em popups)
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
