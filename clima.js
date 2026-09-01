// ==============================================================================
// 1. SELEÇÃO DE ELEMENTOS DO DOM
// ==============================================================================
const formBusca = document.querySelector('#form-busca');
const inputCidade = document.querySelector('#input-cidade');
const btnBuscar = document.querySelector('#btn-buscar');
const cardClima = document.querySelector('#card-clima');
const anuncioA11y = document.querySelector('#anuncio-a11y');

// ==============================================================================
// 2. FUNÇÃO AUXILIAR DE ACESSIBILIDADE (A11Y)
// Injeta mensagens em texto na div 'aria-live' para leitura audível em leitores de tela.
// ==============================================================================
function anunciarLeitorDeTela(mensagem) {
  anuncioA11y.textContent = '';
  setTimeout(() => {
    anuncioA11y.textContent = mensagem;
  }, 100);
}

// Map de códigos climáticos da API Open-Meteo para descrições em português
function traduzirCodigoClima(code) {
  const codigos = {
    0: 'Céu limpo ☀️',
    1: 'Predominantemente limpo 🌤️',
    2: 'Parcialmente nublado ⛅',
    3: 'Encoberto ☁️',
    45: 'Nevoeiro 🌫️',
    51: 'Garoa leve 🌧️',
    61: 'Chuva leve 🌧️',
    63: 'Chuva moderada 🌧️',
    65: 'Chuva forte 🌧️',
    80: 'Pancadas de chuva 🌦️',
    95: 'Temporal com trovoadas 🌩️'
  };
  return codigos[code] || 'Condição variável 🌤️';
}

// ==============================================================================
// 3. CONSUMO DE API ASSÍNCRONA (async/await + fetch)
// Utiliza a API gratuita Open-Meteo (não requer chave de API)
// ==============================================================================

/**
 * Busca as coordenadas geográficas (Latitude e Longitude) da cidade digitada
 */
async function buscarCoordenadas(cidade) {
  const urlGeocoding = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt`;
  
  // Requisição HTTP assíncrona
  const resposta = await fetch(urlGeocoding);
  
  if (!resposta.ok) {
    throw new Error('Falha ao conectar com o serviço de geolocalização.');
  }

  const dados = await resposta.json();

  // Se a API retornar um array vazio, a cidade não foi encontrada
  if (!dados.results || dados.results.length === 0) {
    throw new Error(`A cidade "${cidade}" não foi encontrada. Verifique a grafia.`);
  }

  return dados.results[0]; // Retorna latitude, longitude e nome oficial
}

/**
 * Busca o clima atual com base nas coordenadas obtidas
 */
async function buscarClimaPorCoordenadas(lat, lon) {
  const urlWeather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  
  const resposta = await fetch(urlWeather);

  if (!resposta.ok) {
    throw new Error('Falha ao buscar os dados meteorológicos.');
  }

  const dados = await resposta.json();
  return dados.current_weather; // Retorna temperatura, velocidade do vento e código do clima
}

// ==============================================================================
// 4. MANIPULAÇÃO DO DOM E FLUXO PRINCIPAL
// ==============================================================================
async function manipularBuscaClima(evento) {
  // Impede o recarregamento padrão da página ao enviar o formulário
  evento.preventDefault();

  const cidade = inputCidade.value.trim();

  if (cidade === '') {
    anunciarLeitorDeTela('Erro: Por favor, digite o nome de uma cidade.');
    inputCidade.focus();
    return;
  }

  // Desabilita o botão temporariamente durante o carregamento
  btnBuscar.disabled = true;
  btnBuscar.textContent = 'Buscando...';
  anunciarLeitorDeTela(`Buscando dados de clima para ${cidade}...`);

  try {
    // Passo A: Busca Coordenadas
    const local = await buscarCoordenadas(cidade);

    // Passo B: Busca Clima Atual usando as coordenadas
    const clima = await buscarClimaPorCoordenadas(local.latitude, local.longitude);

    // Passo C: Formata as informações
    const descricaoClima = traduzirCodigoClima(clima.weathercode);
    const tempFormatada = Math.round(clima.temperature);

    // Passo D: Injeta o HTML com as respostas da API no DOM
    cardClima.innerHTML = `
      <h2>${local.name}, ${local.country || ''}</h2>
      <p class="descricao-clima">${descricaoClima}</p>
      <p class="temperatura">${tempFormatada}°C</p>
      <div class="detalhes-clima">
        <span>💨 Vento: <strong>${clima.windspeed} km/h</strong></span>
      </div>
    `;

    // Exibe o card no DOM removendo a classe 'oculta'
    cardClima.classList.remove('oculta');

    // [A11Y] GERENCIAMENTO DE FOCO E ANÚNCIO AUDÍVEL:
    // Move o foco para o card contendo o resultado e anuncia para o leitor de tela
    cardClima.focus();
    anunciarLeitorDeTela(`Clima em ${local.name}: ${tempFormatada} graus Celsius, ${descricaoClima}. Vento a ${clima.windspeed} quilômetros por hora.`);

  } catch (erro) {
    // Tratamento e exibição de erros
    cardClima.innerHTML = `<p class="erro-mensagem">⚠️ ${erro.message}</p>`;
    cardClima.classList.remove('oculta');
    anunciarLeitorDeTela(`Erro ao buscar clima: ${erro.message}`);
  } finally {
    // Restaura o botão de busca independente de sucesso ou falha
    btnBuscar.disabled = false;
    btnBuscar.textContent = 'Buscar Clima';
  }
}

// ==============================================================================
// 5. ESCUTADORES DE EVENTOS
// ==============================================================================
formBusca.addEventListener('submit', manipularBuscaClima);
