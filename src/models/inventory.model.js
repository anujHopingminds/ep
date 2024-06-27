module.exports = (sequelize, Sequelize) => {
    const inventory = sequelize.define("inventory", {
        product_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        image: { type: Sequelize.TEXT },
        name: { type: Sequelize.TEXT },
        manufacturers: { type: Sequelize.TEXT },
        salt_composition: { type: Sequelize.TEXT },
        medicine_type: { type: Sequelize.TEXT },
        stock: { type: Sequelize.INTEGER },
        introduction: { type: Sequelize.TEXT },
        benefits: { type: Sequelize.TEXT },
        description: { type: Sequelize.TEXT },
        how_to_use: { type: Sequelize.TEXT },
        safety_advise: { type: Sequelize.TEXT },
        if_miss: { type: Sequelize.TEXT },
        Quantity: { type: Sequelize.TEXT },
        Package: { type: Sequelize.TEXT },
        Product_Form: { type: Sequelize.TEXT },
        MRP: { type: Sequelize.TEXT },
        discount_percent: { type: Sequelize.TEXT },
        views: { type: Sequelize.INTEGER  },
        users_bought: { type: Sequelize.INTEGER  },
        prescription_required: { type: Sequelize.BOOLEAN },
        label: { type: Sequelize.TEXT },
        Fact_Box: { type: Sequelize.TEXT },
        primary_use: { type: Sequelize.TEXT },
        storage: { type: Sequelize.TEXT },
        use_of: { type: Sequelize.TEXT },
        common_side_effect: { type: Sequelize.TEXT },
        alcoholInteraction: { type: Sequelize.TEXT },
        pregnancyInteraction: { type: Sequelize.TEXT },
        lactationInteraction: { type: Sequelize.TEXT },
        drivingInteraction: { type: Sequelize.TEXT },
        kidneyInteraction: { type: Sequelize.TEXT },
        liverInteraction: { type: Sequelize.TEXT },
        MANUFACTURER_ADDRESS: { type: Sequelize.TEXT },
        country_of_origin: { type: Sequelize.TEXT },
        for_sale: { type: Sequelize.TEXT },
        Q_A: { type: Sequelize.TEXT },

    });

    return inventory;
};
