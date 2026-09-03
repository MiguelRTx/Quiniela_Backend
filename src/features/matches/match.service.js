const { Match } = require('../../database/associations');
const { Op } = require('sequelize');
const sportsDbClient = require('../../integrations/theSportsDb.client');

const createMatch = async (matchData) => {
  if (!matchData.external_api_id && matchData.home_team && matchData.away_team && matchData.match_date) {
    console.log(`[Service] Buscando ID en TheSportsDB para: ${matchData.home_team} vs ${matchData.away_team}...`);
    const foundId = await sportsDbClient.searchMatchId(
      matchData.home_team,
      matchData.away_team,
      matchData.match_date
    );
    if (foundId) {
      matchData.external_api_id = foundId;
      console.log(`[Service] ID encontrado y asignado automáticamente: ${foundId}`);
    } else {
      console.warn(`[Service] No se encontró ID en la API para este partido. Se creará sin vinculación.`);
    }
  }

  const newMatch = await Match.create(matchData);
  return newMatch;
};

const getMatches = async (filters = {}) => {
  const whereClause = {};

  if (filters.status) whereClause.status = filters.status;

  if (filters.phase) whereClause.phase = filters.phase;

  if (filters.date) {
    const startDate = new Date(filters.date);
    startDate.setUTCHours(0, 0, 0, 0);
    
    const endDate = new Date(filters.date);
    endDate.setUTCHours(23, 59, 59, 999);
    
    whereClause.match_date = {
      [Op.between]: [startDate, endDate]
    };
  }
  const matches = await Match.findAll({
    where: whereClause,
    order: [['match_date', 'ASC']],
  });

  return matches;
};

const getMatchById = async (matchId) => {
  const match = await Match.findByPk(matchId);
  if (!match) {
    const error = new Error('Partido no encontrado');
    error.statusCode = 404;
    throw error;
  }
  return match;
};
const updateMatch = async (matchId, updateData) => {
  const match = await Match.findByPk(matchId);
  if (!match) {
    const error = new Error('Partido no encontrado');
    error.statusCode = 404;
    throw error;
  }

  delete updateData.home_score;
  delete updateData.away_score;
  delete updateData.status;

  const homeTeam  = updateData.home_team  || match.home_team;
  const awayTeam  = updateData.away_team  || match.away_team;
  const matchDate = updateData.match_date || match.match_date;
  const currentId = updateData.external_api_id !== undefined
    ? updateData.external_api_id
    : match.external_api_id;

  if (!currentId) {
    console.log(`[Service] Buscando ID en TheSportsDB para: ${homeTeam} vs ${awayTeam}...`);
    const foundId = await sportsDbClient.searchMatchId(homeTeam, awayTeam, matchDate);
    if (foundId) {
      updateData.external_api_id = foundId;
      console.log(`[Service] ID encontrado y asignado automáticamente: ${foundId}`);
    }
  }

  await match.update(updateData);
  return match;
};

module.exports = { createMatch, getMatches, getMatchById, updateMatch };