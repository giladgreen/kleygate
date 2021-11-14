module.exports = function (sequelize, DataTypes) {
    const Plates = sequelize.define('plates', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.TEXT,
        },
        data: {
            type: DataTypes.TEXT,
        },
        plateNumber: {
            type: DataTypes.TEXT,
            field: 'plate_number',
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at',
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at',
            allowNull: false,
        },
        deletedAt: {
            type: DataTypes.DATE,
            field: 'deleted_at',
            allowNull: true,
        },
        lastOpenedAt: {
            type: DataTypes.DATE,
            field: 'last_opened_at',
            allowNull: true,
        },
    }, {
        paranoid: true,
        tableName: 'plates',
    });

    return Plates;
};
