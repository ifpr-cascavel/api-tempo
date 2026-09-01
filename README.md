# 🌤️ Previsão do Tempo — Consulta em Tempo Real

Uma aplicação web moderna, responsiva e leve para consulta de condições meteorológicas em tempo real por geolocalização automática ou busca por qualquer cidade do mundo, desenvolvida com HTML, CSS e JavaScript (Vanilla JS).

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Open-Meteo](https://img.shields.io/badge/API-Open--Meteo-007ACC?style=for-the-badge)

---

## 🚀 Funcionalidades

- **📍 Geolocalização Automática:** Identifica a localização atual do dispositivo ao abrir a página e exibe instantaneamente o clima local.
- **🔄 Atualização Rápida:** Botão para recarregar a localização atual a qualquer momento.
- **🔍 Busca por Cidade:** Pesquisa rápida das condições climáticas de qualquer município ou metrópole do mundo.
- **⚡ Zero Configuração:** Funciona imediatamente após o download, sem necessidade de cadastro ou chaves de API (`API Keys`).
- **🌡️ Dados Meteorológicos Completos:**
  - Temperatura atual e sensação térmica.
  - Temperatura máxima e mínima do dia.
  - Umidade relativa do ar.
  - Velocidade do vento (convertida para km/h).
  - Status do tempo traduzido (baseado no código de interpretação WMO).
- **📱 Design Responsivo & Dark Mode:** Layout moderno adaptado para dispositivos móveis, tablets e computadores.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estruturação semântica.
- **CSS3:** Estilização com Flexbox, CSS Grid, gradientes e variáveis CSS.
- **JavaScript (ES6+):** Consumo assíncrono de APIs via `fetch`/`async-await`, manipulação da DOM e API de Geolocalização do navegador (`navigator.geolocation`).
- **[Open-Meteo API](https://open-meteo.com/):** API pública gratuita de dados meteorológicos (sem chave de acesso).
- **[Nominatim OpenStreetMap](https://nominatim.openstreetmap.org/):** Serviço de geocodificação reversa para converter coordenadas GPS em nomes de cidades.

---

## 📁 Estrutura do Projeto

```text
consulta-clima/
├── index.html      # Estrutura e elementos da página
├── style.css       # Estilização visual e responsividade
├── script.js       # Lógica de geolocalização, busca e requisições HTTP
└── README.md       # Documentação do projeto
