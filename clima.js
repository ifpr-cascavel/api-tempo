const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

// Elementos do Card de Geolocalização
const geoLoading = document.getElementById('geo-loading');
const geoError = document.getElementById('geo-error');
const geoContent = document.getElementById('geo-content');
const btnRefreshGeo = document.getElementById('refresh-geo-btn');

const elGeoCity = document.getElementById('geo-city');
const elGeoDesc = document.getElementById('geo-description');
const elGeoIcon = document.getElementById('geo-icon');
const elGeoTemp = document.getElementById('geo-temp');
const elGeoFeels = document.getElementById('geo-feels');
const elGeoTempMin = document.getElementById('geo-temp-min');
const elGeoTempMax = document.getElementById('geo-temp-max');
const elGeoHumidity = document.getElementById('geo-humidity');
const elGeoWind = document.getElementById('geo-wind');

// Elementos do Card de Busca
const inputCity = document.getElementById('city-input');
const btnSearch = document.getElementById('search-btn');
const searchLoading = document.getElementById('search-loading');
const searchError = document.getElementById('search-error');
const searchCard = document.getElementById('search-card');

const elSearchCity = document.getElementById('search-city');
const elSearchDesc = document.getElementById('search-description');
const elSearchIcon = document.getElementById('search-icon');
const elSearchTemp = document.getElementById('search-temp');
const elSearchFeels = document.getElementById('search-feels');
const elSearchTempMin = document.getElementById('search-temp-min');
const elSearchTempMax = document.getElementById('search-temp-max');
const elSearchHumidity = document.getElementById('search-humidity');
const elSearchWind = document.getElementById('search-wind');

// Eventos
document.addEventListener('DOMContentLoaded', getGeoLocationWeather);
btnRefreshGeo.addEventListener('click', getGeoLocationWeather);

btnSearch.addEventListener('click', () => searchCityWeather(inputCity.value));
inputCity.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchCityWeather(inputCity.value);
});

// Tabela de códigos de tempo da Open-Meteo (WMO Weather interpretation codes)
function parseWmoCode(code) {
  const codes = {
    0: { desc: 'Céu limpo', icon: '☀️' },
    1: { desc: 'Predominantemente limpo', icon: '🌤️' },
    2: { desc: 'Parcialmente nublado', icon: '⛅' },
    3: { desc: 'Nublado', icon: '☁️' },
    45: { desc: 'Névoa', icon: '🌫️' },
    48: { desc: 'Geada forte', icon: '🌫️' },
    51: { desc: 'Garoa leve', icon: '🌧️' },
    53: { desc: 'Garoa moderada', icon: '🌧️' },
    55: { desc: 'Garoa densa', icon: '🌧️' },
    61: { desc: 'Chuva leve', icon: '🌧️' },
    63: { desc: 'Chuva moderada', icon: '🌧️' },
    65: { desc: 'Chuva forte', icon: '🌧️' },
    80: { desc: 'Pancadas de chuva leves', icon: '🌦️' },
    81: { desc: 'Pancadas de chuva moderadas', icon: '🌦️' },
    82: { desc: 'Pancadas de chuva violentas', icon: '⛈️' },
    95: { desc: 'Tempestade', icon: '⚡' },
    96: { desc: 'Tempestade com granizo leve', icon: '⛈️' },
    99: { desc: 'Tempestade com granizo forte', icon: '⛈️' },
  };
  return codes[code] || { desc: 'Tempo variável', icon: '🌡️' };
}

// 1. Clima por Geolocalização
function getGeoLocationWeather() {
  showGeoLoading();

  if (!navigator.geolocation) {
    showGeoError('Geolocalização não é suportada pelo seu navegador.');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        // Obter nome da cidade via Nominatim
        const geoNameRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
        const geoNameData = await geoNameRes.json();
        const city = geoNameData.address.city || geoNameData.address.town || geoNameData.address.village || 'Sua Localização';
        const country = geoNameData.address.country_code ? geoNameData.address.country_code.toUpperCase() : '';

        // Obter clima na Open-Meteo
        const weatherRes = await fetch(`${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
        const weatherData = await weatherRes.json();

        renderGeoData(`${city}, ${country}`, weatherData);
      } catch (err) {
        showGeoError('Não foi possível carregar o clima da sua localização.');
      }
    },
    () => showGeoError('Permissão de localização negada ou indisponível.')
  );
}

function renderGeoData(locationName, data) {
  const current = data.current;
  const daily = data.daily;
  const wmo = parseWmoCode(current.weather_code);

  elGeoCity.textContent = locationName;
  elGeoDesc.textContent = `${wmo.icon} ${wmo.desc}`;
  elGeoIcon.style.display = 'none'; // Usando emoji inline para simplificar

  elGeoTemp.textContent = `${Math.round(current.temperature_2m)}°C`;
  elGeoFeels.textContent = `${Math.round(current.apparent_temperature)}°C`;
  elGeoTempMin.textContent = `${Math.round(daily.temperature_2m_min[0])}°C`;
  elGeoTempMax.textContent = `${Math.round(daily.temperature_2m_max[0])}°C`;
  elGeoHumidity.textContent = `${current.relative_humidity_2m}%`;
  elGeoWind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;

  geoLoading.classList.add('hidden');
  geoError.classList.add('hidden');
  geoContent.classList.remove('hidden');
}

// 2. Busca por Nome de Cidade
async function searchCityWeather(city) {
  const cityName = city.trim();
  if (!cityName) return;

  showSearchLoading();

  try {
    // Busca coordenadas da cidade no serviço Geocoding da Open-Meteo
    const geoRes = await fetch(`${GEOCODING_URL}?name=${encodeURIComponent(cityName)}&count=1&language=pt`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('Cidade não encontrada.');
    }

    const { latitude, longitude, name, country_code } = geoData.results[0];

    // Busca clima na Open-Meteo
    const weatherRes = await fetch(`${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
    const weatherData = await weatherRes.json();

    renderSearchData(`${name}, ${country_code ? country_code.toUpperCase() : ''}`, weatherData);
  } catch (err) {
    showSearchError(err.message);
  }
}

function renderSearchData(locationName, data) {
  const current = data.current;
  const daily = data.daily;
  const wmo = parseWmoCode(current.weather_code);

  elSearchCity.textContent = locationName;
  elSearchDesc.textContent = `${wmo.icon} ${wmo.desc}`;
  elSearchIcon.style.display = 'none';

  elSearchTemp.textContent = `${Math.round(current.temperature_2m)}°C`;
  elSearchFeels.textContent = `${Math.round(current.apparent_temperature)}°C`;
  elSearchTempMin.textContent = `${Math.round(daily.temperature_2m_min[0])}°C`;
  elSearchTempMax.textContent = `${Math.round(daily.temperature_2m_max[0])}°C`;
  elSearchHumidity.textContent = `${current.relative_humidity_2m}%`;
  elSearchWind.textContent = `${Math.round(current.wind_speed_10m)} km/h`;

  searchLoading.classList.add('hidden');
  searchError.classList.add('hidden');
  searchCard.classList.remove('hidden');
}

// Funções Auxiliares
function showGeoLoading() {
  geoLoading.classList.remove('hidden');
  geoContent.classList.add('hidden');
  geoError.classList.add('hidden');
}

function showGeoError(msg) {
  geoLoading.classList.add('hidden');
  geoContent.classList.add('hidden');
  geoError.textContent = msg;
  geoError.classList.remove('hidden');
}

function showSearchLoading() {
  searchLoading.classList.remove('hidden');
  searchCard.classList.add('hidden');
  searchError.classList.add('hidden');
}

function showSearchError(msg) {
  searchLoading.classList.add('hidden');
  searchCard.classList.add('hidden');
  searchError.textContent = msg;
  searchError.classList.remove('hidden');
}// ==============================================================================
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
