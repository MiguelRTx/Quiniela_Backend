const { processMatches } = require('../../cron/syncMatches.cron');
const { Match } = require('../../database/associations');
const { Op } = require('sequelize');
const sportsDbClient = require('../../integrations/theSportsDb.client');


const triggerSync = async (req, res, next) => {
  try {
    console.log(`[Admin] Sincronización manual iniciada por: ${req.user.email}`);
    await processMatches();
    res.status(200).json({
      status: 'success',
      message: 'Sincronización de resultados completada exitosamente.',
    });
  } catch (error) {
    next(error);
  }
};


const linkMatches = async (req, res, next) => {
  try {
    console.log(`[Admin] Auto-vinculación iniciada por: ${req.user.email}`);

    const unlinked = await Match.findAll({
      where: {
        status: { [Op.ne]: 'FINISHED' },
        external_api_id: { [Op.is]: null },
      },
    });

    let linked = 0;
    let notFound = 0;

    for (const match of unlinked) {
      const foundId = await sportsDbClient.searchMatchId(
        match.home_team,
        match.away_team,
        match.match_date
      );
      if (foundId) {
        await match.update({ external_api_id: foundId });
        linked++;
      } else {
        notFound++;
      }
    }

    res.status(200).json({
      status: 'success',
      message: `Auto-vinculación completada. Vinculados: ${linked}, No encontrados: ${notFound}, Ya tenían ID: ${(await Match.count()) - unlinked.length}.`,
      linked,
      notFound,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { triggerSync, linkMatches };
