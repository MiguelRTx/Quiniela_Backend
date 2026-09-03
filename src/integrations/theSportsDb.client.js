const config = require('../config/env.config');

const FINISHED_STATUSES = new Set([
  'FT',
  'Match Finished',
  'AET',
  'After Extra Time',
  'AP',
  'After Penalties',
  'AOT',
]);


const IN_PROGRESS_STATUSES = new Set([
  '1H',  
  '2H',   
  'ET',   
  'P',    
  'LIVE',
]);



class TheSportsDbClient {
  constructor() {
    this.apiKey = config.sportsDb.apiKey;
    this.baseUrl = `https://www.thesportsdb.com/api/v1/json/${this.apiKey}`;
  }

  async getMatchDetails(externalApiId) {
    try {
      const response = await fetch(`${this.baseUrl}/lookupevent.php?id=${externalApiId}`);

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

      const data = await response.json();

      if (!data.events || data.events.length === 0) {
        console.warn(`[Integrations] Sin eventos para id=${externalApiId}. Respuesta: ${JSON.stringify(data)}`);
        return null;
      }

      const event = data.events[0];

      const parseScore = (val) => {
        if (val === null || val === undefined || val === 'null' || val === '') return null;
        const n = parseInt(val, 10);
        return isNaN(n) ? null : n;
      };

      const result = {
        home_score: parseScore(event.intHomeScore),
        away_score: parseScore(event.intAwayScore),
        status: event.strStatus,
        isFinished: FINISHED_STATUSES.has(event.strStatus),
        isInProgress: IN_PROGRESS_STATUSES.has(event.strStatus),
      };

      console.log(`[Integrations] id=${externalApiId} | "${event.strEvent}" | status="${event.strStatus}" | score=${result.home_score}-${result.away_score} | finished=${result.isFinished}`);

      return result;
    } catch (error) {
      console.error(`[Integrations] Error en getMatchDetails(${externalApiId}): ${error.message}`);
      return null;
    }
  }

  async searchMatchId(homeTeam, awayTeam, matchDate) {
    const dateStr = new Date(matchDate).toISOString().split('T')[0];

    const queries = [
      `${homeTeam} vs ${awayTeam}`,
      `${awayTeam} vs ${homeTeam}`,
    ];

    const matchDay = new Date(dateStr);
    const dayBefore = new Date(matchDay); dayBefore.setDate(dayBefore.getDate() - 1);
    const dayAfter  = new Date(matchDay); dayAfter.setDate(dayAfter.getDate() + 1);

    for (const query of queries) {
      try {
        console.log(`[Integrations] Buscando: "${query}" (${dateStr})`);
        const response = await fetch(`${this.baseUrl}/searchevents.php?e=${encodeURIComponent(query)}`);

        if (!response.ok) continue;

        const data = await response.json();
        const events = data.event;

        if (!events || events.length === 0) continue;

        const found = events.find((e) => {
          if (!e.dateEvent) return false;
          const eventDay = new Date(e.dateEvent);
          return eventDay >= dayBefore && eventDay <= dayAfter;
        });

        if (found) {
          console.log(`[Integrations]Encontrado: "${found.strEvent}" (${found.dateEvent}) → id=${found.idEvent}`);
          return found.idEvent;
        }
      } catch (err) {
        console.error(`[Integrations] Error buscando "${query}": ${err.message}`);
      }
    }

    console.warn(`[Integrations]No encontrado: "${homeTeam} vs ${awayTeam}" (${dateStr})`);
    return null;
  }
}

module.exports = new TheSportsDbClient();