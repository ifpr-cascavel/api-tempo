# 🌤️ Previsão do Tempo — Consulta de Clima em Tempo Real

Uma aplicação web moderna, responsiva e leve para consulta de condições meteorológicas em tempo real de qualquer cidade do mundo, desenvolvida com HTML, CSS e JavaScript (Vanilla JS).

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![OpenWeather](https://img.shields.io/badge/API-OpenWeatherMap-orange?style=for-the-badge)

---

## 🚀 Funcionalidades

- **🔍 Busca por Cidade:** Pesquisa rápida do clima de qualquer localidade no mundo.
- **📍 Geolocalização:** Detecção automática do clima da sua localização atual com um único clique.
- **🌡️ Dados Meteorológicos Completos:**
  - Temperatura atual, sensação térmica, máxima e mínima.
  - Umidade relativa do ar e velocidade do vento.
  - Condição do tempo (ensolarado, nublado, chuva, etc.) com ícone ilustrativo.
- **🌆 Destaques de Capitais:** Cards com acesso rápido às condições climáticas de grandes metrópoles.
- **📱 Interface Responsiva:** Design otimizado para dispositivos móveis, tablets e computadores.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estruturação semântica da página.
- **CSS3:** Estilização moderna com Flexbox, CSS Grid, variáveis CSS e efeitos de *Glassmorphism*.
- **JavaScript (ES6+):** Consumo de APIs assíncronas via `fetch`/`async-await`, manipulação da DOM e Geolocation API do navegador.
- **[OpenWeatherMap API](https://openweathermap.org/api):** Serviço para obtenção de dados de clima em tempo real.

---

## 📁 Estrutura do Projeto

```text
consulta-clima/
├── index.html      # Estrutura e marcação da página
├── clima.css       # Estilização visual e responsividade
├── clima.js       # Lógica de integração com a API e manipulação de tela
└── README.md       # Documentação do projeto
