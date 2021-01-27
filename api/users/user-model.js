const db = require('../../data/db-config')

module.exports = {
    get() {
        return db('users')
    },

    add(user) {
        return db('users').insert(user)
    },

    findBy(filter) {
        return db('users as u')
        .where(filter)
    },

    findById(id) {
        return db('users')
        .select('users.user_id')
        .where("users.user_id", id)
    }   
}