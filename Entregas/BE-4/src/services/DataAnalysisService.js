async function analyzeUserData(Model, tableName) {
    try {
        const demographics = await Model.findAll({
            attributes: [
                [Model.sequelize.fn('COUNT', Model.sequelize.col('id')), 'total'],
                [Model.sequelize.fn('SUM', Model.sequelize.literal("CASE WHEN ethnicity = 'branco' THEN 1 ELSE 0 END")), 'branco_count'],
                [Model.sequelize.fn('SUM', Model.sequelize.literal("CASE WHEN ethnicity = 'preto' THEN 1 ELSE 0 END")), 'preto_count'],
                [Model.sequelize.fn('SUM', Model.sequelize.literal("CASE WHEN ethnicity = 'pardo' THEN 1 ELSE 0 END")), 'pardo_count'],
                [Model.sequelize.fn('SUM', Model.sequelize.literal("CASE WHEN ethnicity = 'hispânico' THEN 1 ELSE 0 END")), 'hispânico_count'],
                [Model.sequelize.fn('SUM', Model.sequelize.literal("CASE WHEN ethnicity = 'asiático' THEN 1 ELSE 0 END")), 'asiático_count'],
                [Model.sequelize.fn('SUM', Model.sequelize.literal("CASE WHEN ethnicity = 'indígena' THEN 1 ELSE 0 END")), 'indígena_count'],
                [Model.sequelize.fn('SUM', Model.sequelize.literal("CASE WHEN gender = 'masculino' THEN 1 ELSE 0 END")), 'masculino_count'],
                [Model.sequelize.fn('SUM', Model.sequelize.literal("CASE WHEN gender = 'feminino' THEN 1 ELSE 0 END")), 'feminino_count'],
                [Model.sequelize.fn('SUM', Model.sequelize.literal("CASE WHEN gender = 'transgênero' THEN 1 ELSE 0 END")), 'transgênero_count'],
                [Model.sequelize.fn('SUM', Model.sequelize.literal("CASE WHEN gender = 'não_binário' THEN 1 ELSE 0 END")), 'não_binário_count'],
                [Model.sequelize.fn('SUM', Model.sequelize.literal("CASE WHEN sexual_orientation = 'heterosexual' THEN 1 ELSE 0 END")), 'heterosexual_count'],
                [Model.sequelize.fn('SUM', Model.sequelize.literal("CASE WHEN sexual_orientation = 'homosexual' THEN 1 ELSE 0 END")), 'homosexual_count'],
                [Model.sequelize.fn('SUM', Model.sequelize.literal("CASE WHEN sexual_orientation = 'bisexual' THEN 1 ELSE 0 END")), 'bisexual_count'],
                [Model.sequelize.fn('SUM', Model.sequelize.literal("CASE WHEN sexual_orientation = 'transsexual' THEN 1 ELSE 0 END")), 'transsexual_count'],
                [Model.sequelize.fn('AVG', Model.sequelize.col('pcd')), 'pcd_percentage']
            ],
            where: {},
            tableName
        });

        if (demographics.length > 0) {
            const totalEntries = demographics[0].dataValues.total;
            const diversityPercentages = {
                ethnicity: {
                    branco: Math.round((demographics[0].dataValues.branco_count / totalEntries) * 100),
                    preto: Math.round((demographics[0].dataValues.preto_count / totalEntries) * 100),
                    pardo: Math.round((demographics[0].dataValues.pardo_count / totalEntries) * 100),
                    hispânico: Math.round((demographics[0].dataValues.hispânico_count / totalEntries) * 100),
                    asiático: Math.round((demographics[0].dataValues.asiático_count / totalEntries) * 100),
                    indígena: Math.round((demographics[0].dataValues.indígena_count / totalEntries) * 100)
                },
                gender: {
                    masculino: Math.round((demographics[0].dataValues.masculino_count / totalEntries) * 100),
                    feminino: Math.round((demographics[0].dataValues.feminino_count / totalEntries) * 100),
                    transgênero: Math.round((demographics[0].dataValues.transgênero_count / totalEntries) * 100),
                    não_binário: Math.round((demographics[0].dataValues.não_binário_count / totalEntries) * 100)
                },
                sexualOrientation: {
                    heterosexual: Math.round((demographics[0].dataValues.heterosexual_count / totalEntries) * 100),
                    homosexual: Math.round((demographics[0].dataValues.homosexual_count / totalEntries) * 100),
                    bisexual: Math.round((demographics[0].dataValues.bisexual_count / totalEntries) * 100),
                    transsexual: Math.round((demographics[0].dataValues.transsexual_count / totalEntries) * 100)
                },
                pcd: Math.round(demographics[0].dataValues.pcd_percentage)
            };

            return {
                status: 200,
                totalEntries,
                diversityPercentages
            };
        } else {
            return {
                status: 404,
                message: `Dados não encontrados para a tabela ${tableName}`
            };
        }
    } catch (error) {
        if (error instanceof Sequelize.ValidationError) {
            return {
                status: 400,
                message: `Requisição inválida: ${error.message}`
            };
        } else if (error instanceof Sequelize.AuthorizationError) {
            return {
                status: 401,
                message: "Não autorizado - falha na autenticação"
            };
        } else if (error instanceof Sequelize.ForbiddenError) {
            return {
                status: 403,
                message: "Proibido - falta de permissão"
            };
        } else {
            return {
                status: 500,
                message: "Erro interno do servidor. Por favor, tente novamente mais tarde."
            };
        }
    }
}

module.exposts = analyzeUserData
