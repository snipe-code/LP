const { Events, ActivityType } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        // Array of custom activities
        const activities = [
            { name: 'Rašo kodą 💻', type: ActivityType.Custom },
            { name: 'Debugina projektą 🐛', type: ActivityType.Custom },
            { name: 'Tvarko duomenų bazę 🗄️', type: ActivityType.Custom },
            { name: 'Prižiūri Lietuvos programuotojus 👁️', type: ActivityType.Custom }
        ];
        let currentIndex = 0;

        // Set initial activity
        client.user.setActivity(activities[0].name, { type: activities[0].type });

        // Change activity every 10 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % activities.length;
            const newActivity = activities[currentIndex];
            
            client.user.setActivity(newActivity.name, { type: newActivity.type });
        }, 10000);
    },
};
