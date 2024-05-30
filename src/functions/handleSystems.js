module.exports = (client) => {
    client.handleSystems = async (systemsFiles, path) => {
        for (const file of systemsFiles) {
            const systems = require(`../System's/${file}`);
            if (systems.once) {
                client.once(systems.name, (...args) => systems.execute(...args, client));
            } else {
                client.on(systems.name, (...args) => systems.execute(...args, client));
            }
        }
    };
}