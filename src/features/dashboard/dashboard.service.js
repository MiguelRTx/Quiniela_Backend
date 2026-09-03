const { Op } = require('sequelize');
const { Match, Prediction, GroupMember, Group } = require('../../database/associations');

const getDashboardSummary = async (userId) => {
  
  const totalGroups = await GroupMember.count({ 
    where: { user_id: userId } 
  });

  
  const globalPoints = (await Prediction.sum('points_earned', { 
    where: { user_id: userId } 
  })) || 0;

  
  const userPredictions = await Prediction.findAll({
    where: { user_id: userId },
    attributes: ['match_id']
  });
  const predictedMatchIds = userPredictions.map(p => p.match_id);

  
  const pendingWhere = {
    status: 'SCHEDULED',
    match_date: { [Op.gt]: new Date() },
  };
  
  if (predictedMatchIds.length > 0) {
    pendingWhere.id = { [Op.notIn]: predictedMatchIds };
  }

  const pendingMatches = await Match.findAll({
    where: pendingWhere,
    order: [['match_date', 'ASC']],
    limit: 5,
    attributes: ['id', 'home_team', 'away_team', 'match_date', 'city', 'stadium'],
  });

  
  const memberships = await GroupMember.findAll({
    where: { user_id: userId },
    include: [{ model: Group, as: 'group', attributes: ['id', 'name'] }],
  });

  const groupPositions = await Promise.all(
    memberships
      .filter(m => m.group !== null) 
      .map(async (membership) => {
        const higherRankedCount = await GroupMember.count({
          where: {
            group_id: membership.group_id,
            total_points: { [Op.gt]: membership.total_points },
          },
        });

        return {
          group_id: membership.group_id,
          group_name: membership.group.name,
          my_points: membership.total_points,
          position: higherRankedCount + 1,
        };
      })
  );

  return {
    total_groups: totalGroups,
    global_points: globalPoints,
    pending_matches: pendingMatches,
    group_positions: groupPositions,
  };
};

module.exports = { getDashboardSummary };